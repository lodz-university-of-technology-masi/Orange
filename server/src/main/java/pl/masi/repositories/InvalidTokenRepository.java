package pl.masi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.InvalidToken;

@Repository
public interface InvalidTokenRepository extends JpaRepository<InvalidToken, Long> {

    boolean existsByValue(String value);
}
