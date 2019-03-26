package pl.masi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Account;

@Repository
public interface AccountRepository extends JpaRepository <Account, Long> {

}
