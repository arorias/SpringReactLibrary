package ztiproject.repository;


import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import ztiproject.model.LibraryUser;
import org.springframework.data.repository.PagingAndSortingRepository;


/**
 * <p> Proste repozytorium CRUD dla uzytkowników biblioteki z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
//@RepositoryRestResource(exported = false)
public interface LibraryUserRepository extends PagingAndSortingRepository<LibraryUser, Long> {
	/**
 	 * <p> Pozwala na wyszukanie uzytkownika po loginie. </p>
 	 * @param login Username szukanego uzytkownika. 
	 * @return Szukany uzytkownik.
 	*/
	LibraryUser findByLogin(String login);

}