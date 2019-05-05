package pl.masi.services.interfaces;

import pl.masi.beans.TestBean;
import pl.masi.entities.Test;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestService {

    void add(TestBean testBean);

    Test getByName(String name) throws AppException;

    List<Test> getAllTests(String header);

    void deleteByName(String name) throws AppException;

    void addQuestion(String testName, String questionName) throws AppException;

    void updatePosition(TestBean testBean) throws AppException;

    void updateName(String oldName, TestBean testBean) throws AppException;

    void deleteQuestion(String testName, String questionName) throws AppException;
}
