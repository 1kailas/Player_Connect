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

/**
 * Event Favorite Entity - User's favorite/bookmarked events
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "event_favorites")
public class EventFavorite {
    
    @Id
    private String id;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private Boolean isActive;
    
    private String userId;
    private String eventId;
    private LocalDateTime favoritedAt;
    
    // Notification preferences
    @Builder.Default
    private Boolean notifyOnUpdates = true;
    
    @Builder.Default
    private Boolean notifyOnRegistration = true;
}
