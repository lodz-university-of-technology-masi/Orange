package pl.masi.services.implementations;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfWriter;
import javassist.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import pl.masi.beans.TestBean;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.alternative.TranslatedQuestionBean;
import pl.masi.beans.alternative.TranslatedTestBean;
import pl.masi.entities.Choice;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.enums.PermissionType;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.*;
import pl.masi.services.interfaces.ITestService;
import pl.masi.entities.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Transactional
public class TestService implements ITestService {

    private static String DEFAULT_LANG = "English";

    @Autowired
    private TestRepository testRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private LanguageRepository languageRepository;
    @Autowired
    private QuestionTranslationService questionTranslationService;

    private TranslationService translationService=new TranslationService();

    @Override
    public void add(TestBean testBean) {
        Test newTest = Test.builder()
                .name(testBean.getTestName())
                .position(positionRepository.findByName(testBean.getPositionName()))
                .questions(null)
                .creatorUsername(accountRepository.findByUsername(testBean.getCreatorUsername()).get())
                .build();
        testRepository.save(newTest);
    }

    @Override
    public Test getByName(String name) throws AppException {
        Test test = testRepository.findByName(name);
        if (test == null) {
            throw new AppException("TEST_NOT_FOUND", "Test with " + name + " name doesn't exists");
        }
        return test;
    }

    @Override
    public TranslatedTestBean getTranslatedTest(String name, String preferredLanguageName) throws AppException {
        Test test = testRepository.findByName(name);
        if (test == null) {
            throw new AppException("TEST_NOT_FOUND", "Test with " + name + " name doesn't exists");
        }
        List<TranslatedQuestionBean> translatedQuestions = new ArrayList<TranslatedQuestionBean>();
        test.getQuestions().forEach(q -> {
            String[] translation = new String[1];
            List<String>[] translatedChoices = new List[1];
            q.getQuestionTranslations().forEach(qt -> {
                if (qt.getLanguage().getName().equals(preferredLanguageName)) {
                    translation[0] = qt.getContent();
                    translatedChoices[0] = qt.getChoices().stream().map(ch -> ch.getContent()).collect(Collectors.toList());
                }
            });
            translatedQuestions.add(
                    TranslatedQuestionBean.builder()
                            .name(q.getName())
                            .original(q.getContent())
                            .choices(q.getChoices().stream().map(ch -> ch.getContent()).collect(Collectors.toList()))
                            .translation(translation[0])
                            .translatedChoices(translatedChoices[0])
                            .questionType(q.getQuestionType().toString())
                            .build());
        });
        return TranslatedTestBean.builder()
                .testName(test.getName())
                .positionName(test.getPosition().getName())
                .languageName(preferredLanguageName)
                .translatedQuestions(translatedQuestions)
                .build();
    }

    @Override
    public List<Test> getAllTests(String header, String positionName) {
        JsonObject jsonHeader = new JsonParser().parse(header).getAsJsonObject();
        String role = jsonHeader.get("permissionName").getAsString();
        if (positionName != null) {
            return testRepository.findByPositionName(positionName);
        }
        if (role.equals(PermissionType.permissionTypeMap.get(PermissionType.PermissionTypeEnum.EDITOR))) {
            String username = jsonHeader.get("username").getAsString();
            return testRepository.findByCreatorUsernameUsername(username);
        } else {
            return (List<Test>) testRepository.findAll();
        }
    }

    @Override
    public void deleteByName(String name) throws AppException {
        Test testToDelete = getByName(name);
        testRepository.deleteByName(testToDelete.getName());
    }

    @Override
    public void addQuestion(String testName, String questionName) throws AppException {
        Test testToUpdate = getByName(testName);
        Question questionToAdd = questionRepository.findByName(questionName);
        if (!testToUpdate.getQuestions().contains(questionToAdd)) {
            testToUpdate.getQuestions().add(questionToAdd);
        } else {
            throw new AppException("QUESTION_ALREADY_ADDED", "Question with " + questionName + " is already added to the" + testName + ".");
        }
        testRepository.save(testToUpdate);

    }

    @Override
    public void updatePosition(TestBean testBean) throws AppException {
        Test testToUpdate = getByName(testBean.getTestName());
        testToUpdate.setPosition(positionRepository.findByName(testBean.getPositionName()));
        testRepository.save(testToUpdate);
    }

    @Override
    public void deleteQuestion(String testName, String questionName) throws AppException {
        Test testToUpdate = getByName(testName);

        if (testToUpdate.getQuestions().contains(questionRepository.findByName(questionName))) {
            testToUpdate.getQuestions().remove(questionRepository.findByName(questionName));
        } else {
            throw new AppException("QUESTION_NOT_EXIST", "Question with " + questionName + " is not added to the" + testName + ".");
        }
        testRepository.save(testToUpdate);
    }

