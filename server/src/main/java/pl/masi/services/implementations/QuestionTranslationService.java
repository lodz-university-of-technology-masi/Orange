package pl.masi.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.QuestionBean;
import pl.masi.beans.QuestionTranslationBean;
import pl.masi.entities.Language;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.LanguageRepository;
import pl.masi.repositories.QuestionRepository;
import pl.masi.repositories.QuestionTranslationRepository;
import pl.masi.repositories.TestRepository;
import pl.masi.services.interfaces.IQuestionService;
import pl.masi.services.interfaces.IQuestionTranslationService;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class QuestionTranslationService implements IQuestionTranslationService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private LanguageRepository languageRepository;

    @Autowired
    private QuestionTranslationRepository questionTranslationRepository;

    @Override
    public void add(QuestionTranslation questionTranslation) {
        Language language = languageRepository.findByName(questionTranslation.getLanguage().getName());
        Question question = questionRepository.findByName(questionTranslation.getQuestion().getName());
        questionTranslation.setLanguage(language);
        questionTranslation.setQuestion(question);
        questionTranslationRepository.save(questionTranslation);
    }

    @Override
    public void update(QuestionTranslation questionTranslation) {
        Language language = languageRepository.findByName(questionTranslation.getLanguage().getName());
        Question question = questionRepository.findByName(questionTranslation.getQuestion().getName());
        QuestionTranslation updatedQT = questionTranslationRepository.findByQuestionAndLanguage(question, language);
        updatedQT.setContent(questionTranslation.getContent());
        questionTranslationRepository.save(updatedQT);
    }

}
