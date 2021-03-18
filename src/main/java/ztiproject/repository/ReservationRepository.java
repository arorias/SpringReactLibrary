package ztiproject.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ztiproject.model.*;
import java.util.*;

/**
 * <p> Proste repozytorium CRUD dla rezerwacji z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
public interface ReservationRepository extends PagingAndSortingRepository<Reservation, Long>  {
    Set<Reservation> findByUser(LibraryUser user);

}