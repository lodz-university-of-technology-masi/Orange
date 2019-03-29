package pl.masi.services.implementations;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import pl.masi.services.interfaces.IQuestionService;
import pl.masi.repositories.QuestionRepository;
import pl.masi.entities.Question;

import java.util.Optional;

@Service
public class QuestionService implements IQuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public boolean add(Question question) {
        return questionRepository.save(question) != null;
    }

    @Override
    public Optional<Question> get(Long id) {
        return questionRepository.findById(id);
    }

    @Override
    public boolean update(Question question) {
        return questionRepository.save(question) != null;
    }

    @Override
    public void delete(Long id) {
        questionRepository.deleteById(id);
    }
}
