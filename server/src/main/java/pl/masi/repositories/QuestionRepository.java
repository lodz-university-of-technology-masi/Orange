package pl.masi.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Question;
import pl.masi.enums.QuestionType;

import java.util.List;


@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
    Question findByName(String name);
    void deleteByName(String name);

    @Query("SELECT DISTINCT q.questionType FROM Question q")
    List<QuestionType> getAllQuestionType();
}
