package pl.masi.services.implementations;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.TestBean;
import pl.masi.beans.TestResolutionBean;
import pl.masi.entities.*;
import pl.masi.enums.PermissionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.*;
import pl.masi.services.interfaces.ITestResolutionService;
import pl.masi.services.interfaces.ITestService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class TestResolutionService implements ITestResolutionService {

    @Autowired
    private TestResolutionRepository testResolutionRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public void addTestResolution(TestResolutionBean testResolutionBean) throws AppException {

        Test test = testRepository.findByName(testResolutionBean.getTestName());
        Account account = accountRepository.findByUsername(testResolutionBean.getUsername()).get();

        List<QuestionAnswer> questionAnswers = new ArrayList<>();
        TestResolution testResolution = TestResolution.builder()
                .test(test)
                .account(account)
                .date(new Date())
                .isChecked(false)
                .build();
        testResolutionBean.getQuestionAnswers().forEach(qab -> {
            Question q = questionRepository.findByName(qab.getQuestionName());
            questionAnswers.add(QuestionAnswer.builder().testResolution(testResolution).question(q)
                                    .content(qab.getContent()).build());
        });
        testResolution.setQuestionAnswers(questionAnswers);
        testResolutionRepository.save(testResolution);
    }

    @Override
    public List<TestResolution> getAllResolvedTests(String header) {
        JsonObject jsonHeader = new JsonParser().parse(header).getAsJsonObject();
        String role = jsonHeader.get("permissionName").getAsString();
        if (role.equals(PermissionType.permissionTypeMap.get(PermissionType.PermissionTypeEnum.EDITOR))) {
            String username = jsonHeader.get("username").getAsString();
            return testResolutionRepository.findTestResolutionsByTestCreatorUsernameUsernameAndIsCheckedFalse(username);
        } else {
            return testResolutionRepository.findAll();
        }
    }

    @Override
    public TestResolution getTestResolutionById(Long id) {
        return testResolutionRepository.findTestResolutionById(id);
    }

    @Override
    public List<TestResolution> getTestResolutionsByTestName(String header, String testName) {
        JsonObject jsonHeader = new JsonParser().parse(header).getAsJsonObject();
        String role = jsonHeader.get("permissionName").getAsString();
        if (role.equals(PermissionType.permissionTypeMap.get(PermissionType.PermissionTypeEnum.EDITOR))) {
            String username = jsonHeader.get("username").getAsString();
            return testResolutionRepository.findTestResolutionsByTestCreatorUsernameUsernameAndTestName(username, testName);
        } else {
            return testResolutionRepository.findAll();
        }
    }

    @Override
    public void updateTestResolution(TestResolutionBean testResolutionBean) {
        TestResolution testResolutionToUpdate = testResolutionRepository.findByAccountUsernameAndTestName(
                testResolutionBean.getUsername(), testResolutionBean.getTestName());
        testResolutionToUpdate.setIsChecked(true);
        testResolutionRepository.save(testResolutionToUpdate);
    }
}
