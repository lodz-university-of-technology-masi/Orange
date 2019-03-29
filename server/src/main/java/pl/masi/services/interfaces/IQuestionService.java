package pl.masi.services.interfaces;
import pl.masi.entities.Question;

import java.util.Optional;

public interface IQuestionService {

    boolean add(Question question);

    Optional<Question> get(Long id);

    boolean update(Question question);

    void delete(Long id);
}
