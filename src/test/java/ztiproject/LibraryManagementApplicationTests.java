package ztiproject;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import ztiproject.controller.*;
import ztiproject.model.*;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@AutoConfigureMockMvc
@SpringBootTest
class LibraryManagementApplicationTests {
	@Autowired		
	private MockMvc mockMvc;

	@Autowired
	private BooksController booksController;

	@Autowired
	private ReservationsController reservationsController;

	@Autowired
	private HomeController homeController;

	@Test
	void contextLoads() {
	}

	@Test
	void booksControllerLoads() {
		assertThat(booksController).isNotNull();
	}

	@Test
	void reservationControllerLoads() {
		assertThat(reservationsController).isNotNull();
	}

	@Test
	void homeControllerLoads() {
		assertThat(homeController).isNotNull();
	}

	@Test
	void getBooks() throws Exception {
		String uri = "/api/books";
   		
     	MvcResult mvcResult = this.mockMvc.perform(get(uri)).andDo(print()).andExpect(status().isOk()).andReturn();
		
   		int status = mvcResult.getResponse().getStatus();
		assertThat(status).isEqualTo(200);
		String contentType = mvcResult.getResponse().getContentType();
		assertThat(contentType).contains("application/hal+json");
	}

	@Test
	void getAuthors() throws Exception {
		String uri = "/api/authors";
   		
     	MvcResult mvcResult = this.mockMvc.perform(get(uri)).andDo(print()).andExpect(status().isOk()).andReturn();
		
   		int status = mvcResult.getResponse().getStatus();
		assertThat(status).isEqualTo(200);
		String contentType = mvcResult.getResponse().getContentType();
		assertThat(contentType).contains("application/hal+json");
	}

	@Test
	void getCategories() throws Exception {
		String uri = "/api/categories";
   		
     	MvcResult mvcResult = this.mockMvc.perform(get(uri)).andDo(print()).andExpect(status().isOk()).andReturn();
		
   		int status = mvcResult.getResponse().getStatus();
		assertThat(status).isEqualTo(200);
		String contentType = mvcResult.getResponse().getContentType();
		assertThat(contentType).contains("application/hal+json");
	}

	@Test	
	void getReservations() throws Exception {
		String uri = "/api/reservations";
   		
     	MvcResult mvcResult = this.mockMvc.perform(get(uri)).andDo(print()).andExpect(status().isOk()).andReturn();
		
   		int status = mvcResult.getResponse().getStatus();
		assertThat(status).isEqualTo(200);
		String contentType = mvcResult.getResponse().getContentType();
		assertThat(contentType).contains("application/hal+json");
	}

	@Test
	void getBorrowedBooks() throws Exception {
		String uri = "/api/borroweds";
   		
     	MvcResult mvcResult = this.mockMvc.perform(get(uri)).andDo(print()).andExpect(status().isOk()).andReturn();
		
   		int status = mvcResult.getResponse().getStatus();
		assertThat(status).isEqualTo(200);
		String contentType = mvcResult.getResponse().getContentType();
		assertThat(contentType).contains("application/hal+json");
	}

}
