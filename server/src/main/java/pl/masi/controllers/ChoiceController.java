package pl.masi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.ChoiceBean;
import pl.masi.beans.TestResolutionBean;
import pl.masi.entities.TestResolution;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IChoiceService;
import pl.masi.services.interfaces.ITestResolutionService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value="/choice")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ChoiceController {

    private final IChoiceService choiceService;

    @PostMapping(value = "/create", consumes = "application/json")
    public void createChoice(@RequestBody ChoiceBean choiceBean) throws AppException {
        this.choiceService.createChoice(choiceBean);
    }

    @PutMapping(value = "/update", consumes = "application/json")
    public void updateChoice(@RequestBody ChoiceBean choiceBean) throws AppException {
        this.choiceService.updateChoice(Long.parseLong(choiceBean.getId()), choiceBean.getContent());
    }

    @DeleteMapping
    @RequestMapping(value = "/delete/{id}")
    public void updateTestResolution(@PathVariable Long id) {
        this.choiceService.deleteChoice(id);
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
