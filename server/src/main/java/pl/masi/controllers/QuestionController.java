package pl.masi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.QuestionBean;
import pl.masi.entities.Question;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IQuestionService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/question")
public class QuestionController {
    @Autowired
    private IQuestionService questionService;

    @PostMapping
    public void addQuestion(@RequestBody QuestionBean questionBean) {
        questionService.add(questionBean);
    }

    @GetMapping
    @RequestMapping(value = "/list")
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @GetMapping
    @RequestMapping(value = "/listQuestionType")
    public List<String> getAllQuestionType() {
        return questionService.getAllQuestionType();
    }

    @GetMapping
    @RequestMapping(value = "/{name}")
    public Question getQuestionByName(@PathVariable String name) throws AppException {
        return questionService.getByName(name);
    }

    @DeleteMapping(value = "/{name}")
    public void deleteQuestionByName(@PathVariable String name) throws AppException {
        questionService.deleteByName(name);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
