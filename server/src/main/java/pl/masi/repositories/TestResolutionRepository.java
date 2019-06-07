package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pl.masi.entities.Language;
import pl.masi.entities.TestResolution;

import java.util.List;

@Repository
public interface TestResolutionRepository extends CrudRepository<TestResolution, Long> {
    List<TestResolution> findAll();
    List<TestResolution> findTestResolutionsByTestCreatorUsernameUsernameAndIsCheckedFalse(String username);
    TestResolution findTestResolutionById(Long id);
    List<TestResolution> findTestResolutionsByTestCreatorUsernameUsernameAndTestName(String username, String testName);
    TestResolution findByAccountUsernameAndTestName(String accountName, String testName);
}
