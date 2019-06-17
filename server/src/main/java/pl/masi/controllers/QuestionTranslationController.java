package pl.masi.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pl.masi.beans.LanguageBean;
import pl.masi.beans.QuestionTranslationBean;
import pl.masi.entities.Choice;
import pl.masi.entities.Language;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.exceptions.AppException;
import pl.masi.services.interfaces.IQuestionTranslationService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/questionTranslation")
public class QuestionTranslationController {
    @Autowired
    private IQuestionTranslationService questionTranslationService;

    @PostMapping
    public void addQuestionTranslation(@RequestBody QuestionTranslationBean qtb) {
        QuestionTranslation qt = QuestionTranslation.builder()
                                    .content(qtb.getContent())
                                    .language(Language.builder().name(qtb.getLanguageName()).build())
                                    .question(Question.builder().name(qtb.getQuestionName()).build())
                                    .build();
        List<Choice> choices = new ArrayList<>();
        qtb.getChoices().forEach(ch -> {
            choices.add(Choice.builder().content(ch.getContent()).questionTranslation(qt).build());
        });
        qt.setChoices(choices);
        questionTranslationService.add(qt);
    }

    @PutMapping
    public void updateQuestionTranslation(@RequestBody QuestionTranslationBean qtb) {
        QuestionTranslation qt = QuestionTranslation.builder()
                                    .content(qtb.getContent())
                                    .language(Language.builder().name(qtb.getLanguageName()).build())
                                    .question(Question.builder().name(qtb.getQuestionName()).build())
                                    .build();
        questionTranslationService.update(qt);
    }

    @ExceptionHandler({AppException.class})
    public void handleException(AppException appException, HttpServletResponse response) throws IOException {
        response.sendError(HttpStatus.BAD_REQUEST.value(), appException.toString());
    }
}
