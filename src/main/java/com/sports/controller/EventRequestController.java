package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.EventRequest;
import com.sports.model.entity.User;
import com.sports.model.enums.EventRequestStatus;
import com.sports.service.AuthService;
import com.sports.service.EventRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


/**
 * Event Request Controller
 * - USER role: Can submit and view their own event requests
 * - ADMIN role: Can view, approve, and reject all requests
 */
@RestController
@RequestMapping("/api/event-requests")
@RequiredArgsConstructor
public class EventRequestController {
    
    private final EventRequestService eventRequestService;
    private final AuthService authService;
    
    // ============= USER ENDPOINTS (Only for normal users, not admins) =============
    
    @PostMapping
    @PreAuthorize("isAuthenticated() and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventRequest>> submitRequest(@RequestBody EventRequest request) {
        User currentUser = authService.getCurrentUser();
        request.setRequesterId(currentUser.getId());
        EventRequest createdRequest = eventRequestService.createRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Event request submitted successfully", createdRequest));
    }
    
    @GetMapping("/my-requests")
    @PreAuthorize("isAuthenticated() and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<EventRequest>>> getMyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User currentUser = authService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<EventRequest> requests = eventRequestService.getUserRequests(currentUser.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("User requests retrieved successfully", requests));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventRequest>> cancelRequest(@PathVariable String id) {
        User currentUser = authService.getCurrentUser();
        EventRequest cancelledRequest = eventRequestService.cancelRequest(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Request cancelled successfully", cancelledRequest));
    }
    
    // ============= ADMIN ENDPOINTS (Only for admins) =============
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<EventRequest>>> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventRequest> requests = eventRequestService.getPendingRequests(pageable);
        return ResponseEntity.ok(ApiResponse.success("Pending requests retrieved successfully", requests));
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<EventRequest>>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) EventRequestStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventRequest> requests;
        
        if (status != null) {
            requests = eventRequestService.getRequestsByStatus(status, pageable);
        } else {
            requests = eventRequestService.getAllRequests(pageable);
        }
        
        return ResponseEntity.ok(ApiResponse.success("Requests retrieved successfully", requests));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<EventRequest>> getRequestById(@PathVariable String id) {
        EventRequest request = eventRequestService.getRequestById(id);
        return ResponseEntity.ok(ApiResponse.success("Request retrieved successfully", request));
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventRequest>> approveRequest(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        User admin = authService.getCurrentUser();
        String comments = body != null ? body.get("comments") : null;
        EventRequest updatedRequest = eventRequestService.approveRequest(id, admin, comments);
        return ResponseEntity.ok(ApiResponse.success("Request approved successfully", updatedRequest));
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventRequest>> rejectRequest(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentUser();
        String comments = body.get("comments");
        EventRequest updatedRequest = eventRequestService.rejectRequest(id, admin, comments);
        return ResponseEntity.ok(ApiResponse.success("Request rejected successfully", updatedRequest));
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = eventRequestService.getRequestStats();
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved successfully", stats));
    }
}
