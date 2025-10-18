package com.sports.repository;

import com.sports.model.entity.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends MongoRepository<Achievement, String> {
    
    Optional<Achievement> findByName(String name);
    
    List<Achievement> findByBadgeType(String badgeType);
    
    List<Achievement> findByIsRareTrue();
}
