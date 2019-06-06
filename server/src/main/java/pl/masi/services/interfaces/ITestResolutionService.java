package pl.masi.services.interfaces;

import pl.masi.beans.AccountBean;
import pl.masi.beans.TestResolutionBean;
import pl.masi.entities.Account;
import pl.masi.entities.TestResolution;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestResolutionService {
    void addTestResolution(TestResolutionBean testResolutionBean) throws AppException;
    List<TestResolution> getAllResolvedTests(String header);
    TestResolution getTestResolutionById(Long id);
    List<TestResolution> getTestResolutionsByTestName(String header, String testName);
    void updateTestResolution(TestResolutionBean testResolutionBean);
}
