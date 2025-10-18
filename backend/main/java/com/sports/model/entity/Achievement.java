package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Achievement/Badge Entity - User achievements
 */
@Document(collection = "achievements")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement extends BaseEntity {
    
    @Field
    @Indexed
    private String name;
    
    @Field
    private String description;
    
    @Field("icon_url")
    private String iconUrl;
    
    @Field("badge_type")
    private String badgeType; // GOLD, SILVER, BRONZE, PLATINUM
    
    @Field("points_required")
    private Integer pointsRequired;
    
    @Field("is_rare")
    @Builder.Default
    private Boolean isRare = false;
}
