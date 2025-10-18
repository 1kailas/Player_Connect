package com.sports.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sports.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * User Entity - Represents all users in the system (MongoDB Document)
 */
@Document(collection = "users")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    
    @NotBlank
    @Indexed(unique = true)
    private String username;
    
    @NotBlank
    @Email
    @Indexed(unique = true)
    private String email;
    
    @NotBlank
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    @Indexed(unique = true, sparse = true)
    private String phoneNumber;
    
    private LocalDate dateOfBirth;
    
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();
    
    private String profilePictureUrl;
    
    private String bio;
    
    private String country;
    
    private String city;
    
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Builder.Default
    private Boolean accountLocked = false;
    
    @Builder.Default
    private Integer totalPoints = 0;
    
    // Social media links
    private String facebookUrl;
    
    private String twitterUrl;
    
    private String instagramUrl;
    
    // References to related documents (using IDs)
    @JsonIgnore
    private List<String> playerProfileIds;
    
    @JsonIgnore
    private List<String> organizedEventIds;
    
    @JsonIgnore
    private List<String> notificationIds;
    
    // ============= NEW: User Favorites =============
    
    @JsonIgnore
    @Builder.Default
    private List<String> favoriteTeamIds = new ArrayList<>();
    
    @JsonIgnore
    @Builder.Default
    private List<String> favoritePlayerIds = new ArrayList<>();
    
    @JsonIgnore
    @Builder.Default
    private List<String> followedEventIds = new ArrayList<>();
    
    // ============= NEW: User Achievements/Stats =============
    
    @Builder.Default
    private Integer newsArticlesRead = 0;
    
    @Builder.Default
    private Integer matchesPredicted = 0;
    
    @Builder.Default
    private Integer correctPredictions = 0;
    
    @Builder.Default
    private List<String> earnedBadges = new ArrayList<>();
    
    @Builder.Default
    private Integer loginStreak = 0; // Days in a row
    
    @Builder.Default
    private Integer totalEventsAttended = 0;
    
    // ============= Admin Management Fields =============
    
    private java.time.LocalDateTime lastLogin;
    
    // ============= Player Profile Enhancements =============
    
    @JsonIgnore
    @Builder.Default
    private List<String> certificateIds = new ArrayList<>();
    
    @JsonIgnore
    @Builder.Default
    private List<String> teamIds = new ArrayList<>();
    
    private String playerPosition; // For sports like Football, Cricket
    
    private String playingRole; // BATSMAN, BOWLER, ALL_ROUNDER, GOALKEEPER, etc.
    
    private Integer jerseyNumber;
    
    private String height; // e.g., "5'10"
    
    private String weight; // e.g., "75 kg"
    
    private String bloodGroup;
    
    private String emergencyContactName;
    
    private String emergencyContactPhone;
    
    @Builder.Default
    private Boolean profileVerified = false;
    
    private java.time.LocalDateTime profileVerifiedAt;
    
    private String verifiedBy; // Admin ID who verified profile
    
    // Note: isActive is inherited from BaseEntity
}

