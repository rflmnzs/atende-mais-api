package com.projeto.atende_mais.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    private final String frontendUrl;

    public CorsConfiguration(@Value("${FRONTEND_URL:*}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // O padrão "null" permite a execução local por file://, enquanto
                // os padrões localhost atendem Live Server e outros servidores locais.
                .allowedOriginPatterns(frontendUrl, "null", "http://localhost:[*]", "http://127.0.0.1:[*]")
                .allowedMethods("GET", "POST", "OPTIONS");
    }
}
