package com.sports.model.entity;

import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

/**
 * Player Profile - Sport-specific profile for users
 */
@Document(collection = "player_profiles")
@CompoundIndex(name = "user_sport_idx", def = "{'user_id': 1, 'sport_type': 1}", unique = true)
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerProfile extends BaseEntity {
    
    @Field("user_id")
    @Indexed
    private String userId;
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field("jersey_number")
    private String jerseyNumber;
    
    @Field
    private String position; // Player position (Forward, Defender, etc.)
    
    @Field
    private Double height; // in cm
    
    @Field
    private Double weight; // in kg
    
    @Field
    private String achievements;
    
    @Field("matches_played")
    @Builder.Default
    private Integer matchesPlayed = 0;
    
    @Field("matches_won")
    @Builder.Default
    private Integer matchesWon = 0;
    
    @Field("total_points")
    @Builder.Default
    private Integer totalPoints = 0;
    
    @Field
    @Builder.Default
    private Double rating = 0.0; // ELO or custom rating
    
    @Field("global_rank")
    private Integer globalRank;
    
    @Field("national_rank")
    private Integer nationalRank;
    
    @Field("state_rank")
    private Integer stateRank;
    
    @Field("city_rank")
    private Integer cityRank;
    
    @Field
    private String statistics; // Sport-specific statistics (stored as JSON)
    
    @Field("verified_player")
    @Builder.Default
    private Boolean verifiedPlayer = false;
}
