package pl.masi.config;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import pl.masi.config.security.CustomLogoutHandler;
import pl.masi.config.security.JWTAuthenticationFilter;
import pl.masi.config.security.JWTAuthorizationFilter;
import pl.masi.repositories.AccountRepository;
import pl.masi.repositories.InvalidTokenRepository;

import javax.servlet.http.HttpServletResponse;

import static pl.masi.config.security.SecurityConstans.LOGIN_URL;
import static pl.masi.config.security.SecurityConstans.LOGOUT_URL;
import static pl.masi.config.security.SecurityConstans.REGISTER_URL;

@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final AccountRepository accountRepository;
    private final InvalidTokenRepository invalidTokenRepository;

    @Autowired
    public SecurityConfig(@Qualifier("userDetailsServiceImpl") UserDetailsService userDetailsService,
                          AccountRepository accountRepository, InvalidTokenRepository invalidTokenRepository) {
        this.userDetailsService = userDetailsService;
        this.accountRepository = accountRepository;
        this.invalidTokenRepository = invalidTokenRepository;
    }


    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable().authorizeRequests()
                .antMatchers(HttpMethod.POST, LOGIN_URL).permitAll()
                .antMatchers(HttpMethod.POST, REGISTER_URL).permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilter(new JWTAuthenticationFilter(authenticationManager(), accountRepository))
                .addFilter(new JWTAuthorizationFilter(authenticationManager(), invalidTokenRepository))
                .logout()
                .addLogoutHandler(new CustomLogoutHandler(invalidTokenRepository))
                .logoutUrl(LOGOUT_URL)
                .logoutSuccessHandler((httpServletRequest, httpServletResponse, authentication) ->
                        httpServletResponse.setStatus(HttpServletResponse.SC_OK))
                .permitAll()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
