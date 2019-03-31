package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.masi.beans.AccountBean;
import pl.masi.entities.Account;
import pl.masi.entities.Permission;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.AccountRepository;
import pl.masi.repositories.PermissionRepository;
import pl.masi.services.interfaces.IAccountService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final PermissionRepository permissionRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public List<AccountBean> getAll() {
        return accountRepository.findAll().stream()
                .map(account -> AccountBean.builder()
                        .firstName(account.getFirstName())
                        .lastName(account.getLastName())
                        .username(account.getUsername())
                        .permissionName(account.getPermission().getPermissionName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public AccountBean getAccount(String username) throws AppException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        return AccountBean.builder()
                .username(account.getUsername())
                .firstName(account.getFirstName())
                .lastName(account.getLastName())
                .permissionName(account.getPermission().getPermissionName())
                .build();
    }

    @Override
    public Account createAccount(AccountBean accountBean) throws AppException {

        Permission permission = permissionRepository.findByPermissionName(accountBean.getPermissionName());
        if( permission == null) {
            throw new AppException("PERMISSION_NOT_FOUND", "Permission with given name doesn't exists");
        }

        Account accountToSave = Account.builder()
                .firstName(accountBean.getFirstName())
                .lastName(accountBean.getLastName())
                .username(accountBean.getUsername())
                .password(bCryptPasswordEncoder.encode(accountBean.getPassword()))
                .permission(permission)
                .build();

        return accountRepository.save(accountToSave);
    }

    @Override
    public Account updateAccount(AccountBean accountBean) throws AppException {
        Account accountToUpdate = accountRepository.findByUsername(accountBean.getUsername());
        if (accountToUpdate == null) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        accountToUpdate.setFirstName(accountBean.getFirstName());
        accountToUpdate.setLastName(accountBean.getLastName());
        accountToUpdate.setPermission(permissionRepository.findByPermissionName(accountBean.getPermissionName()));
        if (accountBean.getPassword() != null && !accountBean.getPassword().isEmpty()) {
            accountToUpdate.setPassword(bCryptPasswordEncoder.encode(accountBean.getPassword()));
        }

        return accountRepository.save(accountToUpdate);
    }

    @Override
    public void deleteAccount(String username) throws AppException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        accountRepository.delete(account);
    }
}