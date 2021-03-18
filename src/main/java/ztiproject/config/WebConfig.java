package ztiproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer ;
import org.springframework.web.servlet.config.annotation.CorsRegistry;


/**
 * <p> Klasa konfigurujaca ustawienia MVC springa oraz dozwolone naglowki. </p>
 * @author Grzegorz Podsiadlo
 */
@Configuration
public class WebConfig implements  WebMvcConfigurer  {
   /**
    * <p> Metoda konfigurujaca mapowania naglowkow dla CORS </p>
    * @param registry Rejestr CORS
    */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
               .allowedOrigins("*")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*")
                .exposedHeaders("X-Auth-Token", "Authorization", "X-Authorization", "Auth-Token")
                .allowedMethods("*");
    }

}