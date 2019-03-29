package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Account;

@Repository
public interface AccountRepository extends CrudRepository<Account, Long> {

}
