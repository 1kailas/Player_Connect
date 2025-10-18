package com.sports.repository;

import com.sports.model.entity.UserAchievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends MongoRepository<UserAchievement, String> {
    
    List<UserAchievement> findByUserId(String userId);
    
    List<UserAchievement> findByUserIdAndIsDisplayedTrue(String userId);
    
    Optional<UserAchievement> findByUserIdAndAchievementId(String userId, String achievementId);
    
    long countByUserId(String userId);
    
    @Query(value = "{ 'userId': ?0 }", sort = "{ 'earnedAt': -1 }")
    List<UserAchievement> findRecentAchievements(String userId);
}
