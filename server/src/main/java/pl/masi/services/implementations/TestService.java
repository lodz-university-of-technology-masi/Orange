package pl.masi.services.implementations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pl.masi.beans.TestBean;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.PositionRepository;
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

    @Override
    public void add(TestBean testBean) {
        Test newTest = Test.builder()
                .name(testBean.getTestName())
                .position(positionRepository.findByName(testBean.getPositionName()))
                .questions(null)
                .build();
        testRepository.save(newTest);
    }

    @Override
    public Test getByName(String name) throws AppException {
        Test test = testRepository.findByName(name);
        if (test == null) {
            throw new AppException("TEST_NOT_FOUND", "Test with given name doesn't exists");
        }
        return test;
    }

    @Override
    public List<Test> getAllTests() {
        return (List<Test>) testRepository.findAll();
    }

    @Override
    public void deleteByName(String name) throws AppException {
        Test testToDelete = getByName(name);
        if (testToDelete == null) {
            throw new AppException("TEST_NOT_FOUND", "Test with given name doesn't exists");
        }
        testRepository.deleteByName(testToDelete.getName());
    }

    @Override
    public boolean updateTest(String name, Test test) throws AppException {
        test.setName(getByName(name).getName());
        return testRepository.save(test) != null;
    }

    @Override
    public boolean attachPosition(String testName, String positionName) throws AppException {
        Test testToUpdate = testRepository.findByName(testName);
        if(testToUpdate.getPosition() != null) {
            throw new AppException("POSITION_ALREADY_ATTACHED", "Test with given name already has its target position.");
        }
        testToUpdate.setPosition(positionRepository.findByName(positionName));
        return testRepository.save(testToUpdate) != null;
    }
}
