package ztiproject.model;

import java.util.*;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.Table;
import javax.persistence.GenerationType;
import javax.persistence.ManyToMany;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.FetchType;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

/**
 * <p> Prosta klasa typu POJO reprezentująca encję kategorii książki. </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "Category")
public class Category {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; 
	private String name;

	@ManyToMany
	@JoinTable(name = "book_category", 
				joinColumns = {@JoinColumn(name ="category_id")}, 
				inverseJoinColumns = {@JoinColumn(name = "book_id")})
	@JsonBackReference
	private Set<Book> books =  new HashSet<>();

	private @Version @JsonIgnore Long version;

    protected Category() {}

	public Category(String name) {
		this.name = name;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Category category = (Category) o;
		return Objects.equals(id, category.id) &&
			Objects.equals(name, category.name) &&
			Objects.equals(books, category.books);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public void setBooks(Set<Book> books) {
		this.books = books;
	}

	public Set<Book> getBooks() {
		return books;
	}

	@Override
	public String toString() {
		return "Category{" +
			"id=" + id +
			", name='" + name + 
			"}";
	}

}