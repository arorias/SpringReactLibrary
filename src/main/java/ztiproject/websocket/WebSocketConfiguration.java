package ztiproject.websocket;

import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.context.annotation.Configuration;

/**
 * <p> Klasa odpowiedzialna za konfigurujaca websocket dla aplikacji </p>
 * @author Grzegorz Podsiadlo
 * @see <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/socket/config/annotation/WebSocketMessageBrokerConfigurer.html"> WebSocketMessageBrokerConfigurer </a>
 */
@Component
@EnableWebSocketMessageBroker 
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {

	static final String MESSAGE_PREFIX = "/topic"; 

	/**
 	 * <p> Metoda rejestrująca endpointy dla stomp. </p>
 	 * @param registry rejestr stomp, do ktorego zostanie dodany endpoint zwiazany z projektem.
 	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) { 
		registry.addEndpoint("/ztiproject").setAllowedOrigins("*").withSockJS();
	}

	/**
 	 * <p> Metoda konfigurujaca roznoszenie wiadomości dla aplikacji. </p>
 	 * @param registry rejestr dla którego zostanie uruchomiony podstawowy broker.
 	 */
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) { 
		registry.enableSimpleBroker(MESSAGE_PREFIX);
		registry.setApplicationDestinationPrefixes("/app");
	}
}