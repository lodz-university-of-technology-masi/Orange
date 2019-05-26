package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pl.masi.beans.AccountBean;
import pl.masi.entities.Account;
import pl.masi.entities.Language;
import pl.masi.entities.Permission;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.AccountRepository;
import pl.masi.repositories.LanguageRepository;
import pl.masi.repositories.PermissionRepository;
import pl.masi.services.interfaces.IAccountService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class AccountService implements IAccountService {

    private final AccountRepository accountRepository;
    private final PermissionRepository permissionRepository;
    private final LanguageRepository languageRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    public List<AccountBean> getAll(String permissionName) throws AppException {
        List<Account> accounts;
        if(permissionName == null) {
            accounts = accountRepository.findAll();
        } else {
            Permission permission = getPermissionByName(permissionName);
            accounts = accountRepository.findByPermission(permission);
        }

        return accounts.stream()
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
        Optional<Account> account = accountRepository.findByUsername(username);
        if (!account.isPresent()) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        Language preferredLanguage = account.get().getPreferredLanguage();
        String preferredLanguageName = preferredLanguage != null ? preferredLanguage.getName() : null;
        return AccountBean.builder()
                .username(account.get().getUsername())
                .firstName(account.get().getFirstName())
                .lastName(account.get().getLastName())
                .permissionName(account.get().getPermission().getPermissionName())
                .preferredLanguageName(preferredLanguageName)
                .build();
    }

    @Override
    public Account createAccount(AccountBean accountBean) throws AppException {
        Permission permission = getPermissionByName(accountBean.getPermissionName());
        // nulled preferred language represents default (English) language
        Language preferredLanguage = null;
        if (accountBean.getPreferredLanguageName() != null && !accountBean.getPreferredLanguageName().isEmpty()) {
            preferredLanguage = getPreferredtLanguageByName(accountBean.getPreferredLanguageName());
        }

        Account accountToSave = Account.builder()
                .firstName(accountBean.getFirstName())
                .lastName(accountBean.getLastName())
                .username(accountBean.getUsername())
                .password(bCryptPasswordEncoder.encode(accountBean.getPassword()))
                .permission(permission)
                .preferredLanguage(preferredLanguage)
                .build();

        return accountRepository.save(accountToSave);
    }

    @Override
    public Account updateAccount(AccountBean accountBean) throws AppException {
        Optional<Account> accountToUpdate = accountRepository.findByUsername(accountBean.getUsername());
        if (!accountToUpdate.isPresent()) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        accountToUpdate.get().setFirstName(accountBean.getFirstName());
        accountToUpdate.get().setLastName(accountBean.getLastName());
        accountToUpdate.get().setPermission(permissionRepository.findByPermissionName(accountBean.getPermissionName()));
        if (accountBean.getPreferredLanguageName() != null && !accountBean.getPreferredLanguageName().isEmpty()) {
            accountToUpdate.get().setPreferredLanguage(getPreferredtLanguageByName(accountBean.getPreferredLanguageName()));
        } else {
            // nulled preferred language represents default (English) language
            accountToUpdate.get().setPreferredLanguage(null);
        }
        if (accountBean.getPassword() != null && !accountBean.getPassword().isEmpty()) {
            accountToUpdate.get().setPassword(bCryptPasswordEncoder.encode(accountBean.getPassword()));
        }

        return accountRepository.save(accountToUpdate.get());
    }

    @Override
    public void deleteAccount(String username) throws AppException {
        Optional<Account> account = accountRepository.findByUsername(username);
        if (!account.isPresent()) {
            throw new AppException("ACCOUNT_NOT_FOUND", "Account with given username doesn't exists");
        }
        accountRepository.delete(account.get());
    }

    private Permission getPermissionByName(String permissionName) throws AppException {
        Permission result = permissionRepository.findByPermissionName(permissionName);
        if(result == null) {
            throw new AppException("PERMISSION_NOT_FOUND", "Permission with given name doesn't exists");
        }
        return result;
    }

    private Language getPreferredtLanguageByName(String languageName) throws AppException {
        Language result = languageRepository.findByName(languageName);
        if(result == null) {
            throw new AppException("LANGUAGE_NOT_FOUND", "Language with given name doesn't exists");
        }
        return result;
    }
}