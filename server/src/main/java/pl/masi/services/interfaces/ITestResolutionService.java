package pl.masi.services.interfaces;

import pl.masi.beans.AccountBean;
import pl.masi.beans.TestResolutionBean;
import pl.masi.entities.Account;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface ITestResolutionService {
    void addTestResolution(TestResolutionBean testResolutionBean) throws AppException;
}
