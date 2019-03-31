package pl.masi.services.interfaces;

import pl.masi.beans.AccountBean;
import pl.masi.entities.Account;
import pl.masi.exceptions.AppException;

import java.util.List;

public interface IAccountService {
    List<AccountBean> getAll();
    AccountBean getAccount(String username) throws AppException;
    Account createAccount(AccountBean accountBean) throws AppException;
    Account updateAccount(AccountBean accountBean) throws AppException;
    void deleteAccount(String username) throws AppException;
}
