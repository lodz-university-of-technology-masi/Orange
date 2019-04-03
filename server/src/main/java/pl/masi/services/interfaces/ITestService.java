package pl.masi.services.interfaces;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestService {

    boolean add(Test test);

    Test getByName(String name) throws AppException;

    List<Test> getAllTests();

    void deleteByName(String name) throws AppException;

    boolean updateTest(String name, Test test) throws AppException;
}
