package com.sports.repository;

import com.sports.model.entity.Match;
import com.sports.model.enums.MatchStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends MongoRepository<Match, String> {
    
    List<Match> findByEventId(String eventId);
    
    List<Match> findByStatus(MatchStatus status);
    
    @Query(value = "{ 'status': 'LIVE' }", sort = "{ 'totalViewers': -1 }")
    List<Match> findLiveMatches();
    
    @Query("{ $or: [ { 'team1Id': ?0 }, { 'team2Id': ?0 } ] }")
    List<Match> findMatchesByTeam(String teamId);
    
    @Query("{ $or: [ { 'player1Id': ?0 }, { 'player2Id': ?0 } ] }")
    List<Match> findMatchesByPlayer(String playerId);
    
    @Query("{ 'scheduledTime': { $gte: ?0, $lte: ?1 } }")
    List<Match> findMatchesBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{ 'scheduledTime': { $gt: ?0 }, 'status': 'SCHEDULED' }", sort = "{ 'scheduledTime': 1 }")
    List<Match> findUpcomingMatches(LocalDateTime currentDate, Pageable pageable);
    
    List<Match> findByVenueId(String venueId);
    
    Page<Match> findByEventId(String eventId, Pageable pageable);
}
