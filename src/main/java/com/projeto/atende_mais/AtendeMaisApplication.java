package com.projeto.atende_mais;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AtendeMaisApplication {

	public static void main(String[] args) {
		SpringApplication.run(AtendeMaisApplication.class, args);
	}

}
