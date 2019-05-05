package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import pl.masi.entities.Test;

import java.util.List;

@Repository
public interface TestRepository extends CrudRepository <Test, Long> {
    Test findByName(String name);
    void deleteByName(String name);
    Test findByPositionName(String name);
    List<Test> findByQuestionsName(String name);
    List<Test> findByCreatorUsernameUsername(String creatorUsername);
}
