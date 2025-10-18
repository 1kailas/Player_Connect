package com.sports;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Application Entry Point
 * Sports Ranking and Management Platform
 * 
 * Features:
 * - User Management & Authentication
 * - Sports Event Organization
 * - Real-time Rankings & Leaderboards
 * - Tournament Management
 * - Team & Player Profiles
 * - Live Score Updates
 * - News & Updates
 * - Venue Management
 * - Statistics & Analytics
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class SportsRankingPlatformApplication {

    public static void main(String[] args) {
        // Load .env file before starting Spring Boot
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        
        // Set environment variables as system properties
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        
        SpringApplication.run(SportsRankingPlatformApplication.class, args);
        System.out.println("""
            
            ========================================
            Sports Ranking Platform Started!
            ========================================
            API Documentation: http://localhost:8080/swagger-ui.html
            MongoDB: Connected to Atlas Cluster
            ========================================
            """);
    }
}
