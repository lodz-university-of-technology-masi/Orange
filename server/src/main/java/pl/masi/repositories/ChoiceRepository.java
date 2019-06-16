package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import pl.masi.entities.Choice;

public interface ChoiceRepository extends CrudRepository<Choice, Long> {
}
