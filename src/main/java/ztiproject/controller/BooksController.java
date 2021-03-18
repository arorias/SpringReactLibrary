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
 * <p> Kontroler powiazany z ksiazkami, ktory realizuje akcje nie generowane domyslnie przez repozytorium CRUD. </p>
 * @author Grzegorz Podsiadlo
 */
@RestController
@RequestMapping("/api/books")
public class BooksController {

	/**
 	 * <p> Limit wypozyczen na uzytkownika. </p>
 	 */
	private final int RESERVATION_PER_USER_LIMIT = 3;
	private final BookRepository books;
	private final LibraryUserRepository users;
	private final ReservationRepository reservations;

	@Autowired
	public BooksController(BookRepository books, LibraryUserRepository users, ReservationRepository reservations) {
		this.books = books;
		this.users = users;
		this.reservations = reservations;
	}

	/**
 	 * <p> Metoda pozwalajaca na probe zarezerwowania ksiazki dla uzytkownika o danym id </p>
	 * @return Mapa zawierajaca klucze "success" o wartości true, jeżeli udało się dokonać rezerwacji oraz o kluczu "errorMsg" jeżeli się nie udało.
	 */
	@GetMapping("/{id}/reserve")
	@ResponseBody
	public Map reserveBook(@PathVariable("id") Long id) {
		Optional<Book> book = books.findById(id);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Sprawdzanie czy istnieje 
		LibraryUser user = users.findByLogin(auth.getName());
		Set<Reservation> userReservations = reservations.findByUser(user);
		boolean exist = false;
		Map<String, String> res = new HashMap<>();
		if (userReservations.size() >= RESERVATION_PER_USER_LIMIT) {
			res.put("success", "false");		
			res.put("errorMsg", "Limit (3) exceeded.");	
		}
		else {
			for (Reservation reservation : userReservations)
			if (reservation.getBook().getId() == id)
				exist = true;
			if (exist) {
				res.put("success", "false");		
				res.put("errorMsg", "Book already reserved.");	
			}
			else {
				Date currentDate = new Date(System.currentTimeMillis()); 
				Reservation reservation = reservations.save(new Reservation(book.get(), user, currentDate));
				res.put("success", "true");	
				res.put("errorMsg", "");	
			}
		}
		
		return res;
	}

	
    
}