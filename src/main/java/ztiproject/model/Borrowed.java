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
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import javax.persistence.Table;
import javax.persistence.GenerationType;
import java.sql.Date;


/**
 * <p> Prosta klasa typu POJO reprezentująca encję wypożyczenia. </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "Borrowed")
public class Borrowed {
	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id; 

    @ManyToOne
	@JoinColumn(name="book_id")
	private Book book;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private LibraryUser user;
	
	private Date startDate;

    private Date dueDate;

    private boolean returned;
	
	private @Version @JsonIgnore Long version;

	protected Borrowed() {}

	public Borrowed(Book book, LibraryUser user, Date startDate, Date dueDate) {
		this.book = book;
		this.user = user;
		this.startDate = startDate;
        this.dueDate = dueDate;
        this.returned = false;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Borrowed borrowed = (Borrowed) o;
		return Objects.equals(id, borrowed.id) &&
			Objects.equals(book, borrowed.book) &&
			Objects.equals(user, borrowed.user) &&
			Objects.equals(startDate, borrowed.startDate) &&
            Objects.equals(dueDate, borrowed.dueDate) &&
			Objects.equals(returned, borrowed.returned) &&
			Objects.equals(version, borrowed.version);
	}

	public void returnBook() {
		this.returned = true;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, book, user, startDate, dueDate, returned, version);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}

	public LibraryUser getLibraryUser() {
		return user;
	}

	public void setLibraryUser(LibraryUser libraryUser) {
		this.user = libraryUser;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

    public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}
	
    public boolean getReturned() {
		return returned;
	}

	public void setReturned(boolean returned) {
		this.returned = returned;
	}
	
	
	public Long getVersion() {
		return version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "Reservation{" +
			"id=" + id +
			", book='" + book + '\'' +
			", user='" + user + '\'' +
			", startDate='" + startDate + '\'' +
            ", dueDate='" + dueDate + '\'' +
			", returned='" + returned + '\'' +
			", version=" + version +
			"}";
	}

}