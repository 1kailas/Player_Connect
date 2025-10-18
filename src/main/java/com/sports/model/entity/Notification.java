package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

/**
 * Notification Entity - User notifications
 */
@Document(collection = "notifications")
@CompoundIndex(name = "user_read_idx", def = "{'user_id': 1, 'is_read': 1}")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {
    
    @Field("user_id")
    @Indexed
    private String userId;
    
    @Field
    private String title;
    
    @Field
    private String message;
    
    @Field("notification_type")
    private String notificationType; // EVENT_UPDATE, MATCH_START, RANKING_CHANGE, etc.
    
    @Field("is_read")
    @Builder.Default
    private Boolean isRead = false;
    
    @Field("read_at")
    private LocalDateTime readAt;
    
    @Field("action_url")
    private String actionUrl;
    
    @Field("related_entity_type")
    private String relatedEntityType;
    
    @Field("related_entity_id")
    private String relatedEntityId;
}
