package ztiproject.controller;

import java.util.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import ztiproject.model.*;
import org.springframework.security.core.userdetails.UserDetails;


import ztiproject.repository.*;
import ztiproject.model.*;

/**
 * <p> Kontroler powiazany z akcjami zwiazanymi z uzytkownikami, ktory realizuje akcje nie generowane domyslnie przez repozytorium CRUD. </p>
 * @author Grzegorz Podsiadlo
 */
@RestController
@RequestMapping("/api/user")
public class UserController {

	private final LibraryUserRepository repository;

	@Autowired
	public UserController(LibraryUserRepository repository) {
		this.repository = repository;
	}

    /**
     * <p> Zwraca informacje aktualnie zalogowanego uzytkownika. </p>
     * @return Mapa z polami "user", "id" oraz "role"
     */
    @GetMapping("/me")
    @ResponseBody
    public Map loggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, String> res = new HashMap<>();
        LibraryUser user = repository.findByLogin(auth.getName());
        res.put("user", auth.getName());
        res.put("role", "none");
        if (user != null) {
            res.put("id", Long.toString(user.getId()));
            String [] roles = user.getRoles();
            for (String s : roles)
                res.put("role", s);
        }
        
        return res;
    }

    /**
     * <p> Rejestruje uzytkownika w sytemie </p>
     * @return Zwraca obiekt z kluczem "success" wynoszacym true, jezeli rejestracja sie powiodla.
     */
    @PostMapping("/register")
    @ResponseBody
    public Map registerUser(@RequestBody LibraryUser newUser) {
        repository.save(newUser);

        SecurityContextHolder.getContext().setAuthentication(
			new UsernamePasswordAuthenticationToken(newUser.getLogin(), newUser.getPassword(),
				AuthorityUtils.createAuthorityList(newUser.getRoles())));

        return Collections.singletonMap("success", "true");
    }
}