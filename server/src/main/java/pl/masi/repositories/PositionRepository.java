package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Position;

import java.util.List;

@Repository
public interface PositionRepository extends CrudRepository<Position, Long> {

    List<Position> findAll();
    Position findByName(String name);
    void deleteByName(String name);
}
