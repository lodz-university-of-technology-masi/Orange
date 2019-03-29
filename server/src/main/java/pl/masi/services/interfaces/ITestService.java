package pl.masi.services.interfaces;
import pl.masi.entities.Permission;
import pl.masi.entities.Test;

import java.util.Optional;
import java.util.List;

public interface ITestService {

    boolean add(Test test);

    Optional<Test> get(Long id);

    boolean update(Test test);

    void delete(Long id);

    List<Test> getAllTests();

    void deleteById(Long id);

    void setTestPermission(Long id, Permission permission);
}
