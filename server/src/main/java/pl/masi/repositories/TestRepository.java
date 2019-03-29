package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Test;

@Repository
public interface TestRepository extends CrudRepository <Test, Long> {

}
