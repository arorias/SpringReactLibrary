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
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty.Access;


/**
 * <p> Prosta klasa typu POJO reprezentująca encję autora </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "Author")
public class Author {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; 
	private String name;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "book_author", 
				joinColumns = {@JoinColumn(name ="author_id")}, 
				inverseJoinColumns = {@JoinColumn(name = "book_id")})
	@JsonBackReference
	private Set<Book> books =  new HashSet<>();

	private @Version @JsonIgnore Long version;

    protected Author() {}

	public Author(String name) {
		this.name = name;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Author author = (Author) o;
		return Objects.equals(id, author.id) &&
			Objects.equals(name, author.name) &&
			Objects.equals(books, author.books);
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
		return "Author{" +
			"id=" + id +
			", name='" + name + 
			"}";
	}

}