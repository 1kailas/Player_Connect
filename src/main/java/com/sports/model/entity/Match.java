package com.sports.model.entity;

import com.sports.model.enums.MatchStatus;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Match Entity - Individual matches within events
 */
@Document(collection = "matches")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match extends BaseEntity {
    
    @Field("event_id")
    @Indexed
    private String eventId;
    
    @Field("match_number")
    private String matchNumber;
    
    @Field("team1_id")
    private String team1Id;
    
    @Field("team2_id")
    private String team2Id;
    
    @Field("player1_id")
    private String player1Id;
    
    @Field("player2_id")
    private String player2Id;
    
    @Field("venue_id")
    private String venueId;
    
    @Field("scheduled_time")
    @Indexed
    private LocalDateTime scheduledTime;
    
    @Field("actual_start_time")
    private LocalDateTime actualStartTime;
    
    @Field("actual_end_time")
    private LocalDateTime actualEndTime;
    
    @Field
    @Indexed
    @Builder.Default
    private MatchStatus status = MatchStatus.SCHEDULED;
    
    @Field("team1_score")
    private Integer team1Score;
    
    @Field("team2_score")
    private Integer team2Score;
    
    @Field("winner_team_id")
    private String winnerTeamId;
    
    @Field("winner_player_id")
    private String winnerPlayerId;
    
    @Field("referee_id")
    private String refereeId;
    
    @Field("match_summary")
    private String matchSummary;
    
    @Field("live_score_data")
    private String liveScoreData; // JSON for real-time score updates
    
    @Field("streaming_url")
    private String streamingUrl;
    
    @Field("round_name")
    private String roundName; // Quarter-final, Semi-final, Final, etc.
    
    @Field("is_live")
    @Builder.Default
    private Boolean isLive = false;
    
    @Field("total_viewers")
    @Builder.Default
    private Integer totalViewers = 0;
}
