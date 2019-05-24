package pl.masi.config.security;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.masi.beans.AccountBean;
import pl.masi.entities.Account;
import pl.masi.entities.Language;
import pl.masi.repositories.AccountRepository;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.Optional;

import static pl.masi.config.security.SecurityConstans.AUTHORIZATION_HEADER_NAME;
import static pl.masi.config.security.SecurityConstans.EXPIRATION_TIME;
import static pl.masi.config.security.SecurityConstans.ROLES_CLAIM_NAME;
import static pl.masi.config.security.SecurityConstans.SECRET;
import static pl.masi.config.security.SecurityConstans.TOKEN_PREFIX;

@AllArgsConstructor(onConstructor = @__(@Autowired))
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request,
                                                HttpServletResponse response) throws AuthenticationException {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
            Account account = objectMapper.readValue(request.getInputStream(), Account.class);

            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    account.getUsername(),
                    account.getPassword(),
                    null
            ));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain,
                                            Authentication authResult) throws IOException, ServletException {
        User user = (User) authResult.getPrincipal();
        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .claim(ROLES_CLAIM_NAME, user.getAuthorities())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET.getBytes())
                .compact();
        response.setHeader("Access-Control-Expose-Headers", "Authorization");
        response.addHeader(AUTHORIZATION_HEADER_NAME, TOKEN_PREFIX + token);

        Optional<Account> accountOptional = accountRepository.findByUsername(user.getUsername());

        if(accountOptional.isPresent()){
            Account account = accountOptional.get();
            response.setContentType("application/json");
            Language language = account.getPreferredLanguage();
            String languageName = language != null ? language.getName() : null;
            response.getWriter().write(new Gson().toJson(
                    AccountBean.builder()
                            .firstName(account.getFirstName())
                            .lastName(account.getLastName())
                            .permissionName(account.getPermission().getPermissionName())
                            .preferredLanguageName(languageName)
                            .username(account.getUsername())
                            .build()
            ));
            response.getWriter().flush();
            response.getWriter().close();
        }
    }
}
