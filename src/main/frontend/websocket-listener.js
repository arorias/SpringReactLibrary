'use strict';

const SockJS = require('sockjs-client'); 
require('stompjs'); 

function register(registrations) {
	const socket = SockJS('/ztiproject');
	const stompClient = Stomp.over(socket);
	stompClient.debug = null // Mozna zakomentowac ta linie by miec dodatkowe informacje w konsoli
	stompClient.connect({}, function(frame) {
		registrations.forEach(function (registration) { 
			stompClient.subscribe(registration.route, registration.callback);
		});
	});
}

module.exports.register = register;