package ztiproject.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ztiproject.model.*;
import java.util.*;

/**
 * <p> Proste repozytorium CRUD dla wypożyczeń z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
public interface BorrowedRepository extends PagingAndSortingRepository<Borrowed, Long>  {
    /**
    * <p> Metoda pozwalajaca na sprawdzenie wypozyczeń uzytkownika. </p>
    * @param user Uzytkownik dla którego wypożyczeń szukamy.
    * @return Zbior powiązanych wypożyczeń.
    */
    Set<Borrowed> findByUser(LibraryUser user);
}