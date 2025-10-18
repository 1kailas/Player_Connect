package com.sports.model.entity;

import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

/**
 * Ranking Entity - Historical rankings for players/teams
 */
@Document(collection = "rankings")
@CompoundIndex(name = "ranking_type_sport_idx", def = "{'ranking_type': 1, 'sport_type': 1}")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ranking extends BaseEntity {
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field("ranking_type")
    @Indexed
    private String rankingType; // GLOBAL, NATIONAL, STATE, CITY
    
    @Field("ranking_category")
    private String rankingCategory; // PLAYER, TEAM
    
    @Field("player_profile_id")
    private String playerProfileId;
    
    @Field("team_id")
    private String teamId;
    
    @Field
    private Integer rank;
    
    @Field("previous_rank")
    private Integer previousRank;
    
    @Field
    private Double points;
    
    @Field
    private Double rating;
    
    @Field("ranking_date")
    @Indexed
    private LocalDateTime rankingDate;
    
    @Field("geographic_scope")
    private String geographicScope; // Country, State, City name
}
