package com.sports.model.entity;

import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

/**
 * Team Entity - Represents sports teams
 */
@Document(collection = "teams")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team extends BaseEntity {
    
    @Field
    @Indexed
    private String name;
    
    @Field("team_code")
    @Indexed(unique = true)
    private String teamCode;
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field
    private String description;
    
    @Field
    private String logoUrl;
    
    @Field
    private String bannerUrl;
    
    @Field("captain_id")
    private String captainId;
    
    @Field("coach_id")
    private String coachId;
    
    @Field("member_ids")
    @Builder.Default
    private List<String> memberIds = new ArrayList<>();
    
    @Field("home_venue_id")
    private String homeVenueId;
    
    @Field
    private String city;
    
    @Field
    private String state;
    
    @Field
    private String country;
    
    @Field("matches_played")
    @Builder.Default
    private Integer matchesPlayed = 0;
    
    @Field("matches_won")
    @Builder.Default
    private Integer matchesWon = 0;
    
    @Field("matches_lost")
    @Builder.Default
    private Integer matchesLost = 0;
    
    @Field("matches_drawn")
    @Builder.Default
    private Integer matchesDrawn = 0;
    
    @Field("total_points")
    @Builder.Default
    private Integer totalPoints = 0;
    
    @Field
    @Builder.Default
    private Double rating = 0.0;
    
    @Field("current_rank")
    private Integer currentRank;
    
    @Field("verified_team")
    @Builder.Default
    private Boolean verifiedTeam = false;
    
    @Field("registration_date")
    private java.time.LocalDate registrationDate;
}
