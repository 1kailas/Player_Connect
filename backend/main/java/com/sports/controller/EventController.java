package com.sports.controller;


import com.sports.dto.ApiResponse;
import com.sports.model.entity.Event;
import com.sports.model.entity.User;
import com.sports.model.enums.EventStatus;
import com.sports.model.enums.SportType;
import com.sports.service.AuthService;
import com.sports.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Event Controller
 */
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management endpoints")
public class EventController {
    
    private final EventService eventService;
    private final AuthService authService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Create a new event")
    public ResponseEntity<ApiResponse<Event>> createEvent(@RequestBody Event event) {
        try {
            User organizer = authService.getCurrentUser();
            Event created = eventService.createEvent(event, organizer);
            return ResponseEntity.ok(ApiResponse.success("Event created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Update an event")
    public ResponseEntity<ApiResponse<Event>> updateEvent(@PathVariable String id, @RequestBody Event event) {
        try {
            Event updated = eventService.updateEvent(id, event);
            return ResponseEntity.ok(ApiResponse.success("Event updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Update event status")
    public ResponseEntity<ApiResponse<Event>> updateEventStatus(
            @PathVariable String id,
            @RequestParam EventStatus status) {
        try {
            Event updated = eventService.updateEventStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Status updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/register")
    @Operation(summary = "Register for an event")
    public ResponseEntity<ApiResponse<String>> registerForEvent(@PathVariable String id) {
        try {
            User user = authService.getCurrentUser();
            eventService.registerForEvent(id, user);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", "You have been registered for the event"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable String id) {
        try {
            Event event = eventService.getEventById(id);
            return ResponseEntity.ok(ApiResponse.success(event));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all events")
    public ResponseEntity<ApiResponse<Page<Event>>> getAllEvents(Pageable pageable) {
        Page<Event> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/sport/{sportType}")
    @Operation(summary = "Get events by sport type")
    public ResponseEntity<ApiResponse<Page<Event>>> getEventsBySportType(
            @PathVariable SportType sportType,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsBySportType(sportType, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/filter")
    @Operation(summary = "Filter events by sport type and status")
    public ResponseEntity<ApiResponse<Page<Event>>> filterEvents(
            @RequestParam(required = false) SportType sportType,
            @RequestParam(required = false) EventStatus status,
            Pageable pageable) {
        Page<Event> events = eventService.filterEvents(sportType, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events")
    public ResponseEntity<ApiResponse<List<Event>>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/live")
    @Operation(summary = "Get live events")
    public ResponseEntity<ApiResponse<List<Event>>> getLiveEvents() {
        List<Event> events = eventService.getLiveEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search events")
    public ResponseEntity<ApiResponse<Page<Event>>> searchEvents(
            @RequestParam String query,
            Pageable pageable) {
        Page<Event> events = eventService.searchEvents(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Delete an event")
    public ResponseEntity<ApiResponse<String>> deleteEvent(@PathVariable String id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Location-based endpoints for map integration
    @GetMapping("/map/all")
    @Operation(summary = "Get all events with location for map display")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsWithLocation() {
        List<Event> events = eventService.getEventsWithLocation();
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/map/nearby")
    @Operation(summary = "Get nearby events based on coordinates")
    public ResponseEntity<ApiResponse<List<Event>>> getNearbyEvents(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50") Double radiusKm) {
        List<Event> events = eventService.getNearbyEvents(latitude, longitude, radiusKm);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/map/city/{city}")
    @Operation(summary = "Get events in a specific city")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsByCity(@PathVariable String city) {
        List<Event> events = eventService.getEventsByCity(city);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
    
    @GetMapping("/map/city/{city}/status/{status}")
    @Operation(summary = "Get events in a city with specific status")
    public ResponseEntity<ApiResponse<List<Event>>> getEventsByCityAndStatus(
            @PathVariable String city,
            @PathVariable EventStatus status) {
        List<Event> events = eventService.getEventsByCityAndStatus(city, status);
        return ResponseEntity.ok(ApiResponse.success(events));
    }
}
