package pl.masi.services.interfaces;
import pl.masi.beans.TestBean;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestService {

    void add(TestBean testBean);

    Test getByName(String name) throws AppException;

    List<Test> getAllTests();

    void deleteByName(String name) throws AppException;

    void updateQuestion(TestBean testBean);

    void updatePosition(TestBean testBean) throws AppException;
}
