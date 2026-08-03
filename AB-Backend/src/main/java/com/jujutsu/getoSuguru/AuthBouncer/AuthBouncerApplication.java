package com.jujutsu.getoSuguru.AuthBouncer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class AuthBouncerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthBouncerApplication.class, args);
	}

}
