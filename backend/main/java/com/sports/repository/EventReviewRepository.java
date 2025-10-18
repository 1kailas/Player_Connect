package com.sports.repository;

import com.sports.model.entity.EventReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Event Review Repository
 */
@Repository
public interface EventReviewRepository extends MongoRepository<EventReview, String> {
    
    // Find reviews by event
    Page<EventReview> findByEventIdAndIsApprovedTrue(String eventId, Pageable pageable);
    
    List<EventReview> findByEventIdAndIsApprovedTrue(String eventId);
    
    // Find user's review for an event
    Optional<EventReview> findByEventIdAndUserId(String eventId, String userId);
    
    // Find reviews by user
    Page<EventReview> findByUserId(String userId, Pageable pageable);
    
    // Find reviews by rating
    Page<EventReview> findByEventIdAndRating(String eventId, Integer rating, Pageable pageable);
    
    // Find flagged reviews (for moderation)
    Page<EventReview> findByIsFlaggedTrue(Pageable pageable);
    
    // Find pending reviews (not approved)
    Page<EventReview> findByIsApprovedFalse(Pageable pageable);
    
    // Get average rating for event
    @Query("{'eventId': ?0, 'isApproved': true}")
    List<EventReview> findApprovedReviewsByEventId(String eventId);
    
    // Count reviews by event
    long countByEventIdAndIsApprovedTrue(String eventId);
    
    // Check if user reviewed event
    boolean existsByEventIdAndUserId(String eventId, String userId);
}
