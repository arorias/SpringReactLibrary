package ztiproject.model;

import java.util.*;
import java.util.Objects;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Version;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

/**
 * <p> Prosta klasa typu POJO reprezentująca encję książki </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "Book")
public class Book {

	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id; 

	private String title;
	
	private String publisher;

	private String isbn;

	private int pages;

	private String description;

	private @Version @JsonIgnore Long version;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="book_author",
			joinColumns=@JoinColumn(name="book_id"),
			inverseJoinColumns=@JoinColumn(name="author_id"))
	private Set<Author> authors = new HashSet<>();

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="book_category",
			joinColumns=@JoinColumn(name="book_id"),
			inverseJoinColumns=@JoinColumn(name="category_id"))
	private Set<Category> categories =  new HashSet<>();

	@OneToMany(mappedBy="book",	cascade= {CascadeType.REMOVE}, orphanRemoval = true)
	private Set<Reservation> reservations;

	@OneToMany(mappedBy="book",	cascade= {CascadeType.REMOVE}, orphanRemoval = true)
	private Set<Borrowed> borrowed;

	protected Book() {}

	public Book(String title, String publisher, String isbn, int pages, String description) {
		this.title = title;
		this.publisher = publisher;
		this.isbn = isbn;
		this.pages = pages;
		this.description = description;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Book book = (Book) o;
		return Objects.equals(id, book.id) &&
			Objects.equals(title, book.title) &&
			Objects.equals(publisher, book.publisher) &&
			Objects.equals(isbn, book.isbn) &&
			Objects.equals(pages, book.pages) &&
			Objects.equals(description, book.description)  &&
			Objects.equals(version, book.version) &&
			Objects.equals(authors, book.authors) &&
			Objects.equals(categories, book.categories);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, title, publisher, isbn, pages, description, version);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public String getIsbn() {
		return isbn;
	}

	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}

	public int getPages() {
		return pages;
	}

	public void setPages(int pages) {
		this.pages = pages;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Set<Author> getAuthors() {
		return authors;
	}

	public void setAuthors(Set<Author> authors) {
		this.authors = authors;
	}

	public void addAuthor(Author author) {
		this.authors.add(author);
	}


	public Set<Category> getCategories() {
		return categories;
	}

	public void setCategories(Set<Category> categories) {
		this.categories = categories;
	}

	public void addCategory(Category category) {
		this.categories.add(category);
	}


	public Set<Borrowed> getBorrowed() {
		return borrowed;
	}

	public void setBorrowed(Set<Borrowed> borrowed) {
		this.borrowed = borrowed;
	}
	
	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "Book{" +
			"id=" + id +
			", title='" + title + '\'' +
			", publisher='" + publisher + '\'' +
			", isbn='" + isbn + '\'' +
			", pages='" + pages + '\'' +
			", description='" + description + '\'' +
			", version=" + version +
			"}";
	}

}
