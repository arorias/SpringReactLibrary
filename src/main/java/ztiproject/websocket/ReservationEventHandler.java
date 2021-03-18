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
 * <p> Klasa odpowiedzialna za obsługę zdarzeń websocket powiazanych z operacjami na encji rezerwacji. </p>
 * @author Grzegorz Podsiadlo
 */
@Component
@RepositoryEventHandler(Reservation.class) 
public class ReservationEventHandler {
    
	private final SimpMessagingTemplate websocket; 

	private final EntityLinks entityLinks;
    

    @Autowired
	public ReservationEventHandler(SimpMessagingTemplate websocket, EntityLinks entityLinks) {
		this.websocket = websocket;
		this.entityLinks = entityLinks;
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po utworzeniu nowej rezerwacji. </p>
	 * @param reservation rezerwacja ktorej dotyczy
 	 */
    @HandleAfterCreate  
	public void newReservation(Reservation reservation) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/newReservation", getPath(reservation));
	}

	/**
 	 * <p> Dodaje nowe zdarzenie powstające po usunieciu rezerwacji. </p>
	 * @param reservation rezerwacja ktorej dotyczy
 	 */
	@HandleAfterDelete 
	public void deleteReservation(Reservation reservation) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/deleteReservation", getPath(reservation));
	}


	/**
 	 * <p> Dodaje nowe zdarzenie powstające po zaktualizowaniu danych  rezerwacji. </p>
	 * @param reservation rezerwacja ktorej dotyczy
 	 */
	@HandleAfterSave 
	public void updateReservation(Reservation reservation) {
		this.websocket.convertAndSend(
				MESSAGE_PREFIX + "/updateReservation", getPath(reservation));
	}

     /**
	  * <p> Sprawdza URI dla danej rezerwacji </p>
	  * @param reservation rezerwacja ktorej dotyczy
	  */
	private String getPath(Reservation reservation) {
		return this.entityLinks.linkForItemResource(reservation.getClass(),
        reservation.getId()).toUri().getPath();
	}

}