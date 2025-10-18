package com.sports.config;

import com.sports.model.entity.User;
import com.sports.model.enums.UserRole;
import com.sports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Admin Initializer - Creates default admin user on startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        try {
            // Create default admin if not exists
            if (!userRepository.existsByEmail("admin@sports.com") && !userRepository.existsByUsername("admin")) {
                log.info("🔧 Creating default admin user...");
                
                Set<UserRole> adminRoles = new HashSet<>();
                adminRoles.add(UserRole.ADMIN);
                adminRoles.add(UserRole.ORGANIZER);
                adminRoles.add(UserRole.MODERATOR);
                
                User admin = User.builder()
                        .username("admin")
                        .email("admin@sports.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("System")
                        .lastName("Administrator")
                        .phoneNumber("+1234567890")
                        .roles(adminRoles)
                        .emailVerified(true)
                        .accountLocked(false)
                        .build();
                admin.setIsActive(true);
                
                userRepository.save(admin);
                
                log.info("✅ Default admin user created successfully!");
                log.info("📧 Email: admin@sports.com");
                log.info("🔑 Password: admin123");
            } else {
                log.info("ℹ️  Default admin user already exists");
            }
        } catch (Exception e) {
            // Log the error but don't stop application startup
            log.warn("⚠️  Admin user initialization skipped (user may already exist): {}", e.getMessage());
            log.debug("Stack trace:", e);
        }
    }
}
