package com.sports.service;


import com.sports.model.entity.PlayerProfile;
import com.sports.model.entity.Ranking;
import com.sports.model.entity.Team;
import com.sports.model.enums.SportType;
import com.sports.repository.PlayerProfileRepository;
import com.sports.repository.RankingRepository;
import com.sports.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Ranking Service - Calculates and updates rankings
 */
@Service
@RequiredArgsConstructor
public class RankingService {
    
    private final RankingRepository rankingRepository;
    private final PlayerProfileRepository playerProfileRepository;
    private final TeamRepository teamRepository;
    
    /**
     * Calculate player rankings for a specific sport
     */
    @Transactional
    public void calculatePlayerRankings(SportType sportType) {
        List<PlayerProfile> players = playerProfileRepository.findBySportType(sportType);
        
        // Sort by rating (descending)
        players.sort(Comparator.comparing(PlayerProfile::getRating).reversed());
        
        AtomicInteger rank = new AtomicInteger(1);
        LocalDateTime now = LocalDateTime.now();
        
        players.forEach(player -> {
            // Update player rank
            Integer previousRank = player.getGlobalRank();
            player.setGlobalRank(rank.get());
            playerProfileRepository.save(player);
            
            // Create ranking history
            Ranking ranking = Ranking.builder()
                    .sportType(sportType)
                    .rankingType("GLOBAL")
                    .rankingCategory("PLAYER")
                    .playerProfileId(player.getId())
                    .rank(rank.get())
                    .previousRank(previousRank)
                    .points(player.getTotalPoints().doubleValue())
                    .rating(player.getRating())
                    .rankingDate(now)
                    .build();
            
            rankingRepository.save(ranking);
            rank.incrementAndGet();
        });
    }
    
    /**
     * Calculate team rankings for a specific sport
     */
    @Transactional
    public void calculateTeamRankings(SportType sportType) {
        List<Team> teams = teamRepository.findBySportType(sportType);
        
        // Sort by rating (descending)
        teams.sort(Comparator.comparing(Team::getRating).reversed());
        
        AtomicInteger rank = new AtomicInteger(1);
        LocalDateTime now = LocalDateTime.now();
        
        teams.forEach(team -> {
            // Update team rank
            Integer previousRank = team.getCurrentRank();
            team.setCurrentRank(rank.get());
            teamRepository.save(team);
            
            // Create ranking history
            Ranking ranking = Ranking.builder()
                    .sportType(sportType)
                    .rankingType("GLOBAL")
                    .rankingCategory("TEAM")
                    .teamId(team.getId())
                    .rank(rank.get())
                    .previousRank(previousRank)
                    .points(team.getTotalPoints().doubleValue())
                    .rating(team.getRating())
                    .rankingDate(now)
                    .build();
            
            rankingRepository.save(ranking);
            rank.incrementAndGet();
        });
    }
    
    /**
     * Update player rating after a match (ELO-like system)
     */
    @Transactional
    public void updatePlayerRating(String winnerId, String loserId, SportType sportType) {
        PlayerProfile winner = playerProfileRepository.findById(winnerId)
                .orElseThrow(() -> new RuntimeException("Winner profile not found"));
        PlayerProfile loser = playerProfileRepository.findById(loserId)
                .orElseThrow(() -> new RuntimeException("Loser profile not found"));
        
        final double K = 32; // K-factor for rating calculation
        
        double expectedWinner = 1.0 / (1.0 + Math.pow(10, (loser.getRating() - winner.getRating()) / 400.0));
        double expectedLoser = 1.0 / (1.0 + Math.pow(10, (winner.getRating() - loser.getRating()) / 400.0));
        
        winner.setRating(winner.getRating() + K * (1 - expectedWinner));
        winner.setMatchesWon(winner.getMatchesWon() + 1);
        winner.setMatchesPlayed(winner.getMatchesPlayed() + 1);
        winner.setTotalPoints(winner.getTotalPoints() + 100);
        
        loser.setRating(loser.getRating() + K * (0 - expectedLoser));
        loser.setMatchesPlayed(loser.getMatchesPlayed() + 1);
        loser.setTotalPoints(loser.getTotalPoints() + 10);
        
        playerProfileRepository.save(winner);
        playerProfileRepository.save(loser);
    }
    
    public List<Ranking> getLatestRankings(SportType sportType, String rankingType) {
        return rankingRepository.findLatestRankings(sportType, rankingType, org.springframework.data.domain.Pageable.ofSize(100));
    }
    
    public List<Ranking> getPlayerRankingHistory(String playerProfileId) {
        return rankingRepository.findByPlayerProfileId(playerProfileId);
    }
    
    public List<Ranking> getTeamRankingHistory(String teamId) {
        return rankingRepository.findByTeamId(teamId);
    }
    
    /**
     * Scheduled task to recalculate rankings daily
     */
    @Scheduled(cron = "0 0 2 * * *") // Run at 2 AM daily
    public void scheduledRankingUpdate() {
        for (SportType sportType : SportType.values()) {
            calculatePlayerRankings(sportType);
            calculateTeamRankings(sportType);
        }
    }
}
