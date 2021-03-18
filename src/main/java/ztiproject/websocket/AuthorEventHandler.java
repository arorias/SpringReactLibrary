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
 * <p> Klasa odpowiedzialna za obsługę zdarzeń websocket powiazanych z operacjami na encji autora. </p>
 * @author Grzegorz Podsiadlo
 */
@Component
@RepositoryEventHandler(Author.class) 
public class AuthorEventHandler {
    
	private final SimpMessagingTemplate websocket; 

	private final EntityLinks entityLinks;
    
    @Autowired
	public AuthorEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po utworzeniu nowego autora. </p>
	 * @param author autor ktorego dotyczy
	 */
    @HandleAfterCreate  
	public void newAuthor(Author author) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newAuthor", getPath(author));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po usunieciu  autora. </p>
	 * @param author autor ktorego dotyczy
 	 */
	@HandleAfterDelete 
	public void deleteAuthor(Author author) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteAuthor", getPath(author));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po zaktualizowaniu autora. </p>
	 * @param author autor ktorego dotyczy
 	 */
	@HandleAfterSave 
	public void updateAuthor(Author author) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateAuthor", getPath(author));
	}

    /**
	 * <p> Sprawdza URI dla danego autora </p>
	 * @param author autor ktorego dotyczy
	 */
	private String getPath(Author author) {
		return this.entityLinks.linkForItemResource(author.getClass(),
        author.getId()).toUri().getPath();
	}

}