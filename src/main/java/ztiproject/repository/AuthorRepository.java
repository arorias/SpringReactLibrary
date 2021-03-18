package ztiproject.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ztiproject.model.Author;

/**
 * <p> Proste repozytorium CRUD dla autorów z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
public interface AuthorRepository extends PagingAndSortingRepository<Author, Long>  {

}