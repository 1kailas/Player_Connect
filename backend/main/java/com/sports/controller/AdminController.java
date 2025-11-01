package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.User;
import com.sports.model.enums.UserRole;
import com.sports.service.AdminService;
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
 * Admin Controller - For administrative operations
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrative management endpoints")
public class AdminController {
    
    private final AdminService adminService;
    // AuthService removed as it was unused
    
    // ==================== Dashboard Stats ====================
    
    @GetMapping("/stats/dashboard")
    @Operation(summary = "Get comprehensive dashboard statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/users")
    @Operation(summary = "Get user statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        try {
            Map<String, Object> stats = adminService.getUserStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/events")
    @Operation(summary = "Get event statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventStats() {
        try {
            Map<String, Object> stats = adminService.getEventStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/matches")
    @Operation(summary = "Get match statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMatchStats() {
        try {
            Map<String, Object> stats = adminService.getMatchStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats/revenue")
    @Operation(summary = "Get revenue statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRevenueStats() {
        try {
            Map<String, Object> stats = adminService.getRevenueStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== User Management ====================
    
    @GetMapping("/users")
    @Operation(summary = "Get all users (paginated)")
    public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) Boolean active,
            Pageable pageable) {
        try {
            Page<User> users = adminService.getAllUsers(role, active, pageable);
            return ResponseEntity.ok(ApiResponse.success(users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/users/{id}")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
        try {
            User user = adminService.getUserById(id);
            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/roles")
    @Operation(summary = "Update user roles")
    public ResponseEntity<ApiResponse<User>> updateUserRoles(
            @PathVariable String id,
            @RequestBody List<UserRole> roles) {
        try {
            User updated = adminService.updateUserRoles(id, roles);
            return ResponseEntity.ok(ApiResponse.success("User roles updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}/ban")
    @Operation(summary = "Ban/Unban a user")
    public ResponseEntity<ApiResponse<User>> toggleUserBan(
            @PathVariable String id,
            @RequestParam boolean ban) {
        try {
            User user = adminService.toggleUserBan(id, ban);
            String message = ban ? "User banned successfully" : "User unbanned successfully";
            return ResponseEntity.ok(ApiResponse.success(message, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user (soft delete)")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/users/{id}/activity")
    @Operation(summary = "Get user activity history")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserActivity(@PathVariable String id) {
        try {
            Map<String, Object> activity = adminService.getUserActivity(id);
            return ResponseEntity.ok(ApiResponse.success(activity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== Activity Logs ====================
    
    @GetMapping("/activity/recent")
    @Operation(summary = "Get recent platform activity")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecentActivity(
            @RequestParam(defaultValue = "20") int limit) {
        try {
            List<Map<String, Object>> activities = adminService.getRecentActivity(limit);
            return ResponseEntity.ok(ApiResponse.success(activities));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== System Operations ====================
    
    @PostMapping("/system/clear-cache")
    @Operation(summary = "Clear system cache")
    public ResponseEntity<ApiResponse<String>> clearCache() {
        try {
            adminService.clearCache();
            return ResponseEntity.ok(ApiResponse.success("Cache cleared successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/system/health")
    @Operation(summary = "Get system health status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemHealth() {
        try {
            Map<String, Object> health = adminService.getSystemHealth();
            return ResponseEntity.ok(ApiResponse.success(health));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
