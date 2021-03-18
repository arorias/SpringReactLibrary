package ztiproject.websocket;

import ztiproject.model.*;
import static ztiproject.websocket.WebSocketConfiguration.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;


/**
 * <p> Klasa odpowiedzialna za obsługę zdarzeń websocket powiazanych z operacjami na encji książki. </p>
 * @author Grzegorz Podsiadlo
 */
@Component
@RepositoryEventHandler(Book.class) 
public class BookEventHandler {

	private final SimpMessagingTemplate websocket; 

	private final EntityLinks entityLinks;


	@Autowired
	public BookEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po utworzeniu nowej ksiazki. </p>
	 * @param book ksiazka ktorej dotyczy
 	 */
	@HandleAfterCreate  
	public void newBook(Book book) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newBook", getPath(book));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po usunieciu książki. </p>
	 * @param book ksiazka ktorej dotyczy
 	 */
	@HandleAfterDelete 
	public void deleteBook(Book book) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteBook", getPath(book));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po zaktualizowaniu danych książki. </p>
	 * @param book ksiazka ktorej dotyczy
 	 */
	@HandleAfterSave 
	public void updateBook(Book book) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateBook", getPath(book));
	}
	
	/**
	 * <p> Sprawdza URI dla danej ksiazki </p>
	 * @param book ksiazka ktorej dotyczy
	 */
	private String getPath(Book book) {
		return this.entityLinks.linkForItemResource(book.getClass(),
        book.getId()).toUri().getPath();
	}
}