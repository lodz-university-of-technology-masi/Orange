package pl.masi.controllers;

import javassist.NotFoundException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import pl.masi.beans.TestBean;
import pl.masi.beans.alternative.TranslatedTestBean;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestService;
import pl.masi.entities.Test;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/test")
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

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
