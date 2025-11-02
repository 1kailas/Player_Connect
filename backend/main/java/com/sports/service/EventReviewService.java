package com.sports.service;

import com.sports.model.entity.EventReview;
import com.sports.model.entity.User;
import com.sports.repository.EventReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Event Review Service
 */
@Service
@RequiredArgsConstructor
public class EventReviewService {
    
    private final EventReviewRepository eventReviewRepository;
    
    @Transactional
    public EventReview createReview(String eventId, EventReview review, User user) {
        // Check if user already reviewed this event
        if (eventReviewRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            throw new RuntimeException("You have already reviewed this event");
        }
        
        // Validate rating
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        review.setEventId(eventId);
        review.setUserId(user.getId());
        review.setUsername(user.getUsername());
        review.setReviewDate(LocalDateTime.now());
        review.setIsApproved(true); // Auto-approve for now
        review.setIsFlagged(false);
        review.setIsActive(true);
        review.setHelpfulCount(0);
        
        EventReview saved = eventReviewRepository.save(review);
        
        return saved;
    }
    
    @Transactional
    public EventReview updateReview(String reviewId, EventReview updatedReview, User user) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUserId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        if (updatedReview.getRating() != null) {
            if (updatedReview.getRating() < 1 || updatedReview.getRating() > 5) {
                throw new RuntimeException("Rating must be between 1 and 5");
            }
            review.setRating(updatedReview.getRating());
        }
        
        if (updatedReview.getTitle() != null) {
            review.setTitle(updatedReview.getTitle());
        }
        
        if (updatedReview.getComment() != null) {
            review.setComment(updatedReview.getComment());
        }
        
        return eventReviewRepository.save(review);
    }
    
    @Transactional
    public void deleteReview(String reviewId, User user) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUserId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        eventReviewRepository.delete(review);
    }
    
    @Transactional
    public EventReview markHelpful(String reviewId, User user) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (review.getHelpfulUserIds().contains(user.getId())) {
            // Already marked, remove it
            review.getHelpfulUserIds().remove(user.getId());
            review.setHelpfulCount(review.getHelpfulUserIds().size());
        } else {
            // Add to helpful
            review.getHelpfulUserIds().add(user.getId());
            review.setHelpfulCount(review.getHelpfulUserIds().size());
        }
        
        return eventReviewRepository.save(review);
    }
    
    @Transactional
    public EventReview flagReview(String reviewId, String reason, User user) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setIsFlagged(true);
        review.setFlagReason(reason);
        
        return eventReviewRepository.save(review);
    }
    
    @Transactional
    public EventReview addOrganizerResponse(String reviewId, String response, User organizer) {
        EventReview review = eventReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setOrganizerResponse(response);
        review.setResponseDate(LocalDateTime.now());
        
        return eventReviewRepository.save(review);
    }
    
    public Page<EventReview> getEventReviews(String eventId, Pageable pageable) {
        return eventReviewRepository.findByEventIdAndIsApprovedTrue(eventId, pageable);
    }
    
    public Page<EventReview> getUserReviews(String userId, Pageable pageable) {
        return eventReviewRepository.findByUserId(userId, pageable);
    }
    
    public EventReview getUserReviewForEvent(String eventId, String userId) {
        return eventReviewRepository.findByEventIdAndUserId(eventId, userId)
                .orElse(null);
    }
    
    public Map<String, Object> getEventRatingStats(String eventId) {
        List<EventReview> reviews = eventReviewRepository.findByEventIdAndIsApprovedTrue(eventId);
        
        Map<String, Object> stats = new HashMap<>();
        
        if (reviews.isEmpty()) {
            stats.put("averageRating", 0.0);
            stats.put("totalReviews", 0);
            stats.put("ratingDistribution", new int[]{0, 0, 0, 0, 0});
            return stats;
        }
        
        // Calculate average
        double average = reviews.stream()
                .mapToInt(EventReview::getRating)
                .average()
                .orElse(0.0);
        
        // Rating distribution
        int[] distribution = new int[5];
        for (EventReview review : reviews) {
            distribution[review.getRating() - 1]++;
        }
        
        stats.put("averageRating", Math.round(average * 10) / 10.0);
        stats.put("totalReviews", reviews.size());
        stats.put("ratingDistribution", distribution);
        stats.put("fiveStars", distribution[4]);
        stats.put("fourStars", distribution[3]);
        stats.put("threeStars", distribution[2]);
        stats.put("twoStars", distribution[1]);
        stats.put("oneStar", distribution[0]);
        
        return stats;
    }
}
