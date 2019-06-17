package pl.masi.controllers;

import com.opencsv.CSVWriter;
import javassist.NotFoundException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.multipart.MultipartFile;
import pl.masi.beans.TestBean;
import pl.masi.beans.alternative.TranslatedTestBean;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/test")
@CrossOrigin(value = {"*"}, exposedHeaders = {"Content-Disposition"})
public class TestController {

    @Autowired
    private ITestService testService;
    @Autowired
    private HttpServletRequest request;


    @PostMapping
    public void addTest(@RequestBody TestBean testBean) {
        testService.add(testBean);
    }

    @GetMapping
    @RequestMapping(value = "/list")
    public List<Test> getAllTests(@Param("positionName") String positionName) {
        return testService.getAllTests(request.getHeader("role"), positionName);
    }

    @GetMapping
    @RequestMapping(value = "/{name}")
    public Test getTestByName(@PathVariable String name) throws AppException {
        return testService.getByName(name);
    }

    @GetMapping
    @RequestMapping(value = "/translated/{name}")
    public TranslatedTestBean getTranslatedTestByName(@Param("preferredLanguageName") String preferredLanguageName,
                                                      @PathVariable String name) throws AppException {
        return testService.getTranslatedTest(name, preferredLanguageName);
    }

    @DeleteMapping(value = "/{name}")
    public void deleteTestByName(@PathVariable String name) throws AppException {
        testService.deleteByName(name);
    }

    @PutMapping(value = "/{testName}/{questionName}")
    public void addQuestion(@PathVariable String testName, @PathVariable String questionName) throws AppException {
        testService.addQuestion(testName, questionName);
    }

    @PutMapping(value = "/updatePosition")
    public void updatePosition(@RequestBody TestBean testBean) throws AppException {
        testService.updatePosition(testBean);
    }

    @DeleteMapping(value = "/{testName}/{questionName}")
    public void deleteQuestion(@PathVariable String testName, @PathVariable String questionName) throws AppException {
        testService.deleteQuestion(testName, questionName);
    }

    @PutMapping(value= "/translate/{testName}/{targetLanguage}")
    public void translateTest(@PathVariable String testName, @PathVariable String targetLanguage) throws AppException {
        testService.translateTest(testName, targetLanguage);
    }

    @GetMapping(value = "/generatePdf/{testName}/{targetLanguage}",
            produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<InputStreamResource> generateReport(@PathVariable String testName, @PathVariable String targetLanguage) throws NotFoundException {

        HttpHeaders headers = new HttpHeaders();
        String filename = testName + ".pdf";
        String headerKey = "Content-Disposition";
        String headerValue = String.format("inline; filename=\"%s\"", filename);
        headers.add(headerKey, headerValue);

        ByteArrayInputStream bis = testService.generateReport(testName, targetLanguage);

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }


    @PostMapping
    @RequestMapping(value= "/import")
    @Transactional(rollbackFor=Exception.class)
    public void importTest(@NotNull @RequestParam("name") String name, @NotNull @RequestParam("positionName") String positionName,
                           @NotNull @RequestParam("file") MultipartFile multipartFile) throws AppException, IOException {
        testService.importTest(name, positionName, multipartFile);
    }

    @GetMapping
    @RequestMapping(value = "/export/{testName}/{languageName}")
    public void exportTest(HttpServletResponse response, @PathVariable String testName, @PathVariable String languageName) throws AppException, IOException, Exception {

        CSVWriter csvWriter = new CSVWriter(response.getWriter(),
                ';',
                CSVWriter.NO_QUOTE_CHARACTER,
                CSVWriter.DEFAULT_ESCAPE_CHARACTER,
                CSVWriter.DEFAULT_LINE_END);

        Test test = testService.getByName(testName);

        for (int i = 0; i < test.getQuestions().size(); i++) {
            Question question = test.getQuestions().get(i);
            List<String> row = new ArrayList<>();
            row.add(Integer.toString(i));
            switch (question.getQuestionType()) {
                case CHOICE:
                    row.add("W");
                    break;
                case NUMERICAL:
                    row.add("L");
                    break;
                case SCALE:
                    row.add("S");
                    break;
                case OPEN:
                    row.add("O");
                    break;
            }
            if (languageName.equals("English")) {
                row.add("EN");
                row.add(question.getContent());
                if (question.getQuestionType().equals(QuestionType.CHOICE)) {
                    question.getChoices().forEach(ch -> row.add(ch.getContent()));
                } else {
                    row.add("|");
                }
            } else if (languageName.equals("Polski")) {
                boolean translationPresent = false;
                for (int j = 0; j < question.getQuestionTranslations().size(); j++) {
                    QuestionTranslation translation = question.getQuestionTranslations().get(j);
                    if (translation.getLanguage().getName().equals(languageName)) {
                        translationPresent = true;
                        row.add("PL");
                        row.add(translation.getContent());
                        if (question.getQuestionType().equals(QuestionType.CHOICE)) {
                            translation.getChoices().forEach(ch -> row.add(ch.getContent()));
                        } else {
                            row.add("|");
                        }
                    }
                }
                if (!translationPresent) {
                    row.add("EN");
                    row.add(question.getContent());
                    if (question.getQuestionType().equals(QuestionType.CHOICE)) {
                        question.getChoices().forEach(ch -> row.add(ch.getContent()));
                    } else {
                        row.add("|");
                    }
                }
            } else {
                throw new AppException("400", "Cannot export test, selected language is not supported.");
            }
            row.add("");
            csvWriter.writeNext(row.toArray(new String[row.size()]));
        }
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.getDescription());
    }

    @ExceptionHandler({IOException.class})
    public void handleException(IOException ioException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), ioException.toString());
    }

    @ExceptionHandler({Exception.class})
    public void handleException(Exception exception, HttpServletResponse response) throws Exception {
        response.sendError(HttpStatus.BAD_REQUEST.value(), exception.toString());
    }
}
