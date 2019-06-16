package pl.masi.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.beans.QuestionBean;
import pl.masi.entities.Choice;
import pl.masi.entities.Question;
import pl.masi.entities.Test;
import pl.masi.enums.QuestionType;
import pl.masi.exceptions.AppException;
import pl.masi.repositories.ChoiceRepository;
import pl.masi.repositories.QuestionRepository;
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
