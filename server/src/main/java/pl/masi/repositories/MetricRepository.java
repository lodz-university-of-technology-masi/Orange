package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import pl.masi.entities.USABILITY_DATA;

public interface MetricRepository extends CrudRepository<USABILITY_DATA, Long> {
}
