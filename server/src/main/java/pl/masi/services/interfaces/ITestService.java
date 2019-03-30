package pl.masi.services.interfaces;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestService {

    boolean add(Test test);

    Test getById(Long id) throws AppException;

    List<Test> getAllTests();

    void deleteById(Long id) throws AppException;

    boolean updateTest(Long id, Test test) throws AppException;
}
