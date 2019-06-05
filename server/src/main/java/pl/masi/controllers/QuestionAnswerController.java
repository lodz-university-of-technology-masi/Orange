package pl.masi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.entities.QuestionAnswer;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IQuestionAnswerService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping(value = "/questionAnswer")
public class QuestionAnswerController {

    @Autowired
    private IQuestionAnswerService questionAnswerService;

    @GetMapping(value = "/list/{id}", produces = "application/json")
    public List<QuestionAnswer> getLanguages(@PathVariable Long id) {
        return questionAnswerService.getAllAnswersForGivenTestResolution(id);
    }

    @ExceptionHandler({Exception.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
