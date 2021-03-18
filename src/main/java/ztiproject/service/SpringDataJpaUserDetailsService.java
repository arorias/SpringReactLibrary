package ztiproject.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ztiproject.repository.*;
import ztiproject.model.*;


/**
 * <p> Serwis odpowiedzialny za autentykacje uzytkownikow </p>
 * @author Grzegorz Podsiadlo
 */
@Component
public class SpringDataJpaUserDetailsService implements UserDetailsService {

	private final LibraryUserRepository repository;

	/**
	 * <p> Tworzy nowy serwis autentykacji z użyciem repozytorium użytkowników. </p>
	 * @param repository repozytorium użytkowników biblioteki.
 	 */
	@Autowired
	public SpringDataJpaUserDetailsService(LibraryUserRepository repository) {
		this.repository = repository;
	}

	/**
	 * <p> Zwraca dane użytkownika bazując na podanym loginie. </p>
	 * @param login login uzytkownika, którego chcemy wczytać.
	 * @return poszukiwany użytkownik jeżeli istnieje, w przeciwnym razie wyjątek UsernameNotFoundException
 	 */
	@Override
	public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
		LibraryUser user = this.repository.findByLogin(login);
		return new User(user.getLogin(), user.getPassword(),
				AuthorityUtils.createAuthorityList(user.getRoles()));
	}

}