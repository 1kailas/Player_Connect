package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.Team;
import com.sports.model.enums.SportType;
import com.sports.service.AuthService;
import com.sports.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Team Controller - For team management
 */
@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Tag(name = "Teams", description = "Team management endpoints")
public class TeamController {
    
    private final TeamService teamService;
    private final AuthService authService;
    
    // ==================== Public Operations ====================
    
    @GetMapping
    @Operation(summary = "Get all teams")
    public ResponseEntity<ApiResponse<Page<Team>>> getAllTeams(
            @RequestParam(required = false) SportType sportType,
            @RequestParam(required = false) Boolean verified,
            Pageable pageable) {
        try {
            Page<Team> teams = teamService.getAllTeams(sportType, verified, pageable);
            return ResponseEntity.ok(ApiResponse.success(teams));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get team by ID")
    public ResponseEntity<ApiResponse<Team>> getTeamById(@PathVariable String id) {
        try {
            Team team = teamService.getTeamById(id);
            return ResponseEntity.ok(ApiResponse.success(team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/code/{code}")
    @Operation(summary = "Get team by code")
    public ResponseEntity<ApiResponse<Team>> getTeamByCode(@PathVariable String code) {
        try {
            Team team = teamService.getTeamByCode(code);
            return ResponseEntity.ok(ApiResponse.success(team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search teams")
    public ResponseEntity<ApiResponse<Page<Team>>> searchTeams(
            @RequestParam(required = false) SportType sportType,
            @RequestParam String query,
            Pageable pageable) {
        try {
            Page<Team> teams = teamService.searchTeams(sportType, query, pageable);
            return ResponseEntity.ok(ApiResponse.success(teams));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/top-ranked")
    @Operation(summary = "Get top ranked teams")
    public ResponseEntity<ApiResponse<List<Team>>> getTopRankedTeams(
            @RequestParam SportType sportType,
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Team> teams = teamService.getTopRankedTeams(sportType, limit);
            return ResponseEntity.ok(ApiResponse.success(teams));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== User Operations ====================
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new team")
    public ResponseEntity<ApiResponse<Team>> createTeam(@RequestBody Team team) {
        try {
            Team created = teamService.createTeam(team);
            return ResponseEntity.ok(ApiResponse.success("Team created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update team")
    public ResponseEntity<ApiResponse<Team>> updateTeam(
            @PathVariable String id,
            @RequestBody Team team) {
        try {
            // Check if user is captain or admin
            Team existing = teamService.getTeamById(id);
            String userId = authService.getCurrentUser().getId();
            
            if (!existing.getCaptainId().equals(userId) && 
                !authService.getCurrentUser().getRoles().contains(com.sports.model.enums.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Only team captain or admin can update team"));
            }
            
            Team updated = teamService.updateTeam(id, team);
            return ResponseEntity.ok(ApiResponse.success("Team updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/logo")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload team logo")
    public ResponseEntity<ApiResponse<Team>> uploadLogo(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Team team = teamService.uploadTeamLogo(id, file);
            return ResponseEntity.ok(ApiResponse.success("Logo uploaded successfully", team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/banner")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload team banner")
    public ResponseEntity<ApiResponse<Team>> uploadBanner(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            Team team = teamService.uploadTeamBanner(id, file);
            return ResponseEntity.ok(ApiResponse.success("Banner uploaded successfully", team));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/my-teams")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's teams")
    public ResponseEntity<ApiResponse<List<Team>>> getMyTeams() {
        try {
            String userId = authService.getCurrentUser().getId();
            List<Team> teams = teamService.getUserTeams(userId);
            return ResponseEntity.ok(ApiResponse.success(teams));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{teamId}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add member to team")
    public ResponseEntity<ApiResponse<Team>> addMember(
            @PathVariable String teamId,
            @PathVariable String userId) {
        try {
            // Check if user is captain or admin
            Team team = teamService.getTeamById(teamId);
            String currentUserId = authService.getCurrentUser().getId();
            
            if (!team.getCaptainId().equals(currentUserId) && 
                !authService.getCurrentUser().getRoles().contains(com.sports.model.enums.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Only team captain or admin can add members"));
            }
            
            Team updated = teamService.addTeamMember(teamId, userId);
            return ResponseEntity.ok(ApiResponse.success("Member added successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{teamId}/members/{userId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Remove member from team")
    public ResponseEntity<ApiResponse<Team>> removeMember(
            @PathVariable String teamId,
            @PathVariable String userId) {
        try {
            // Check if user is captain or admin
            Team team = teamService.getTeamById(teamId);
            String currentUserId = authService.getCurrentUser().getId();
            
            if (!team.getCaptainId().equals(currentUserId) && 
                !authService.getCurrentUser().getRoles().contains(com.sports.model.enums.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Only team captain or admin can remove members"));
            }
            
            Team updated = teamService.removeTeamMember(teamId, userId);
            return ResponseEntity.ok(ApiResponse.success("Member removed successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== Admin Operations ====================
    
    @PutMapping("/admin/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify team (Admin)")
    public ResponseEntity<ApiResponse<Team>> verifyTeam(@PathVariable String id) {
        try {
            Team verified = teamService.verifyTeam(id);
            return ResponseEntity.ok(ApiResponse.success("Team verified successfully", verified));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete team (Admin)")
    public ResponseEntity<ApiResponse<String>> deleteTeam(@PathVariable String id) {
        try {
            teamService.deleteTeam(id);
            return ResponseEntity.ok(ApiResponse.success("Team deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get team statistics (Admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTeamStats() {
        try {
            Map<String, Object> stats = teamService.getTeamStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
