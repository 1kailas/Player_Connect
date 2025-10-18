package com.sports.model.entity;

import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Team Squad Entity
 * Manages team roster, formations, and player assignments
 */
@Document(collection = "team_squads")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamSquad extends BaseEntity {
    
    @Field("team_id")
    @Indexed
    private String teamId;
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field("season")
    @Indexed
    private String season; // e.g., "2024-2025"
    
    @Field("formation")
    private String formation; // e.g., "4-3-3", "4-4-2"
    
    @Field("captain_id")
    private String captainId;
    
    @Field("vice_captain_id")
    private String viceCaptainId;
    
    @Field("players")
    @Builder.Default
    private List<SquadPlayer> players = new ArrayList<>();
    
    @Field("total_players")
    @Builder.Default
    private Integer totalPlayers = 0;
    
    @Field("is_active")
    @Builder.Default
    private Boolean isActive = true;
    
    /**
     * Squad Player Information
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SquadPlayer {
        @Field("player_id")
        private String playerId;
        
        @Field("jersey_number")
        private Integer jerseyNumber;
        
        @Field("position")
        private String position; // GK, DEF, MID, FWD
        
        @Field("is_starter")
        @Builder.Default
        private Boolean isStarter = false;
        
        @Field("joined_date")
        private LocalDate joinedDate;
        
        @Field("contract_end_date")
        private LocalDate contractEndDate;
        
        @Field("is_injured")
        @Builder.Default
        private Boolean isInjured = false;
        
        @Field("injury_details")
        private String injuryDetails;
        
        @Field("expected_return_date")
        private LocalDate expectedReturnDate;
        
        @Field("is_on_loan")
        @Builder.Default
        private Boolean isOnLoan = false;
        
        @Field("loan_team_id")
        private String loanTeamId;
        
        @Field("transfer_history")
        @Builder.Default
        private List<TransferRecord> transferHistory = new ArrayList<>();
    }
    
    /**
     * Transfer Record
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransferRecord {
        @Field("from_team_id")
        private String fromTeamId;
        
        @Field("to_team_id")
        private String toTeamId;
        
        @Field("transfer_date")
        private LocalDate transferDate;
        
        @Field("transfer_fee")
        private Double transferFee;
        
        @Field("transfer_type")
        private String transferType; // PERMANENT, LOAN, FREE
        
        @Field("season")
        private String season;
    }
}
