package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.EventReview;
import com.sports.model.entity.User;
import com.sports.service.AuthService;
import com.sports.service.EventReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Event Review Controller
 */
@RestController
@RequestMapping("/api/events/{eventId}/reviews")
@RequiredArgsConstructor
@Tag(name = "Event Reviews", description = "Event review and rating endpoints")
public class EventReviewController {
    
    private final EventReviewService eventReviewService;
    private final AuthService authService;
    
    @GetMapping
    @Operation(summary = "Get event reviews")
    public ResponseEntity<ApiResponse<Page<EventReview>>> getEventReviews(
            @PathVariable String eventId,
            Pageable pageable) {
        try {
            Page<EventReview> reviews = eventReviewService.getEventReviews(eventId, pageable);
            return ResponseEntity.ok(ApiResponse.success(reviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get event rating statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventRatingStats(
            @PathVariable String eventId) {
        try {
            Map<String, Object> stats = eventReviewService.getEventRatingStats(eventId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create event review")
    public ResponseEntity<ApiResponse<EventReview>> createReview(
            @PathVariable String eventId,
            @RequestBody EventReview review) {
        try {
            User user = authService.getCurrentUser();
            EventReview created = eventReviewService.createReview(eventId, review, user);
            return ResponseEntity.ok(ApiResponse.success("Review created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update own review")
    public ResponseEntity<ApiResponse<EventReview>> updateReview(
            @PathVariable String eventId,
            @PathVariable String reviewId,
            @RequestBody EventReview review) {
        try {
            User user = authService.getCurrentUser();
            EventReview updated = eventReviewService.updateReview(reviewId, review, user);
            return ResponseEntity.ok(ApiResponse.success("Review updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete own review")
    public ResponseEntity<ApiResponse<String>> deleteReview(
            @PathVariable String eventId,
            @PathVariable String reviewId) {
        try {
            User user = authService.getCurrentUser();
            eventReviewService.deleteReview(reviewId, user);
            return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{reviewId}/helpful")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark review as helpful")
    public ResponseEntity<ApiResponse<EventReview>> markHelpful(
            @PathVariable String eventId,
            @PathVariable String reviewId) {
        try {
            User user = authService.getCurrentUser();
            EventReview updated = eventReviewService.markHelpful(reviewId, user);
            return ResponseEntity.ok(ApiResponse.success(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{reviewId}/flag")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Flag review for moderation")
    public ResponseEntity<ApiResponse<EventReview>> flagReview(
            @PathVariable String eventId,
            @PathVariable String reviewId,
            @RequestParam String reason) {
        try {
            User user = authService.getCurrentUser();
            EventReview updated = eventReviewService.flagReview(reviewId, reason, user);
            return ResponseEntity.ok(ApiResponse.success("Review flagged for moderation", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{reviewId}/response")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Add organizer response to review")
    public ResponseEntity<ApiResponse<EventReview>> addResponse(
            @PathVariable String eventId,
            @PathVariable String reviewId,
            @RequestBody Map<String, String> request) {
        try {
            User organizer = authService.getCurrentUser();
            String response = request.get("response");
            EventReview updated = eventReviewService.addOrganizerResponse(reviewId, response, organizer);
            return ResponseEntity.ok(ApiResponse.success("Response added successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
