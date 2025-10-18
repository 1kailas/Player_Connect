package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.EventFavorite;
import com.sports.model.entity.User;
import com.sports.service.AuthService;
import com.sports.service.EventFavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Event Favorite Controller
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Event Favorites", description = "Event favorite/bookmark endpoints")
public class EventFavoriteController {
    
    private final EventFavoriteService eventFavoriteService;
    private final AuthService authService;
    
    @PostMapping("/{eventId}/favorite")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Toggle event favorite")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleFavorite(
            @PathVariable String eventId) {
        try {
            User user = authService.getCurrentUser();
            EventFavorite result = eventFavoriteService.toggleFavorite(eventId, user);
            
            Map<String, Object> response = Map.of(
                "isFavorited", result != null,
                "message", result != null ? "Added to favorites" : "Removed from favorites"
            );
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{eventId}/favorite/check")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check if event is favorited")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkFavorite(
            @PathVariable String eventId) {
        try {
            User user = authService.getCurrentUser();
            boolean isFavorited = eventFavoriteService.isFavorited(eventId, user.getId());
            return ResponseEntity.ok(ApiResponse.success(Map.of("isFavorited", isFavorited)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{eventId}/favorite/count")
    @Operation(summary = "Get favorite count for event")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getFavoriteCount(
            @PathVariable String eventId) {
        try {
            long count = eventFavoriteService.getEventFavoriteCount(eventId);
            return ResponseEntity.ok(ApiResponse.success(Map.of("count", count)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/favorites/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user's favorite events")
    public ResponseEntity<ApiResponse<Page<EventFavorite>>> getMyFavorites(Pageable pageable) {
        try {
            User user = authService.getCurrentUser();
            Page<EventFavorite> favorites = eventFavoriteService.getUserFavorites(user.getId(), pageable);
            return ResponseEntity.ok(ApiResponse.success(favorites));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/favorites/my/ids")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user's favorite event IDs")
    public ResponseEntity<ApiResponse<List<String>>> getMyFavoriteIds() {
        try {
            User user = authService.getCurrentUser();
            List<String> eventIds = eventFavoriteService.getUserFavoriteEventIds(user.getId());
            return ResponseEntity.ok(ApiResponse.success(eventIds));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{eventId}/favorite/notifications")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update notification preferences for favorite")
    public ResponseEntity<ApiResponse<EventFavorite>> updateNotifications(
            @PathVariable String eventId,
            @RequestParam(required = false) Boolean notifyOnUpdates,
            @RequestParam(required = false) Boolean notifyOnRegistration) {
        try {
            User user = authService.getCurrentUser();
            EventFavorite updated = eventFavoriteService.updateNotificationPreferences(
                eventId, user, notifyOnUpdates, notifyOnRegistration);
            return ResponseEntity.ok(ApiResponse.success("Preferences updated", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
