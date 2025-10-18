package com.sports.model.entity;

import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Player Statistics Entity
 * Tracks comprehensive player performance metrics
 */
@Document(collection = "player_statistics")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerStatistics extends BaseEntity {
    
    @Field("player_id")
    @Indexed
    private String playerId;
    
    @Field("team_id")
    @Indexed
    private String teamId;
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field("season")
    @Indexed
    private String season; // e.g., "2024-2025"
    
    // ============= General Stats =============
    
    @Field("matches_played")
    @Builder.Default
    private Integer matchesPlayed = 0;
    
    @Field("matches_started")
    @Builder.Default
    private Integer matchesStarted = 0;
    
    @Field("minutes_played")
    @Builder.Default
    private Integer minutesPlayed = 0;
    
    // ============= Attacking Stats (Football/Soccer) =============
    
    @Field("goals")
    @Builder.Default
    private Integer goals = 0;
    
    @Field("assists")
    @Builder.Default
    private Integer assists = 0;
    
    @Field("shots")
    @Builder.Default
    private Integer shots = 0;
    
    @Field("shots_on_target")
    @Builder.Default
    private Integer shotsOnTarget = 0;
    
    @Field("penalties_scored")
    @Builder.Default
    private Integer penaltiesScored = 0;
    
    @Field("penalties_missed")
    @Builder.Default
    private Integer penaltiesMissed = 0;
    
    @Field("hat_tricks")
    @Builder.Default
    private Integer hatTricks = 0;
    
    // ============= Defensive Stats =============
    
    @Field("tackles")
    @Builder.Default
    private Integer tackles = 0;
    
    @Field("interceptions")
    @Builder.Default
    private Integer interceptions = 0;
    
    @Field("blocks")
    @Builder.Default
    private Integer blocks = 0;
    
    @Field("clearances")
    @Builder.Default
    private Integer clearances = 0;
    
    // ============= Goalkeeper Stats =============
    
    @Field("clean_sheets")
    @Builder.Default
    private Integer cleanSheets = 0;
    
    @Field("saves")
    @Builder.Default
    private Integer saves = 0;
    
    @Field("goals_conceded")
    @Builder.Default
    private Integer goalsConceded = 0;
    
    @Field("penalties_saved")
    @Builder.Default
    private Integer penaltiesSaved = 0;
    
    // ============= Discipline =============
    
    @Field("yellow_cards")
    @Builder.Default
    private Integer yellowCards = 0;
    
    @Field("red_cards")
    @Builder.Default
    private Integer redCards = 0;
    
    @Field("fouls_committed")
    @Builder.Default
    private Integer foulsCommitted = 0;
    
    @Field("fouls_drawn")
    @Builder.Default
    private Integer foulsDrawn = 0;
    
    // ============= Passing Stats =============
    
    @Field("passes_completed")
    @Builder.Default
    private Integer passesCompleted = 0;
    
    @Field("passes_attempted")
    @Builder.Default
    private Integer passesAttempted = 0;
    
    @Field("key_passes")
    @Builder.Default
    private Integer keyPasses = 0;
    
    @Field("crosses")
    @Builder.Default
    private Integer crosses = 0;
    
    // ============= Other Stats =============
    
    @Field("player_of_match_awards")
    @Builder.Default
    private Integer playerOfMatchAwards = 0;
    
    @Field("average_rating")
    @Builder.Default
    private Double averageRating = 0.0;
    
    @Field("is_current_season")
    @Builder.Default
    private Boolean isCurrentSeason = true;
}
