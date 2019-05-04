package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Question;


@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
    Question findByName(String name);
    void deleteByName(String name);
}
