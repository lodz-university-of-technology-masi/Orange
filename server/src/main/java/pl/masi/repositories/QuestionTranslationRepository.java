package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Language;
import pl.masi.entities.Question;
import pl.masi.entities.QuestionTranslation;

@Repository
public interface QuestionTranslationRepository extends CrudRepository<QuestionTranslation, Long> {
    QuestionTranslation findByQuestionAndLanguage(Question question, Language language);
}
