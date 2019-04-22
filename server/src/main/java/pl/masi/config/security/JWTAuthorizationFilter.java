package pl.masi.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import pl.masi.repositories.InvalidTokenRepository;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import static pl.masi.config.security.SecurityConstans.AUTHORIZATION_HEADER_NAME;
import static pl.masi.config.security.SecurityConstans.ROLES_CLAIM_NAME;
import static pl.masi.config.security.SecurityConstans.SECRET;
import static pl.masi.config.security.SecurityConstans.TOKEN_PREFIX;

public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final InvalidTokenRepository invalidTokenRepository;

    public JWTAuthorizationFilter(AuthenticationManager authenticationManager, InvalidTokenRepository invalidTokenRepository) {
        super(authenticationManager);
        this.invalidTokenRepository = invalidTokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String header = request.getHeader(AUTHORIZATION_HEADER_NAME);

        if(header == null || !header.startsWith(TOKEN_PREFIX)){
            chain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authenticationToken = getAuthentication(request);

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        chain.doFilter(request, response);
    }

    private UsernamePasswordAuthenticationToken getAuthentication(HttpServletRequest request) {
        String token = request.getHeader(AUTHORIZATION_HEADER_NAME);

        if (token != null) {
            token = token.replace(TOKEN_PREFIX, "");

            if (invalidTokenRepository.existsByValue(token)) {
                return null;
            }

            Jws<Claims> claims = Jwts.parser()
                    .setSigningKey(SECRET.getBytes())
                    .parseClaimsJws(token);

            ArrayList<LinkedHashMap<String, String>> authorityClaim =
                    (ArrayList<LinkedHashMap<String, String>>) claims.getBody().get(ROLES_CLAIM_NAME);

            List<GrantedAuthority> authorities = new ArrayList<>();

            if (authorityClaim != null && !authorityClaim.isEmpty()) {
                authorities = authorityClaim.stream()
                        .map(LinkedHashMap::values)
                        .flatMap(Collection::stream)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());
            }

            String user = claims.getBody().getSubject();

            if (user != null) {
                return new UsernamePasswordAuthenticationToken(user, null, authorities);
            }

            return null;
        }

        return null;
    }
}
