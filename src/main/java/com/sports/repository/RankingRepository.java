package com.sports.repository;

import com.sports.model.entity.Ranking;
import com.sports.model.enums.SportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RankingRepository extends MongoRepository<Ranking, String> {
    
    List<Ranking> findBySportTypeAndRankingType(SportType sportType, String rankingType);
    
    Page<Ranking> findBySportTypeAndRankingType(SportType sportType, String rankingType, Pageable pageable);
    
    List<Ranking> findByPlayerProfileId(String playerProfileId);
    
    List<Ranking> findByTeamId(String teamId);
    
    @Query(value = "{ 'sportType': ?0, 'rankingType': ?1, 'rankingDate': { $gte: ?2, $lte: ?3 } }", sort = "{ 'rank': 1 }")
    List<Ranking> findRankingsBetweenDates(SportType sportType, String rankingType, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{ 'sportType': ?0, 'rankingType': ?1 }", sort = "{ 'rankingDate': -1 }")
    List<Ranking> findLatestRankings(SportType sportType, String rankingType, Pageable pageable);
}
