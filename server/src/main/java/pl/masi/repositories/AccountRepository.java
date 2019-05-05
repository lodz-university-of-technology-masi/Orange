package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Account;
import pl.masi.entities.Permission;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends CrudRepository<Account, Long> {
    Optional<Account> findByUsername(String username);
    List<Account> findAll();
    List<Account> findByPermission(Permission permission);
}
