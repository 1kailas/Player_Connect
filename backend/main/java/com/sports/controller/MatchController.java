package com.sports.controller;


import com.sports.dto.ApiResponse;
import com.sports.model.entity.Match;
import com.sports.service.MatchService;
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
 * Match Controller
 */
@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@Tag(name = "Matches", description = "Match management endpoints")
public class MatchController {
    
    private final MatchService matchService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    @Operation(summary = "Create a new match")
    public ResponseEntity<ApiResponse<Match>> createMatch(@RequestBody Match match) {
        try {
            Match created = matchService.createMatch(match);
            return ResponseEntity.ok(ApiResponse.success("Match created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/score")
    @PreAuthorize("hasAnyRole('REFEREE', 'ORGANIZER', 'ADMIN')")
    @Operation(summary = "Update match score")
    public ResponseEntity<ApiResponse<Match>> updateMatchScore(
            @PathVariable String id,
            @RequestParam Integer team1Score,
            @RequestParam Integer team2Score) {
        try {
            Match updated = matchService.updateMatchScore(id, team1Score, team2Score);
            return ResponseEntity.ok(ApiResponse.success("Score updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('REFEREE', 'ORGANIZER', 'ADMIN')")
    @Operation(summary = "Start a match")
    public ResponseEntity<ApiResponse<Match>> startMatch(@PathVariable String id) {
        try {
            Match started = matchService.startMatch(id);
            return ResponseEntity.ok(ApiResponse.success("Match started", started));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('REFEREE', 'ORGANIZER', 'ADMIN')")
    @Operation(summary = "Complete a match")
    public ResponseEntity<ApiResponse<Match>> completeMatch(@PathVariable String id) {
        try {
            Match completed = matchService.completeMatch(id);
            return ResponseEntity.ok(ApiResponse.success("Match completed", completed));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get match by ID")
    public ResponseEntity<ApiResponse<Match>> getMatchById(@PathVariable String id) {
        try {
            Match match = matchService.getMatchById(id);
            return ResponseEntity.ok(ApiResponse.success(match));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get matches by event")
    public ResponseEntity<ApiResponse<Page<Match>>> getMatchesByEvent(
            @PathVariable String eventId,
            Pageable pageable) {
        Page<Match> matches = matchService.getMatchesByEvent(eventId, pageable);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
    
    @GetMapping("/live")
    @Operation(summary = "Get live matches")
    public ResponseEntity<ApiResponse<List<Match>>> getLiveMatches() {
        List<Match> matches = matchService.getLiveMatches();
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming matches")
    public ResponseEntity<ApiResponse<List<Match>>> getUpcomingMatches() {
        List<Match> matches = matchService.getUpcomingMatches();
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
    
    @GetMapping("/team/{teamId}")
    @Operation(summary = "Get matches by team")
    public ResponseEntity<ApiResponse<List<Match>>> getMatchesByTeam(@PathVariable String teamId) {
        List<Match> matches = matchService.getMatchesByTeam(teamId);
        return ResponseEntity.ok(ApiResponse.success(matches));
    }
}
