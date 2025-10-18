package com.sports.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Event Review Entity - Reviews and ratings for events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "event_reviews")
public class EventReview {
    
    @Id
    private String id;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private Boolean isActive;
    
    private String eventId;
    private String userId;
    private String username; // Denormalized for performance
    
    private Integer rating; // 1-5 stars
    private String title;
    private String comment;
    
    // Review metadata
    private LocalDateTime reviewDate;
    
    @Builder.Default
    private Boolean isVerifiedAttendee = false; // Did they actually attend?
    
    // Helpfulness
    @Builder.Default
    private List<String> helpfulUserIds = new ArrayList<>(); // Users who found this helpful
    
    @Builder.Default
    private Integer helpfulCount = 0;
    
    // Moderation
    @Builder.Default
    private Boolean isApproved = true;
    
    @Builder.Default
    private Boolean isFlagged = false;
    
    private String flagReason;
    
    // Response from organizer
    private String organizerResponse;
    private LocalDateTime responseDate;
}
