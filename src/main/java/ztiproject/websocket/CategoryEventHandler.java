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
 * <p> Klasa odpowiedzialna za obsługę zdarzeń websocket powiazanych z operacjami na encji kategorii ksiazki. </p>
 * @author Grzegorz Podsiadlo
 */
@Component
@RepositoryEventHandler(Category.class) 
public class CategoryEventHandler {
    
	private final SimpMessagingTemplate websocket; 

	private final EntityLinks entityLinks;
    
    @Autowired
	public CategoryEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po utworzeniu nowej kategorii. </p>
	 * @param category kategoria ktorej dotyczy
 	 */
    @HandleAfterCreate  
	public void newCategory(Category category) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newCategory", getPath(category));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po usunieciu kategorii. </p>
	 * @param category kategoria ktorej dotyczy
 	 */
	@HandleAfterDelete 
	public void deleteCategory(Category category) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteCategory", getPath(category));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po zaktualizowaniu danych kategorii książki. </p>
	 * @param category kategoria ktorej dotyczy
 	 */
	@HandleAfterSave 
	public void updateCategory(Category category) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateCategory", getPath(category));
	}

     /**
	  * <p> Sprawdza URI dla danej kategorii </p>
	  * @param category kategoria ktorej dotyczy
	  */
	private String getPath(Category category) {
		return this.entityLinks.linkForItemResource(category.getClass(),
        category.getId()).toUri().getPath();
	}

}