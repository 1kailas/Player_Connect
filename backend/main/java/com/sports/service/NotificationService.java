package com.sports.service;


import com.sports.model.entity.Event;
import com.sports.model.entity.Notification;
import com.sports.model.entity.User;
import com.sports.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification Service
 */
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public Notification createNotification(User user, String title, String message, String type) {
        Notification notification = Notification.builder()
                .userId(user.getId())
                .title(title)
                .message(message)
                .notificationType(type)
                .isRead(false)
                .build();
        
        return notificationRepository.save(notification);
    }
    
    public void notifyEventCreated(Event event) {
        // Implementation for broadcasting event creation
        // Can be enhanced with WebSocket for real-time notifications
    }
    
    public void notifyEventUpdated(Event event) {
        // Notify participants about event update
        // Note: Would need UserRepository to fetch User objects from participantIds
        // Simplified for now
    }
    
    public void notifyRegistrationOpened(Event event) {
        // Notify interested users about registration opening
    }
    
    public void notifyEventStarted(Event event) {
        // Notify participants about event start
        // Note: Would need UserRepository to fetch User objects from participantIds
        // Simplified for now
    }
    
    public void notifyUserRegistered(Event event, User user) {
        createNotification(
            user,
            "Registration Successful",
            "You have successfully registered for '" + event.getName() + "'",
            "REGISTRATION_SUCCESS"
        );
    }
    
    public Page<Notification> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable);
    }
    
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false);
    }
    
    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    @Transactional
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsRead(userId, false);
        notifications.forEach(n -> {
            n.setIsRead(true);
            n.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(notifications);
    }
    
    @Transactional
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
    
    // ==================== Admin Notifications ====================
    
    public void notifyRoleChange(User user, List<?> roles) {
        createNotification(
            user,
            "Role Update",
            "Your user roles have been updated by an administrator",
            "ROLE_UPDATE"
        );
    }
    
    public void notifyUserBanned(User user) {
        createNotification(
            user,
            "Account Suspended",
            "Your account has been suspended by an administrator. Please contact support for assistance.",
            "ACCOUNT_BANNED"
        );
    }
    
    public void notifyUserUnbanned(User user) {
        createNotification(
            user,
            "Account Restored",
            "Your account has been restored. You can now access all features.",
            "ACCOUNT_RESTORED"
        );
    }
    
    public void notifyUserDeleted(User user) {
        createNotification(
            user,
            "Account Deleted",
            "Your account has been marked for deletion. Contact support if this was in error.",
            "ACCOUNT_DELETED"
        );
    }
    
    // ============= NEW: Certificate Notifications =============
    
    public void notifyCertificateUploaded(User user, com.sports.model.entity.Certificate certificate) {
        createNotification(
            user,
            "Certificate Uploaded",
            "Your certificate '" + certificate.getTitle() + "' has been uploaded successfully and is pending verification.",
            "CERTIFICATE_UPLOADED"
        );
    }
    
    public void notifyCertificateVerified(User user, com.sports.model.entity.Certificate certificate) {
        createNotification(
            user,
            "Certificate Verified",
            "Your certificate '" + certificate.getTitle() + "' has been verified by an administrator.",
            "CERTIFICATE_VERIFIED"
        );
    }
    
    public void notifyCertificateRejected(User user, com.sports.model.entity.Certificate certificate, String reason) {
        createNotification(
            user,
            "Certificate Rejected",
            "Your certificate '" + certificate.getTitle() + "' was not verified. Reason: " + reason,
            "CERTIFICATE_REJECTED"
        );
    }
    
    // ============= NEW: Team Notifications =============
    
    public void notifyTeamCreated(com.sports.model.entity.Team team) {
        // Would notify all team members - simplified for now
        System.out.println("Team created: " + team.getName());
    }
    
    public void notifyTeamVerified(com.sports.model.entity.Team team) {
        // Would notify all team members - simplified for now
        System.out.println("Team verified: " + team.getName());
    }
    
    public void notifyAddedToTeam(User user, com.sports.model.entity.Team team) {
        createNotification(
            user,
            "Added to Team",
            "You have been added to the team: " + team.getName(),
            "TEAM_INVITATION"
        );
    }
}
