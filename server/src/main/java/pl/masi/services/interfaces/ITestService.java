package pl.masi.services.interfaces;

import javassist.NotFoundException;
import org.springframework.web.multipart.MultipartFile;
import pl.masi.beans.TestBean;
import pl.masi.beans.alternative.TranslatedTestBean;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

public interface ITestService {

    void add(TestBean testBean);

    Test getByName(String name) throws AppException;

    TranslatedTestBean getTranslatedTest(String name, String preferredLanguageName) throws AppException;

    List<Test> getAllTests(String header, String positionName);

    void deleteByName(String name) throws AppException;

    void addQuestion(String testName, String questionName) throws AppException;

    void updatePosition(TestBean testBean) throws AppException;

    void deleteQuestion(String testName, String questionName) throws AppException;

    void translateTest(String testName, String targetLanguage) throws AppException;

    ByteArrayInputStream generateReport(String testName, String targetLanguage) throws NotFoundException;

    void importTest(String name, String positionName, String creatorUsername, MultipartFile multipartFile) throws AppException, IOException;
}
