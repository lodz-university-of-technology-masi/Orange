package pl.masi.services.implementations;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.masi.entities.QuestionAnswer;
import pl.masi.repositories.QuestionAnswerRepository;
import pl.masi.services.interfaces.IQuestionAnswerService;

import java.util.List;

@Service
@Transactional
public class QuestionAnswerService implements IQuestionAnswerService {

    @Autowired
    private QuestionAnswerRepository qaRepository;

    @Override
    public List<QuestionAnswer> getAllAnswersForGivenTestResolution(Long id) {
        return qaRepository.findAllByTestResolutionId(id);
    }
}
