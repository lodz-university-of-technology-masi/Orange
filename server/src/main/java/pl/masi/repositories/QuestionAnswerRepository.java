package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.QuestionAnswer;

import java.util.List;

@Repository
public interface QuestionAnswerRepository  extends CrudRepository<QuestionAnswer, Long> {
    List<QuestionAnswer> findAllByTestResolutionId(Long id);
}
