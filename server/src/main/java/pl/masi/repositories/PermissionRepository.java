package pl.masi.repositories;

import org.springframework.data.repository.CrudRepository;
import pl.masi.entities.Permission;

public interface PermissionRepository extends CrudRepository<Permission, Long> {
    Permission findByPermissionName(String permissionName);
}
