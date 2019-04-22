package pl.masi.services.implementations;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.masi.entities.Account;
import pl.masi.repositories.AccountRepository;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Autowired
    public UserDetailsServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Account> account = accountRepository.findByUsername(username);

        if(!account.isPresent()){
            throw new UsernameNotFoundException("Username with provided login doesn't exist.");
        }

        return new User(
                account.get().getUsername(),
                account.get().getPassword(),
                AuthorityUtils.createAuthorityList(account.get().getPermission().getPermissionName())
        );
    }
}
