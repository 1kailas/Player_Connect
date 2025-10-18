package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Match Events Entity
 * Stores timeline of match events (goals, cards, substitutions, etc.)
 */
@Document(collection = "match_events")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEvent extends BaseEntity {
    
    @Field("match_id")
    @Indexed
    private String matchId;
    
    @Field("event_type")
    @Indexed
    private EventType eventType;
    
    @Field("minute")
    private Integer minute; // Match minute when event occurred
    
    @Field("extra_time_minute")
    private Integer extraTimeMinute; // For 90+2, etc.
    
    @Field("team_id")
    @Indexed
    private String teamId; // Team involved in the event
    
    @Field("player_id")
    @Indexed
    private String playerId; // Main player involved
    
    @Field("secondary_player_id")
    private String secondaryPlayerId; // For assists, subs, etc.
    
    @Field("description")
    private String description; // Event description
    
    @Field("commentary")
    private String commentary; // Live commentary text
    
    @Field("is_home_team")
    private Boolean isHomeTeam;
    
    @Field("event_time")
    private LocalDateTime eventTime;
    
    @Field("video_url")
    private String videoUrl; // Optional highlight video
    
    // For goal events
    @Field("is_penalty")
    @Builder.Default
    private Boolean isPenalty = false;
    
    @Field("is_own_goal")
    @Builder.Default
    private Boolean isOwnGoal = false;
    
    // For card events
    @Field("card_type")
    private CardType cardType;
    
    @Field("foul_description")
    private String foulDescription;
    
    // Match score after this event
    @Field("home_score_after")
    private Integer homeScoreAfter;
    
    @Field("away_score_after")
    private Integer awayScoreAfter;
    
    /**
     * Event Type Enum
     */
    public enum EventType {
        GOAL,
        ASSIST,
        YELLOW_CARD,
        RED_CARD,
        SUBSTITUTION,
        PENALTY_AWARDED,
        PENALTY_MISSED,
        PENALTY_SAVED,
        VAR_DECISION,
        INJURY,
        KICK_OFF,
        HALF_TIME,
        FULL_TIME,
        EXTRA_TIME_START,
        PENALTY_SHOOTOUT
    }
    
    /**
     * Card Type Enum
     */
    public enum CardType {
        YELLOW,
        SECOND_YELLOW,
        RED
    }
}

/**
 * Match Commentary Entity
 * Stores live match commentary and statistics
 */
@Document(collection = "match_commentary")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
class MatchCommentary extends BaseEntity {
    
    @Field("match_id")
    @Indexed
    private String matchId;
    
    @Field("commentary_entries")
    @Builder.Default
    private List<CommentaryEntry> commentaryEntries = new ArrayList<>();
    
    @Field("match_statistics")
    private MatchStatistics matchStatistics;
    
    /**
     * Commentary Entry
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CommentaryEntry {
        @Field("minute")
        private Integer minute;
        
        @Field("extra_time")
        private Integer extraTime;
        
        @Field("text")
        private String text;
        
        @Field("timestamp")
        private LocalDateTime timestamp;
        
        @Field("is_important")
        @Builder.Default
        private Boolean isImportant = false; // Highlight important commentary
    }
    
    /**
     * Match Statistics
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MatchStatistics {
        // Possession
        @Field("home_possession")
        private Integer homePossession;
        
        @Field("away_possession")
        private Integer awayPossession;
        
        // Shots
        @Field("home_shots")
        private Integer homeShots;
        
        @Field("away_shots")
        private Integer awayShots;
        
        @Field("home_shots_on_target")
        private Integer homeShotsOnTarget;
        
        @Field("away_shots_on_target")
        private Integer awayShotsOnTarget;
        
        // Passes
        @Field("home_passes")
        private Integer homePasses;
        
        @Field("away_passes")
        private Integer awayPasses;
        
        @Field("home_pass_accuracy")
        private Double homePassAccuracy;
        
        @Field("away_pass_accuracy")
        private Double awayPassAccuracy;
        
        // Fouls and Cards
        @Field("home_fouls")
        private Integer homeFouls;
        
        @Field("away_fouls")
        private Integer awayFouls;
        
        @Field("home_yellow_cards")
        private Integer homeYellowCards;
        
        @Field("away_yellow_cards")
        private Integer awayYellowCards;
        
        @Field("home_red_cards")
        private Integer homeRedCards;
        
        @Field("away_red_cards")
        private Integer awayRedCards;
        
        // Corners and Offsides
        @Field("home_corners")
        private Integer homeCorners;
        
        @Field("away_corners")
        private Integer awayCorners;
        
        @Field("home_offsides")
        private Integer homeOffsides;
        
        @Field("away_offsides")
        private Integer awayOffsides;
    }
}
