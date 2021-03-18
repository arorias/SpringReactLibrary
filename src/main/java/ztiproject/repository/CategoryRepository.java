package ztiproject.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import ztiproject.model.Category;

/**
 * <p> Proste repozytorium CRUD dla kategorii ksiązek z funkcją sortowania oraz paginacji. </p>
 * @author Grzegorz Podsiadlo
 */
public interface CategoryRepository extends PagingAndSortingRepository<Category, Long>  {

}