package ztiproject.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * <p> Glowny kontroler odsylajacy do strony glownej. </p>
 * @author Grzegorz Podsiadlo
 */
@Controller 
public class HomeController {

	@RequestMapping(value = "/") 
	public String index() {
		return "index"; 
	}

}