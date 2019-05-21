package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.AccountBean;
import pl.masi.beans.LanguageBean;
import pl.masi.entities.Account;
import pl.masi.entities.Language;
import pl.masi.entities.Position;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IAccountService;
import pl.masi.services.interfaces.ILanguageService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value="/language")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class LanguageController {

    private final ILanguageService languageService;

    @GetMapping(value = "/list", produces = "application/json")
    public List<LanguageBean> getLanguages() throws AppException {
        return languageService.getAll().stream().map(language -> LanguageBean.builder()
                .name(language.getName())
                .build()).collect(Collectors.toList());
    }

    @PostMapping(value = "/create", consumes = "application/json", produces = "application/json")
    public LanguageBean createLanguage(@RequestBody LanguageBean languageBean) throws AppException {
        Language newLanguage = languageService.createLanguage(Language.builder()
                .name(languageBean.getName())
                .build());
        return LanguageBean.builder()
                .name(newLanguage.getName())
                .build();
    }

    @DeleteMapping(value = "/delete/{name}")
    public void deletePosition(@PathVariable String name) throws AppException {
        languageService.deleteLanguage(name);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
