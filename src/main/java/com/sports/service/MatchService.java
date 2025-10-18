package com.sports.service;


import com.sports.model.entity.Match;
import com.sports.model.enums.MatchStatus;
import com.sports.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Match Service
 */
@Service
@RequiredArgsConstructor
public class MatchService {
    
    private final MatchRepository matchRepository;
    
    @Transactional
    public Match createMatch(Match match) {
        match.setStatus(MatchStatus.SCHEDULED);
        return matchRepository.save(match);
    }
    
    @Transactional
    public Match updateMatchScore(String matchId, Integer team1Score, Integer team2Score) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        match.setTeam1Score(team1Score);
        match.setTeam2Score(team2Score);
        
        return matchRepository.save(match);
    }
    
    @Transactional
    public Match startMatch(String matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        match.setStatus(MatchStatus.LIVE);
        match.setActualStartTime(LocalDateTime.now());
        match.setIsLive(true);
        
        return matchRepository.save(match);
    }
    
    @Transactional
    public Match completeMatch(String matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        match.setStatus(MatchStatus.COMPLETED);
        match.setActualEndTime(LocalDateTime.now());
        match.setIsLive(false);
        
        // Determine winner
        if (match.getTeam1Score() != null && match.getTeam2Score() != null) {
            if (match.getTeam1Score() > match.getTeam2Score()) {
                match.setWinnerTeamId(match.getTeam1Id());
            } else if (match.getTeam2Score() > match.getTeam1Score()) {
                match.setWinnerTeamId(match.getTeam2Id());
            }
        }
        
        return matchRepository.save(match);
    }
    
    public Match getMatchById(String matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
    }
    
    public List<Match> getMatchesByEvent(String eventId) {
        return matchRepository.findByEventId(eventId);
    }
    
    public List<Match> getLiveMatches() {
        return matchRepository.findLiveMatches();
    }
    
    public List<Match> getUpcomingMatches() {
        return matchRepository.findUpcomingMatches(LocalDateTime.now(), Pageable.ofSize(20));
    }
    
    public List<Match> getMatchesByTeam(String teamId) {
        return matchRepository.findMatchesByTeam(teamId);
    }
    
    public Page<Match> getMatchesByEvent(String eventId, Pageable pageable) {
        return matchRepository.findByEventId(eventId, pageable);
    }
}
