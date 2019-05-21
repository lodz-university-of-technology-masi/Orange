package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.QuestionTranslation;

@Repository
public interface QuestionTranslationRepository extends CrudRepository<QuestionTranslation, Long> {
}
