package com.sports.repository;

import com.sports.model.entity.PlayerProfile;
import com.sports.model.enums.SportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerProfileRepository extends MongoRepository<PlayerProfile, String> {
    
    List<PlayerProfile> findByUserId(String userId);
    
    Optional<PlayerProfile> findByUserIdAndSportType(String userId, SportType sportType);
    
    List<PlayerProfile> findBySportType(SportType sportType);
    
    Page<PlayerProfile> findBySportType(SportType sportType, Pageable pageable);
    
    @Query(value = "{ 'sportType': ?0, 'globalRank': { $ne: null } }", sort = "{ 'globalRank': 1 }")
    List<PlayerProfile> findTopGlobalPlayers(SportType sportType, Pageable pageable);
    
    List<PlayerProfile> findByVerifiedPlayerTrue();
    
    @Query(value = "{ 'sportType': ?0, 'rating': { $gte: ?1 } }", sort = "{ 'rating': -1 }")
    List<PlayerProfile> findByMinimumRating(SportType sportType, Double minRating, Pageable pageable);
}
