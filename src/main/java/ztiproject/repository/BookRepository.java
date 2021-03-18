package ztiproject.repository;

import org.springframework.data.repository.PagingAndSortingRepository;

import ztiproject.model.Book;

/**
 * <p> Proste repozytorium CRUD dla książek z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
public interface BookRepository extends PagingAndSortingRepository<Book, Long>  {

}
