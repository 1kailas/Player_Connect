package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.User;
import com.sports.service.AuthService;
import com.sports.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


/**
 * User Profile Controller
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management endpoints")
public class UserController {
    
    private final UserService userService;
    private final AuthService authService;
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<User>> getCurrentUserProfile() {
        try {
            User user = authService.getCurrentUser();
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID")
    public ResponseEntity<ApiResponse<User>> getUserProfile(@PathVariable String id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody Map<String, Object> updates) {
        try {
            User currentUser = authService.getCurrentUser();
            User updated = userService.updateProfile(currentUser.getId(), updates);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestBody Map<String, String> passwords) {
        try {
            User currentUser = authService.getCurrentUser();
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");
            
            userService.changePassword(currentUser.getId(), oldPassword, newPassword);
            return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/me/stats")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        try {
            User currentUser = authService.getCurrentUser();
            Map<String, Object> stats = userService.getUserStats(currentUser.getId());
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search users")
    public ResponseEntity<ApiResponse<java.util.List<User>>> searchUsers(
            @RequestParam String query) {
        try {
            java.util.List<User> users = userService.searchUsers(query);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
