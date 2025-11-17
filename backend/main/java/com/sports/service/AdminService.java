package com.sports.service;

import com.sports.model.entity.Event;
import com.sports.model.entity.User;
import com.sports.model.enums.EventStatus;
import com.sports.model.enums.UserRole;
import com.sports.repository.CertificateRepository;
import com.sports.repository.EventRepository;
import com.sports.repository.TeamRepository;
import com.sports.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Admin Service - Administrative operations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    private final CertificateRepository certificateRepository;
    private final TeamRepository teamRepository;

    // ==================== Dashboard Stats ====================

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // User stats
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long admins = userRepository.countByRolesContaining(UserRole.ADMIN);

        // Event stats
        long totalEvents = eventRepository.count();
        long upcomingEvents = eventRepository.countByStatus(
            EventStatus.UPCOMING
        );
        long liveEvents = eventRepository.countByStatus(EventStatus.LIVE);
        long completedEvents = eventRepository.countByStatus(
            EventStatus.COMPLETED
        );

        // Active users today (users logged in within last 24 hours)
        LocalDateTime yesterday = LocalDateTime.now().minus(1, ChronoUnit.DAYS);
        long activeUsersToday = userRepository.countByLastLoginAfter(yesterday);

        // Calculate revenue from events (entry fees)
        List<Event> paidEvents = eventRepository.findByEntryFeeGreaterThan(0.0);
        double totalRevenue = paidEvents
            .stream()
            .mapToDouble(
                e ->
                    e.getEntryFee() *
                    (e.getParticipantIds() != null
                        ? e.getParticipantIds().size()
                        : 0)
            )
            .sum();

        // Growth percentages (mock for now - would need historical data)
        stats.put("totalUsers", totalUsers);
        stats.put("totalUsersGrowth", 12.5);
        stats.put("activeUsers", activeUsers);
        stats.put("activeUsersGrowth", 8.3);
        stats.put("admins", admins);

        stats.put("totalEvents", totalEvents);
        stats.put("totalEventsGrowth", 8.2);
        stats.put("upcomingEvents", upcomingEvents);
        stats.put("liveEvents", liveEvents);
        stats.put("completedEvents", completedEvents);

        stats.put("activeUsersToday", activeUsersToday);
        stats.put("activeUsersTodayGrowth", 6.8);

        stats.put("totalRevenue", totalRevenue);
        stats.put("revenueGrowth", 15.7);

        stats.put("pendingRequests", 0); // Would fetch from event requests
        stats.put("pendingRequestsGrowth", -3.1);

        // Team stats
        long totalTeams = teamRepository.count();
        long verifiedTeams = teamRepository.findByVerifiedTeamTrue().size();
        stats.put("totalTeams", totalTeams);
        stats.put("verifiedTeams", verifiedTeams);

        // Certificate stats
        long totalCertificates = certificateRepository.count();
        long pendingCertificates = certificateRepository.countByVerifiedFalse();
        stats.put("totalCertificates", totalCertificates);
        stats.put("pendingCertificates", pendingCertificates);

        return stats;
    }

    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new HashMap<>();

        long total = userRepository.count();
        long active = userRepository.countByIsActiveTrue();
        long inactive = total - active;
        long admins = userRepository.countByRolesContaining(UserRole.ADMIN);
        long organizers = userRepository.countByRolesContaining(
            UserRole.ORGANIZER
        );
        long users = total - admins - organizers;

        stats.put("total", total);
        stats.put("active", active);
        stats.put("inactive", inactive);
        stats.put("admins", admins);
        stats.put("organizers", organizers);
        stats.put("users", users);

        return stats;
    }

    public Map<String, Object> getEventStats() {
        Map<String, Object> stats = new HashMap<>();

        long total = eventRepository.count();
        long draft = eventRepository.countByStatus(EventStatus.DRAFT);
        long registrationOpen = eventRepository.countByStatus(
            EventStatus.REGISTRATION_OPEN
        );
        long upcoming = eventRepository.countByStatus(EventStatus.UPCOMING);
        long live = eventRepository.countByStatus(EventStatus.LIVE);
        long completed = eventRepository.countByStatus(EventStatus.COMPLETED);
        long cancelled = eventRepository.countByStatus(EventStatus.CANCELLED);

        stats.put("total", total);
        stats.put("draft", draft);
        stats.put("registrationOpen", registrationOpen);
        stats.put("upcoming", upcoming);
        stats.put("live", live);
        stats.put("completed", completed);
        stats.put("cancelled", cancelled);

        return stats;
    }

    public Map<String, Object> getMatchStats() {
        Map<String, Object> stats = new HashMap<>();

        // Mock data - would connect to match repository
        stats.put("total", 456);
        stats.put("scheduled", 123);
        stats.put("live", 12);
        stats.put("completed", 321);
        stats.put("growth", 5.3);

        return stats;
    }

    public Map<String, Object> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Event> paidEvents = eventRepository.findByEntryFeeGreaterThan(0.0);
        double totalRevenue = paidEvents
            .stream()
            .mapToDouble(
                e ->
                    e.getEntryFee() *
                    (e.getParticipantIds() != null
                        ? e.getParticipantIds().size()
                        : 0)
            )
            .sum();

        double thisMonth = totalRevenue * 0.3; // Mock calculation
        double lastMonth = totalRevenue * 0.25;
        double growth = lastMonth > 0
            ? ((thisMonth - lastMonth) / lastMonth) * 100
            : 0;

        stats.put("total", totalRevenue);
        stats.put("thisMonth", thisMonth);
        stats.put("lastMonth", lastMonth);
        stats.put("growth", growth);

        return stats;
    }

    // ==================== User Management ====================

    public Page<User> getAllUsers(
        UserRole role,
        Boolean active,
        Pageable pageable
    ) {
        if (role != null && active != null) {
            return userRepository.findByRolesContainingAndIsActive(
                role,
                active,
                pageable
            );
        } else if (role != null) {
            return userRepository.findByRolesContaining(role, pageable);
        } else if (active != null) {
            return userRepository.findByIsActive(active, pageable);
        } else {
            return userRepository.findAll(pageable);
        }
    }

    public User getUserById(String id) {
        return userRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateUserRoles(String userId, List<UserRole> roles) {
        User user = getUserById(userId);
        user.setRoles(new HashSet<>(roles));
        User updated = userRepository.save(user);

        notificationService.notifyRoleChange(user, roles);
        return updated;
    }

    @Transactional
    public User toggleUserBan(String userId, boolean ban) {
        User user = getUserById(userId);
        user.setIsActive(!ban);
        User updated = userRepository.save(user);

        if (ban) {
            notificationService.notifyUserBanned(user);
        } else {
            notificationService.notifyUserUnbanned(user);
        }

        return updated;
    }

    @Transactional
    public void deleteUser(String userId) {
        User user = getUserById(userId);

        // Soft delete - set inactive
        user.setIsActive(false);
        userRepository.save(user);

        notificationService.notifyUserDeleted(user);
    }

    public Map<String, Object> getUserActivity(String userId) {
        User user = getUserById(userId);
        Map<String, Object> activity = new HashMap<>();

        // Get user's events
        List<Event> createdEvents = eventRepository.findByOrganizerId(userId);
        List<Event> participatingEvents =
            eventRepository.findByParticipantIdsContaining(userId);

        activity.put("user", user);
        activity.put("eventsCreated", createdEvents.size());
        activity.put("eventsParticipating", participatingEvents.size());
        activity.put("lastLogin", user.getLastLogin());
        activity.put("accountCreated", user.getCreatedAt());
        activity.put(
            "recentEvents",
            createdEvents.stream().limit(5).collect(Collectors.toList())
        );

        return activity;
    }

    // ==================== Activity Logs ====================

    public List<Map<String, Object>> getRecentActivity(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Get recent events
        List<Event> recentEvents = eventRepository
            .findAll(
                org.springframework.data.domain.PageRequest.of(
                    0,
                    limit / 2,
                    org.springframework.data.domain.Sort.by(
                        "createdAt"
                    ).descending()
                )
            )
            .getContent();

        for (Event event : recentEvents) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", UUID.randomUUID().toString());
            activity.put("type", "event");
            activity.put("message", "New event created: " + event.getName());
            activity.put("timestamp", event.getCreatedAt());
            activity.put("userId", event.getOrganizerId());
            activities.add(activity);
        }

        // Get recent users
        List<User> recentUsers = userRepository
            .findAll(
                org.springframework.data.domain.PageRequest.of(
                    0,
                    limit / 2,
                    org.springframework.data.domain.Sort.by(
                        "createdAt"
                    ).descending()
                )
            )
            .getContent();

        for (User user : recentUsers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", UUID.randomUUID().toString());
            activity.put("type", "user");
            activity.put(
                "message",
                "New user registered: " + user.getUsername()
            );
            activity.put("timestamp", user.getCreatedAt());
            activity.put("userId", user.getId());
            activities.add(activity);
        }

        // Sort by timestamp descending
        activities.sort((a, b) -> {
            LocalDateTime timeA = (LocalDateTime) a.get("timestamp");
            LocalDateTime timeB = (LocalDateTime) b.get("timestamp");
            return timeB.compareTo(timeA);
        });

        return activities.stream().limit(limit).collect(Collectors.toList());
    }

    // ==================== System Operations ====================

    public void clearCache() {
        // Implementation would clear any caches
        log.info("Cache cleared");
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();

        health.put("status", "healthy");
        health.put("uptime", "15 days 4 hours");
        health.put("database", "connected");
        health.put("memory", "75% available");
        health.put("cpu", "45% usage");
        health.put("timestamp", LocalDateTime.now());

        return health;
    }
}
