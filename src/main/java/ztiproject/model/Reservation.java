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
 * <p> Prosta klasa typu POJO reprezentująca encję rezerwacji </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "Reservation")
public class Reservation {
	@Id 
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id; 

    @ManyToOne
	@JoinColumn(name="book_id")
	private Book book;
	
	@ManyToOne
	@JoinColumn(name="user_id")
	private LibraryUser user;
	
	private Date date;
	
	private @Version @JsonIgnore Long version;

	protected Reservation() {}

	public Reservation(Book book, LibraryUser user, Date date) {
		this.book = book;
		this.user = user;
		this.date = date;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Reservation reservation = (Reservation) o;
		return Objects.equals(id, reservation.id) &&
			Objects.equals(book, reservation.book) &&
			Objects.equals(user, reservation.user) &&
			Objects.equals(date, reservation.date) &&
			Objects.equals(version, reservation.version);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, book, user, date, version);
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

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
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
			", date='" + date + '\'' +
			", version=" + version +
			"}";
	}

}