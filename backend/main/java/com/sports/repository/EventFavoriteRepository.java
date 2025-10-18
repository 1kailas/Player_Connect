package com.sports.repository;

import com.sports.model.entity.EventFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Event Favorite Repository
 */
@Repository
public interface EventFavoriteRepository extends MongoRepository<EventFavorite, String> {
    
    // Find user's favorites
    Page<EventFavorite> findByUserId(String userId, Pageable pageable);
    
    List<EventFavorite> findByUserId(String userId);
    
    // Find favorites for an event
    List<EventFavorite> findByEventId(String eventId);
    
    long countByEventId(String eventId);
    
    // Check if user favorited event
    boolean existsByUserIdAndEventId(String userId, String eventId);
    
    // Find specific favorite
    Optional<EventFavorite> findByUserIdAndEventId(String userId, String eventId);
    
    // Delete favorite
    void deleteByUserIdAndEventId(String userId, String eventId);
}
