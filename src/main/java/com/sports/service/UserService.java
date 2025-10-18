package com.sports.service;

import com.sports.model.entity.User;
import com.sports.repository.EventRepository;
import com.sports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * User Service
 */
@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public User updateProfile(String userId, Map<String, Object> updates) {
        User user = getUserById(userId);
        
        // Update allowed fields
        if (updates.containsKey("firstName")) {
            user.setFirstName((String) updates.get("firstName"));
        }
        if (updates.containsKey("lastName")) {
            user.setLastName((String) updates.get("lastName"));
        }
        if (updates.containsKey("bio")) {
            user.setBio((String) updates.get("bio"));
        }
        if (updates.containsKey("city")) {
            user.setCity((String) updates.get("city"));
        }
        if (updates.containsKey("country")) {
            user.setCountry((String) updates.get("country"));
        }
        if (updates.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("profilePictureUrl")) {
            user.setProfilePictureUrl((String) updates.get("profilePictureUrl"));
        }
        if (updates.containsKey("facebookUrl")) {
            user.setFacebookUrl((String) updates.get("facebookUrl"));
        }
        if (updates.containsKey("twitterUrl")) {
            user.setTwitterUrl((String) updates.get("twitterUrl"));
        }
        if (updates.containsKey("instagramUrl")) {
            user.setInstagramUrl((String) updates.get("instagramUrl"));
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        if (newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public Map<String, Object> getUserStats(String userId) {
        User user = getUserById(userId);
        Map<String, Object> stats = new HashMap<>();
        
        // Get organized events count
        long organizedEvents = eventRepository.countByOrganizerId(userId);
        
        // Get participated events count (from the events the user has joined)
        // This would require a custom query or join
        
        stats.put("totalPoints", user.getTotalPoints());
        stats.put("organizedEvents", organizedEvents);
        stats.put("memberSince", user.getCreatedAt());
        stats.put("emailVerified", user.getEmailVerified());
        stats.put("roles", user.getRoles());
        
        return stats;
    }
    
    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                query, query, query
        );
    }
}
