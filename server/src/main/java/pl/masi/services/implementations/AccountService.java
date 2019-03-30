package pl.masi.services.implementations;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.masi.repositories.AccountRepository;
import pl.masi.services.interfaces.IAccountService;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountService implements IAccountService {

    private AccountRepository accountRepository;

}
