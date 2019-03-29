package pl.masi.services.implementations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pl.masi.entities.Permission;
import pl.masi.services.interfaces.ITestService;
import pl.masi.repositories.TestRepository;
import pl.masi.entities.Test;

import java.util.List;
import java.util.Optional;

@Service
public class TestService implements ITestService {

    @Autowired
    private TestRepository testRepository;

    @Override
    public boolean add(Test test) {
        return testRepository.save(test) != null;
    }

    @Override
    public Optional<Test> get(Long id) {
        return testRepository.findById(id);
    }

    @Override
    public boolean update(Test test) {
        return testRepository.save(test) != null;
    }

    @Override
    public void delete(Long id) {
        testRepository.deleteById(id);
    }

    @Override
    public List<Test> getAllTests() {
        return (List<Test>) testRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        testRepository.deleteById(id);
    }

    @Override
    public void setTestPermission(Long id, Permission permission) {

    }
}
