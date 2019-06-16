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
import pl.masi.beans.TestBean;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.alternative.TranslatedQuestionBean;
import pl.masi.beans.alternative.TranslatedTestBean;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.enums.PermissionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.*;
import pl.masi.services.interfaces.ITestService;
import pl.masi.entities.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
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
            q.getQuestionTranslations().forEach(qt -> {
                if (qt.getLanguage().getName().equals(preferredLanguageName)) {
                    translation[0] = qt.getContent();
                }
            });
            translatedQuestions.add(
                    TranslatedQuestionBean.builder()
                            .name(q.getName())
                            .original(q.getContent())
                            .translation(translation[0])
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
                        .build();
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
}
