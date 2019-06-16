package pl.masi.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.ChoiceBean;
import pl.masi.beans.QuestionBean;
import pl.masi.entities.Choice;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.ChoiceRepository;
import pl.masi.repositories.QuestionRepository;
import pl.masi.repositories.QuestionTranslationRepository;
import pl.masi.repositories.TestRepository;
import pl.masi.services.interfaces.IChoiceService;
import pl.masi.services.interfaces.IQuestionService;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ChoiceService implements IChoiceService {

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionTranslationRepository questionTranslationRepository;

    @Override
    public void createChoice(ChoiceBean choiceBean) {
        Choice choice = Choice.builder().content(choiceBean.getContent()).build();
        if (choiceBean.getQuestionName() != null) {
            Question question = questionRepository.findByName(choiceBean.getQuestionName());
            if (choiceBean.getTranslationLanguageName() != null) {
                question.getQuestionTranslations().forEach(qt -> {
                    if (qt.getLanguage().getName().equals(choiceBean.getTranslationLanguageName())) {
                        choice.setQuestionTranslation(qt);
                    }
                });
            } else {
                choice.setQuestion(question);
            }
        }
        choiceRepository.save(choice);
    }

    @Override
    public void updateChoice(Long id, String content) {
        Choice choice = choiceRepository.findById(id).get();
        choice.setContent(content);
        choiceRepository.save(choice);
    }

    @Override
    public void deleteChoice(Long id) {
        Choice choice = choiceRepository.findById(id).get();
        choiceRepository.delete(choice);
    }
}
