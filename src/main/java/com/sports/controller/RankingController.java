package com.sports.controller;


import com.sports.dto.ApiResponse;
import com.sports.model.entity.Ranking;
import com.sports.model.enums.SportType;
import com.sports.service.RankingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Ranking Controller
 */
@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
@Tag(name = "Rankings", description = "Ranking endpoints")
public class RankingController {
    
    private final RankingService rankingService;
    
    @GetMapping("/{sportType}/{rankingType}")
    @Operation(summary = "Get latest rankings")
    public ResponseEntity<ApiResponse<List<Ranking>>> getLatestRankings(
            @PathVariable SportType sportType,
            @PathVariable String rankingType) {
        List<Ranking> rankings = rankingService.getLatestRankings(sportType, rankingType);
        return ResponseEntity.ok(ApiResponse.success(rankings));
    }
    
    @GetMapping("/player/{playerProfileId}/history")
    @Operation(summary = "Get player ranking history")
    public ResponseEntity<ApiResponse<List<Ranking>>> getPlayerRankingHistory(
            @PathVariable String playerProfileId) {
        List<Ranking> history = rankingService.getPlayerRankingHistory(playerProfileId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
    
    @GetMapping("/team/{teamId}/history")
    @Operation(summary = "Get team ranking history")
    public ResponseEntity<ApiResponse<List<Ranking>>> getTeamRankingHistory(
            @PathVariable String teamId) {
        List<Ranking> history = rankingService.getTeamRankingHistory(teamId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
    
    @PostMapping("/calculate/players/{sportType}")
    @Operation(summary = "Calculate player rankings")
    public ResponseEntity<ApiResponse<String>> calculatePlayerRankings(@PathVariable SportType sportType) {
        rankingService.calculatePlayerRankings(sportType);
        return ResponseEntity.ok(ApiResponse.success("Rankings calculated successfully", null));
    }
    
    @PostMapping("/calculate/teams/{sportType}")
    @Operation(summary = "Calculate team rankings")
    public ResponseEntity<ApiResponse<String>> calculateTeamRankings(@PathVariable SportType sportType) {
        rankingService.calculateTeamRankings(sportType);
        return ResponseEntity.ok(ApiResponse.success("Rankings calculated successfully", null));
    }
}
