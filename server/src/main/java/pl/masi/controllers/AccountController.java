package pl.masi.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController(value = "/account")
public class AccountController {

    @GetMapping
    public String getAccount(){
        return "Hello World";
    }
}
