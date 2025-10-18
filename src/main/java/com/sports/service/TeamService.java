package com.sports.service;

import com.sports.model.entity.Team;
import com.sports.model.entity.User;
import com.sports.model.enums.SportType;
import com.sports.repository.TeamRepository;
import com.sports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Team Service - Enhanced with member management and file uploads
 */
@Service
@RequiredArgsConstructor
public class TeamService {
    
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    
    @Transactional
    public Team createTeam(Team team) {
        // Generate unique team code
        String teamCode = generateTeamCode(team.getName());
        team.setTeamCode(teamCode);
        team.setRegistrationDate(java.time.LocalDate.now());
        team.setVerifiedTeam(false);
        
        Team saved = teamRepository.save(team);
        
        // Add team to members' team lists
        if (team.getMemberIds() != null) {
            for (String memberId : team.getMemberIds()) {
                User user = userRepository.findById(memberId).orElse(null);
                if (user != null) {
                    user.getTeamIds().add(saved.getId());
                    userRepository.save(user);
                }
            }
        }
        
        return saved;
    }
    
    @Transactional
    public Team updateTeam(String teamId, Team updatedTeam) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        team.setName(updatedTeam.getName());
        team.setDescription(updatedTeam.getDescription());
        team.setLogoUrl(updatedTeam.getLogoUrl());
        team.setBannerUrl(updatedTeam.getBannerUrl());
        team.setCaptainId(updatedTeam.getCaptainId());
        team.setCoachId(updatedTeam.getCoachId());
        team.setHomeVenueId(updatedTeam.getHomeVenueId());
        
        return teamRepository.save(team);
    }
    
    public Team getTeamById(String teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }
    
    public Team getTeamByCode(String teamCode) {
        return teamRepository.findByTeamCode(teamCode)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }
    
    public Page<Team> getAllTeams(SportType sportType, Boolean verified, Pageable pageable) {
        if (sportType != null) {
            return teamRepository.findBySportType(sportType, pageable);
        }
        return teamRepository.findAll(pageable);
    }
    
    public Page<Team> getAllTeams(Pageable pageable) {
        return teamRepository.findAll(pageable);
    }
    
    public Page<Team> getTeamsBySportType(SportType sportType, Pageable pageable) {
        return teamRepository.findBySportType(sportType, pageable);
    }
    
    public List<Team> getTopRankedTeams(SportType sportType, int limit) {
        return teamRepository.findTopRankedTeams(sportType, Pageable.ofSize(limit));
    }
    
    public Page<Team> searchTeams(SportType sportType, String search, Pageable pageable) {
        return teamRepository.searchTeams(sportType, search, pageable);
    }
    
    @Transactional
    public void deleteTeam(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Remove team from all members
        if (team.getMemberIds() != null) {
            for (String memberId : team.getMemberIds()) {
                User user = userRepository.findById(memberId).orElse(null);
                if (user != null) {
                    user.getTeamIds().remove(teamId);
                    userRepository.save(user);
                }
            }
        }
        
        team.setIsActive(false);
        teamRepository.save(team);
    }
    
    // ============= NEW: Team Member Management =============
    
    @Transactional
    public Team addTeamMember(String teamId, String userId) {
        Team team = getTeamById(teamId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (team.getMemberIds().contains(userId)) {
            throw new RuntimeException("User is already a member");
        }
        
        team.getMemberIds().add(userId);
        Team updated = teamRepository.save(team);
        
        // Update user's team list
        user.getTeamIds().add(teamId);
        userRepository.save(user);
        
        // Notify user
        notificationService.notifyAddedToTeam(user, team);
        
        return updated;
    }
    
    @Transactional
    public Team removeTeamMember(String teamId, String userId) {
        Team team = getTeamById(teamId);
        User user = userRepository.findById(userId).orElse(null);
        
        if (team.getCaptainId() != null && team.getCaptainId().equals(userId)) {
            throw new RuntimeException("Cannot remove captain. Transfer captaincy first.");
        }
        
        team.getMemberIds().remove(userId);
        Team updated = teamRepository.save(team);
        
        // Update user's team list
        if (user != null) {
            user.getTeamIds().remove(teamId);
            userRepository.save(user);
        }
        
        return updated;
    }
    
    @Transactional
    public Team verifyTeam(String teamId) {
        Team team = getTeamById(teamId);
        team.setVerifiedTeam(true);
        return teamRepository.save(team);
    }
    
    @Transactional
    public Team uploadTeamLogo(String teamId, MultipartFile file) {
        Team team = getTeamById(teamId);
        
        // Delete old logo
        if (team.getLogoUrl() != null) {
            fileStorageService.deleteFile(team.getLogoUrl());
        }
        
        String logoUrl = fileStorageService.uploadFile(file, "team-logos");
        team.setLogoUrl(logoUrl);
        
        return teamRepository.save(team);
    }
    
    @Transactional
    public Team uploadTeamBanner(String teamId, MultipartFile file) {
        Team team = getTeamById(teamId);
        
        // Delete old banner
        if (team.getBannerUrl() != null) {
            fileStorageService.deleteFile(team.getBannerUrl());
        }
        
        String bannerUrl = fileStorageService.uploadFile(file, "team-banners");
        team.setBannerUrl(bannerUrl);
        
        return teamRepository.save(team);
    }
    
    public List<Team> getUserTeams(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return teamRepository.findAllById(user.getTeamIds());
    }
    
    public Map<String, Object> getTeamStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = teamRepository.count();
        long verified = teamRepository.findByVerifiedTeamTrue().size();
        
        stats.put("totalTeams", total);
        stats.put("verifiedTeams", verified);
        stats.put("pendingVerification", total - verified);
        
        // Count by sport type
        for (SportType sport : SportType.values()) {
            long count = teamRepository.findBySportType(sport).size();
            stats.put(sport.name().toLowerCase() + "Teams", count);
        }
        
        return stats;
    }
    
    private String generateTeamCode(String teamName) {
        String code = teamName.replaceAll("[^A-Za-z0-9]", "")
                .toUpperCase()
                .substring(0, Math.min(6, teamName.length()));
        return code + System.currentTimeMillis() % 1000;
    }
}
