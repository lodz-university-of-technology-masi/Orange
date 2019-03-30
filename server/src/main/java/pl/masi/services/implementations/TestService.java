package pl.masi.services.implementations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.ITestService;
import pl.masi.repositories.TestRepository;
import pl.masi.entities.Test;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TestService implements ITestService {

    @Autowired
    private TestRepository testRepository;

    @Override
    public boolean add(Test test) {
        return testRepository.save(test) != null;
    }

    @Override
    public Test getById(Long id) throws AppException {
        Test test;
        try {
            test = testRepository.findById(id).get();
        } catch (NoSuchElementException ex) {
            throw new AppException("TEST_NOT_FOUND", "Test with given id does not exists");
        }
        return test;
    }

    @Override
    public List<Test> getAllTests() {
        return (List<Test>) testRepository.findAll();
    }

    @Override
    public void deleteById(Long id) throws AppException {
        try {
            testRepository.deleteById(id);
        } catch (IllegalArgumentException ex) {
            throw new AppException("TEST_NOT_FOUND", "Test with given id does not exist.");
        }
    }

    @Override
    public boolean updateTest(Long id, Test test) throws AppException {
        test.setId(getById(id).getId());
        return testRepository.save(test) != null;
    }
}
