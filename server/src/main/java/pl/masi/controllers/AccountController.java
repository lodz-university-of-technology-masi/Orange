package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.masi.services.interfaces.IAccountService;

@RestController(value = "/account")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountController {

    private final IAccountService accountService;

    @GetMapping
    public String getAccount(){
        return "Hello World";
    }
}
