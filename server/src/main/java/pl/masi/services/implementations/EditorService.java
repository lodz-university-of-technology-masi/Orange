package pl.masi.services.implementations;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.masi.beans.AccountBean;
import pl.masi.repositories.AccountRepository;
import pl.masi.services.interfaces.IEditorService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EditorService implements IEditorService {

    @NonNull
    private final AccountRepository accountRepository;

    private final long editorPermissionId = 2;

    @Override
    public List<AccountBean> getAll() {
        return accountRepository.findByPermissionId(editorPermissionId).stream()
                .map(account -> AccountBean.builder()
                        .firstName(account.getFirstName())
                        .lastName(account.getLastName())
                        .username(account.getUsername())
                        .permissionName(account.getPermission().getPermissionName())
                        .build())
                .collect(Collectors.toList());
    }
}