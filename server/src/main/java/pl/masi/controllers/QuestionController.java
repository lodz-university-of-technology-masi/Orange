package pl.masi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.ChoiceBean;
import pl.masi.beans.QuestionBean;
import pl.masi.beans.QuestionTranslationBean;
import pl.masi.entities.Question;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IQuestionService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

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
    public QuestionBean getQuestionByName(@PathVariable String name) throws AppException {
        Question question = questionService.getByName(name);
        return QuestionBean.builder()
                .name(question.getName())
                .content(question.getContent())
                .questionType(question.getQuestionType())
                .questionTranslations(question.getQuestionTranslations().stream().map(qt ->
                        QuestionTranslationBean.builder()
                                .languageName(qt.getLanguage().getName())
                                .content(qt.getContent())
                                .build()).collect(Collectors.toList()))
                .choices(question.getChoices().stream().map(ch ->
                        ChoiceBean.builder().content(ch.getContent()).id(ch.getId().toString()).build())
                    .collect(Collectors.toList()))
                .build();
    }

    @PutMapping
    public void update(@RequestBody QuestionBean questionBean) throws AppException {
        questionService.update(questionBean);
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
