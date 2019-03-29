package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Position;

@Repository
public interface PositionRepository extends CrudRepository<Position, Long> {

    Position findByName(String name);
}
