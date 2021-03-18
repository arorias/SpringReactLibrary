package ztiproject.model;


import java.util.Arrays;
import java.util.Objects;
import java.util.*;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;
import javax.persistence.FetchType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

/**
 * <p> Prosta klasa typu POJO reprezentująca encję użytkownika serwisu. </p>
 * @author Grzegorz Podsiadlo
 */
@Entity
@Table(name = "LibraryUser")
public class LibraryUser {

	public static final PasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder(); 

	private @Id @GeneratedValue Long id; 

	private String login; 

	@JsonProperty(access = Access.WRITE_ONLY)
	private String password; // @JsonIgnore

	private String[] roles;
	
	private String firstName;

	private String lastName;

	
	@OneToMany(mappedBy="user", cascade= {CascadeType.REMOVE}, orphanRemoval = true)
	private Set<Reservation> reservations; 


	@OneToMany(mappedBy="book",	cascade= {CascadeType.REMOVE}, orphanRemoval = true)
	private Set<Borrowed> borrowed;

	public void setPassword(String password) { 
		this.password = PASSWORD_ENCODER.encode(password);
	}

	protected LibraryUser() {}

	public LibraryUser(String login, String password, String... roles) {

		this.login = login;
		this.setPassword(password);
		this.roles = roles;
		this.firstName = "";
		this.lastName = "";
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		LibraryUser user = (LibraryUser) o;
		return Objects.equals(id, user.id) &&
			Objects.equals(login, user.login) &&
			Objects.equals(password, user.password) &&
			Objects.equals(firstName, user.firstName) &&
			Objects.equals(lastName, user.lastName) &&
			Arrays.equals(roles, user.roles);
	}

	@Override
	public int hashCode() {

		int result = Objects.hash(id, login, password, firstName, lastName);
		result = 31 * result + Arrays.hashCode(roles);
		return result;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public Set<Reservation> getReservations() {
		return reservations;
	}

	public void setReservations(Set<Reservation>  reservations) {
		this.reservations = reservations;
	}

	
	public Set<Borrowed> getBorrowed() {
		return borrowed;
	}

	public void setBorrowed(Set<Borrowed>  borrowed) {
		this.borrowed = borrowed;
	}



	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPassword() {
		return password;
	}
	

	public String[] getRoles() {
		return roles;
	}

	public void setRoles(String[] roles) {
		this.roles = roles;
	}

	@Override
	public String toString() {
		return "LibraryUser{" +
			"id=" + id +
			", login='" + login + '\'' +
			", firstName='" + firstName + '\'' +
			", lastName='" + lastName + '\'' +
			", roles=" + Arrays.toString(roles) +
			'}';
	}
}