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
import java.time.*;


/**
 * <p> Kontroler powiazany z rezerwacjami, ktory realizuje akcje nie generowane domyslnie przez repozytorium CRUD. </p>
 * @author Grzegorz Podsiadlo
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationsController {

	private final BookRepository books;
	private final LibraryUserRepository users;
	private final ReservationRepository reservations;
    private final BorrowedRepository borroweds;


	@Autowired
	public ReservationsController(BookRepository books, LibraryUserRepository users, ReservationRepository reservations,  BorrowedRepository borroweds) {
		this.books = books;
		this.users = users;
		this.reservations = reservations;
        this.borroweds = borroweds;
	}

	/**
 	 * <p> Metoda pozwalajaca na probe wypozyczenia książki o danym id wypozyczenia. Wypozyczenie nie powiedzie sie, jezeli ksiazka jest aktualnie wypozyczona. </p>
	 * @return Mapa zawierajaca klucze "success" o wartości true, jeżeli udało się dokonać rezerwacji oraz o kluczu "errorMsg" jeżeli się nie udało.
	 */
	@GetMapping("/{id}/borrow")
	@ResponseBody
	public Map borrowBook(@PathVariable("id") Long id) {
		Optional<Reservation> reservation = reservations.findById(id);
		Map<String, String> res = new HashMap<>();
		Set<Borrowed> borrowed = reservation.get().getBook().getBorrowed();
		boolean notReturned = false;
		for (Borrowed b : borrowed) {
			if (b.getReturned() == false)
				notReturned = true;
		}
		if (notReturned == true) {
			res.put("success", "false");		
			res.put("errorMsg", "Book not returned.");		
		}
		else {
			Date startDate = reservation.get().getDate();
			Calendar cal = Calendar.getInstance(); 
			cal.add(Calendar.MONTH, 1);
			Date dueDate = new Date(cal.getTimeInMillis());
        	borroweds.save(new Borrowed(reservation.get().getBook(), reservation.get().getLibraryUser(), startDate, dueDate));
        	reservations.deleteById(id);
        	res.put("success", "true");	
			res.put("errorMsg", "");		
		}
		
		return res;
	}

	
    
}