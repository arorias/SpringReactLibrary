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
 * <p> Klasa odpowiedzialna za obsługę zdarzeń websocket powiazanych z operacjami na encji wypozyczenia. </p>
 * @author Grzegorz Podsiadlo
 */
@Component
@RepositoryEventHandler(Borrowed.class) 
public class BorrowedEventHandler {
    
	private final SimpMessagingTemplate websocket; 

	private final EntityLinks entityLinks;
    
	
    @Autowired
	public BorrowedEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po utworzeniu nowego wypozyczenia. </p>
	 * @param borrowed wypozyczenie ktorego dotyczy
 	 */
    @HandleAfterCreate  
	public void newBorrowed(Borrowed borrowed) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newBorrowed", getPath(borrowed));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po usunieciu wypożyczenia. </p>	 
	 * @param borrowed wypozyczenie ktorego dotyczy
 	 */
	@HandleAfterDelete 
	public void deleteBorrowed(Borrowed borrowed) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteBorrowed", getPath(borrowed));
	}


	/**
 	 * <p> Dodaje nowe zdarzenie powstające po zaktualizowaniu danych wypożyczenia. </p>
	 * @param borrowed wypozyczenie ktorego dotyczy
 	 */
	@HandleAfterSave 
	public void updateBorrowed(Borrowed borrowed) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateBorrowed", getPath(borrowed));
	}

    /**
	 * <p> Sprawdza URI dla danego wypoczyenia </p>
	 * @param borrowed wypozyczenie ktorego dotyczy
	 */
	private String getPath(Borrowed borrowed) {
		return this.entityLinks.linkForItemResource(borrowed.getClass(),
        borrowed.getId()).toUri().getPath();
	}

}