    @Override
    public void translateTest(String testName, String targetLanguage) throws AppException {
        Test testToTranslate = getByName(testName);
        for (Question q : testToTranslate.getQuestions()) {
            boolean translationExist = false;
            for (QuestionTranslation qt : q.getQuestionTranslations()) {
                if (qt.getLanguage().getName().equalsIgnoreCase(targetLanguage)) {
                    translationExist = true;
                }
            }
            if (!translationExist) {
                List<QuestionTranslation> translations = q.getQuestionTranslations();
                QuestionTranslation translation = QuestionTranslation.builder()
                        .question(q)
                        .language(languageRepository.findByName(targetLanguage))
                        .content(translationService.translateText(q.getContent(), "pl"))
                        .choices(q.getChoices().stream().map(ch ->
                                    Choice.builder()
                                        .content(translationService.translateText(ch.getContent(), "pl"))
                                        .build())
                                .collect(Collectors.toList()))
                        .build();
                translation.getChoices().forEach(ch -> {
                    ch.setQuestionTranslation(translation);
                });
                questionTranslationService.add(translation);
                translations.add(translation);
                q.setQuestionTranslations(translations);
            }
        }
        testRepository.save(testToTranslate);
    }

    @Override
    public ByteArrayInputStream generateReport(String testName, String targetLanguage) throws NotFoundException {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Test test = testRepository.findByName(testName);

        if(test == null) {
            throw new NotFoundException("Test not found in database");
        }

        try{
            BaseFont baseFont= BaseFont.createFont("./arial.ttf", BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font font = new Font(baseFont);
            PdfWriter pdfWriter = PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Test: " + test.getName(), font));
            document.add(new Paragraph("Position: " + test.getPosition().getName(), font));
            document.add(new Paragraph("Language: " + targetLanguage, font));

            int number = 0;
            for (Question question : test.getQuestions()) {
                number++;
                document.add(new Paragraph("\nQuestion " + number + ": ", font));
                document.add(new Paragraph("Name: " + question.getName(), font));
                if(DEFAULT_LANG.equals(targetLanguage)){
                    document.add(new Paragraph("Content: " + question.getContent(), font));
                } else if(languageRepository.findByName(targetLanguage) != null) {
                    Optional<String> questionContent = question.getQuestionTranslations().stream()
                                .filter(questionTranslation -> targetLanguage.equals(questionTranslation.getLanguage().getName()))
                                .findFirst()
                                .map(QuestionTranslation::getContent);

                    if(questionContent.isPresent()){
                        document.add(new Paragraph("Content: "  + questionContent.get(), font));
                    } else {
                        document.add(new Paragraph("Content: "  + question.getContent(), font));
                    }
                }

            }

            document.close();
            pdfWriter.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public void importTest(String name, String positionName, MultipartFile multipartFile) throws AppException, IOException {
        Test test = Test.builder().name(name).build();
        List<Question> questions = new ArrayList<>();
        test.setQuestions(null);
        test.setPosition(positionRepository.findByName(positionName));
        byte[] fileBytes = multipartFile.getBytes();
        StringBuilder builder = new StringBuilder();
        for(int i = 0; i < fileBytes.length; i++) {
            builder.append((char)fileBytes[i]);
        }
        String[] questionStrings = builder.toString().split("(\\r\\n\\s*|\\n\\s*|\\r\\s*)");
        for(int i = 0; i < questionStrings.length; i++) {
            String questionString = questionStrings[i];
            String[] questionParts = questionString.split(";");
            if (questionParts[2].toUpperCase().equals("EN")) {
                Question q = questionFromCsv(questionParts, name + "_" + (i + 1));
                if (q != null)
                    questions.add(q);
            } else if (questionParts[2].toUpperCase().equals("PL")) {
            }
        }
        for (Question q : questions) {
            questionRepository.save(q);
        }
        test.setQuestions(questions);
        testRepository.save(test);
    }

    private Question questionFromCsv(String[] questionParts, String name) {
        Question q = new Question();
        QuestionType type = getQuestionTypeFromCsv(questionParts[1]);
        if (type==null)
            return null;
        q.setQuestionType(type);
        q.setName(name);
        q.setContent(questionParts[3]);
        if (type.equals(QuestionType.CHOICE)) {
            List<Choice> choices = new ArrayList<>();
            for (int i = 4; i < questionParts.length; i++) {
                choices.add(Choice.builder().question(q).content(questionParts[i]).build());
            }
            if (choices.isEmpty()) {
                return null;
            }
            q.setChoices(choices);
        }
        return q;
    }

    private QuestionType getQuestionTypeFromCsv(String identifier) {
        switch (identifier.toUpperCase()) {
            case "O":
                return QuestionType.OPEN;
            case "W":
                return QuestionType.CHOICE;
            case "S":
                return QuestionType.SCALE;
            case "L":
                return QuestionType.NUMERICAL;
            default:
                return null;
        }
    }
}
