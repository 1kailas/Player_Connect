package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * User Achievement - Tracks achievements earned by users
 */
@Document(collection = "user_achievements")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAchievement extends BaseEntity {
    
    @Field("user_id")
    @Indexed
    private String userId;
    
    @Field("achievement_id")
    @Indexed
    private String achievementId;
    
    @Field("earned_at")
    private LocalDateTime earnedAt;
    
    @Field("is_displayed")
    @Builder.Default
    private Boolean isDisplayed = true;
}
