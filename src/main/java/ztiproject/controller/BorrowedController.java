package ztiproject.controller;

import java.util.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.userdetails.UserDetails;
import ztiproject.model.*;
import ztiproject.repository.*;
import java.sql.Date;

/**
 * <p> Kontroler powiazany z wypozyczeniami, ktory realizuje akcje nie generowane domyslnie przez repozytorium CRUD. </p>
 * @author Grzegorz Podsiadlo
 */
@RestController
@RequestMapping("/api/borroweds")
public class BorrowedController {

	private final BookRepository books;
	private final LibraryUserRepository users;
	private final ReservationRepository reservations;
    private final BorrowedRepository borroweds;


	@Autowired
	public BorrowedController(BookRepository books, LibraryUserRepository users, ReservationRepository reservations,  BorrowedRepository borroweds) {
		this.books = books;
		this.users = users;
		this.reservations = reservations;
        this.borroweds = borroweds;
	}

	/**
 	 * <p> Metoda pozwalajaca na probe zwrócenia książki o danym id wypozyczenia. </p>
	 * @return Mapa zawierajaca klucze "success" o wartości true, jeżeli udało się dokonać rezerwacji oraz o kluczu "errorMsg" jeżeli się nie udało.
	 */
	@GetMapping("/{id}/return")
	@ResponseBody
	public Map returnBook(@PathVariable("id") Long id) {
		Optional<Borrowed> borrowed = borroweds.findById(id);
		Map<String, String> res = new HashMap<>();
		borrowed.get().returnBook();
        borroweds.save(borrowed.get());
        res.put("success", "true");		
		return res;
	}

	
    
}