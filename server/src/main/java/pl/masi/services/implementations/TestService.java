package pl.masi.services.implementations;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pl.masi.beans.TestBean;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.entities.Question;
import pl.masi.enums.PermissionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.AccountRepository;
import pl.masi.repositories.PositionRepository;
import pl.masi.repositories.QuestionRepository;
import pl.masi.services.interfaces.ITestService;
import pl.masi.repositories.TestRepository;
import pl.masi.entities.Test;

import java.util.List;

@Service
@Transactional
public class TestService implements ITestService {

    @Autowired
    private TestRepository testRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private AccountRepository accountRepository;

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
    public void updateName(String oldName, TestBean testBean) throws AppException {
        Test testToUpdate = getByName(oldName);
        testToUpdate.setName(testBean.getTestName());
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
}
