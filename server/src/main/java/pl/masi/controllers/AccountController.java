package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.masi.beans.AccountBean;
import pl.masi.entities.Account;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IAccountService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value="/account")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountController {

    private final IAccountService accountService;

    @GetMapping(value = "/{username}")
    public AccountBean getAccount(@PathVariable("username") String username, Authentication authentication) throws AppException {
        return accountService.getAccount(username);
    }

    @GetMapping(value = "")
    public List<AccountBean> getAccounts(@Param("permissionName") String permissionName) throws AppException {
        return accountService.getAll(permissionName);
    }

    @PostMapping(value = "/create")
    public Account createAccount(@RequestBody AccountBean accountBean) throws AppException {
        return  accountService.createAccount(accountBean);
    }

    @PutMapping(value = "/update", consumes = "application/json", produces = "application/json")
    public AccountBean updateAccount(@RequestBody AccountBean accountBean) throws AppException {
        Account acc = accountService.updateAccount(accountBean);
        return AccountBean.builder()
                .username(acc.getUsername())
                .firstName(acc.getFirstName())
                .lastName(acc.getLastName())
                .permissionName(acc.getPermission().getPermissionName())
                .preferredLanguageName(acc.getPermission().getPermissionName())
                .build();
    }

    @DeleteMapping(value = "/delete/{username}")
    public ResponseEntity deleteAccount(@PathVariable String username) throws Exception {
        accountService.deleteAccount(username);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
