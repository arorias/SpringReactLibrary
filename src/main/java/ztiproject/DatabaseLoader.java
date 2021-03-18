package ztiproject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.sql.Date;

import ztiproject.repository.*;
import ztiproject.model.*;


/**
* <p> Klasa odpowiedzialna za wczytanie początkowych (przykładowych danych) do bazy danych aplikacji podczas startu. </p>
* 
* @author Grzegorz Podsiadlo
*/
@Component
public class DatabaseLoader implements CommandLineRunner {

	/**
	* Repozytorium z dostępem do książek.
	*/
	private final BookRepository books;

	/**
	* Repozytorium z dostępem do użytkowników.
	*/
	private final LibraryUserRepository users;

	/**
	* Repozytorium z dostępem do autorów.
	*/
	private final AuthorRepository authors;

	/**
	* Repozytorium z dostępem do kategorii książek.
	*/
	private final CategoryRepository categories;

	/**
	* Repozytorium z dostępem do rezerwacji książek.
	*/
	private final ReservationRepository reservations;

	
	/**
	* Konstruktor wczytujący dane na podstawie utworzonych repozytoriów.
	* @param bookRepository repozytorium ksiazek
	* @param usersRepository repozytorium uzytkownikow
	* @param authorsRepository repozytorium ksiazek
	* @param categoriesRepository repozytorium gatunkow ksiazek
	* @param reservationsRepository repozytorium rezerwacji
	*/
	@Autowired 
	public DatabaseLoader(BookRepository bookRepository, LibraryUserRepository usersRepository, AuthorRepository authorsRepository, CategoryRepository categoriesRepository, ReservationRepository reservationsRepository) {
		this.books = bookRepository;
		this.users = usersRepository;
		this.authors = authorsRepository;
		this.categories = categoriesRepository;
		this.reservations = reservationsRepository;
	}



	/**
	 * Metoda uruchamiana przed uruchomieniem aplikacji, jej celem jest wczytanie początkowych danych do bazy.
	 * @param strings dodatkowe parametry wywolania (nieuzywane).
	 */
	@Override
	public void run(String... strings) throws Exception { 
		// Manaager mock
		LibraryUser adm = this.users.save(new LibraryUser("admin", "admin", "MANAGER"));

		SecurityContextHolder.getContext().setAuthentication(
			new UsernamePasswordAuthenticationToken("admin", "admin",
				AuthorityUtils.createAuthorityList("MANAGER")));

		LibraryUser testUser = this.users.save(new LibraryUser("test", "test", "USER"));
		SecurityContextHolder.getContext().setAuthentication(
			new UsernamePasswordAuthenticationToken("test", "test",
				AuthorityUtils.createAuthorityList("USER")));

		// Authors mock
		Author rowling = this.authors.save(new Author("J. K. Rowling"));
		Author tolkien = this.authors.save(new Author("J.R.R. Tolkien"));
	    Author sparks = this.authors.save(new Author("Nicholas Sparks"));
		Author collins = this.authors.save(new Author("Suzanne Collins"));
		Author king = this.authors.save(new Author("Stephen King"));

		// Category mock
		Category fantasy = this.categories.save(new Category("Fantasy"));
		Category adventure = this.categories.save(new Category("Adventure"));
		Category romance = this.categories.save(new Category("Romance"));
		Category dystopian = this.categories.save(new Category("Dystopian"));
		Category thriller = this.categories.save(new Category("Thriller"));
		Category science = this.categories.save(new Category("Science"));


			// Books mock
		Book hp1 = new Book("Harry Potter and the Philosophers Stone", "Bloomsbury Pub Ltd", "978-0747532743", 224 , "Harry Potter is an ordinary boy who lives in a cupboard under the stairs at his Aunt Petunia and Uncle Vernon's house, which he thinks is normal...");
		hp1.addAuthor(rowling);
		hp1.addCategory(adventure);
		this.books.save(hp1);
		Book hp2 = new Book("Harry Potter and the Chamber of Secrets", "Scholastic Paperbacks", "978-0439064873", 341 , "The Dursleys were so mean that hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and...");
		hp2.addAuthor(rowling);
		hp2.addCategory(fantasy);
		hp2.addCategory(adventure);
		this.books.save(hp2);
		Book hobbit = new Book("The Hobbit", "Houghton Mifflin Harcourt", "978-0544174221", 384 , "Like every other hobbit, Bilbo Baggins likes nothing better than a quiet evening in his snug hole in the ground, dining on a sumptuous dinner in front of a fire...");
		hobbit.addAuthor(tolkien);
		hobbit.addCategory(fantasy);
		hobbit.addCategory(adventure);
		this.books.save(hobbit);
		Book notebook = new Book("The Notebook", "Houghton Mifflin Harcourt", "978-0544333223", 254 , "When it comes to tales about love, Nicholas Sparks is one of the undisputed kings");
		notebook.addAuthor(sparks);
		notebook.addCategory(romance);
		this.books.save(notebook);
		Book hungerGames = new Book("The Ballad of Songbirds and Snakes", "Scholastic Press", "978-1338635171", 528 , "It is the morning of the reaping that will kick off the tenth annual Hunger Games. In the Capitol, eighteen-year-old Coriolanus Snow is...");
		hungerGames.addAuthor(collins);
		hungerGames.addCategory(dystopian);
		hungerGames.addCategory(thriller);
		this.books.save(hungerGames);
		Book shinig = new Book("The Shining", "Hodder And Stoughton", "978-9123881277", 666 , "Before Doctor Sleep, there was The Shining, a classic of modern American horror from the undisputed master, Stephen King.");
		shinig.addAuthor(king);
		shinig.addCategory(thriller);
		this.books.save(shinig);
		Book zti = new Book("ZTI", "WFIS AGH", "D10", 404 , "Wyklady do przedmiotu ZTI.");
		zti.addCategory(science);
		zti.addCategory(thriller);
		this.books.save(zti);

		// Reservations mock
		Date currentDate = new Date(System.currentTimeMillis()); 
		Reservation reservation = this.reservations.save(new Reservation(hp1, testUser, currentDate));
		Reservation reservation2 = this.reservations.save(new Reservation(hp2, testUser, currentDate));

		SecurityContextHolder.clearContext();
	}
}
