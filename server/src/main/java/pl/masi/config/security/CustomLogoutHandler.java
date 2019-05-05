package pl.masi.config.security;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import pl.masi.entities.InvalidToken;
import pl.masi.repositories.InvalidTokenRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static pl.masi.config.security.SecurityConstans.AUTHORIZATION_HEADER_NAME;
import static pl.masi.config.security.SecurityConstans.TOKEN_PREFIX;

@AllArgsConstructor(onConstructor = @__(@Autowired))
public class CustomLogoutHandler implements LogoutHandler {

    private InvalidTokenRepository invalidTokenRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String authToken = request.getHeader(AUTHORIZATION_HEADER_NAME);
        if (authToken != null) {
            authToken = authToken.replace(TOKEN_PREFIX, "");
            invalidTokenRepository.save(InvalidToken.builder()
                    .value(authToken)
                    .build());
        }
    }
}
