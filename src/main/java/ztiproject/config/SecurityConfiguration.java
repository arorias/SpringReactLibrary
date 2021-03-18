package ztiproject.config;

import java.util.*; 

import ztiproject.service.SpringDataJpaUserDetailsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import ztiproject.model.LibraryUser;

/**
 * <p> Klasa konfigurujaca ustawienia zabezpieczen serwisu. </p>
 * @author Grzegorz Podsiadlo
 */
@Configuration
@EnableWebSecurity 
@EnableGlobalMethodSecurity(prePostEnabled = true) 
public class SecurityConfiguration extends WebSecurityConfigurerAdapter { 

	@Autowired
	private SpringDataJpaUserDetailsService userDetailsService; 

	/**
 	 * <p> Metoda konfigurujaca szyfrowanie hasel </p>
 	 * @param auth System autoryzacji
 	 */
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth
			.userDetailsService(this.userDetailsService)
				.passwordEncoder(LibraryUser.PASSWORD_ENCODER);
	}

	/**
 	 * <p> Metoda konfigurujaca ustawienia cors oraz parametry logowania, rejestracji i domyslnego dostepu </p>
 	 * @param http obiekt HttpSecurity
 	 */
	@Override
	protected void configure(HttpSecurity http) throws Exception { 
		http.cors().and()
            .authorizeRequests()
                .antMatchers("/**").permitAll()
                .antMatchers("/books/**").permitAll()
                .antMatchers("/api/**").permitAll()
				.antMatchers("/login/**").permitAll()
				.antMatchers("/built/**", "/main.css", "/favicon.ico").permitAll()
				.anyRequest().authenticated()
				.and()
            .formLogin().loginPage("/login")
            .loginProcessingUrl("/login")
			.defaultSuccessUrl("/", true)
			.failureUrl("/?error=true")
		    .permitAll()
			.and()
			.httpBasic()
			.and()
			.csrf().disable()
			.logout() 
			.logoutUrl("/logout")
			.logoutSuccessUrl("/");
	}


	/**
 	 * <p> Metoda konfigurujaca sposob obslugi CORS dla aplikacji </p>
 	 */
	@Bean
	@Order(0)
    CorsConfigurationSource corsConfigurationSource() {
        
		final CorsConfiguration configuration = new CorsConfiguration().applyPermitDefaultValues();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.setAllowCredentials(true);
        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.setAllowedHeaders(Arrays.asList("*"));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
		
    }


}