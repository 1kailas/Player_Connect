package com.sports.repository;

import com.sports.model.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByUserId(String userId);
    
    Page<Notification> findByUserId(String userId, Pageable pageable);
    
    List<Notification> findByUserIdAndIsRead(String userId, Boolean isRead);
    
    Page<Notification> findByUserIdAndIsRead(String userId, Boolean isRead, Pageable pageable);
    
    long countByUserIdAndIsReadFalse(String userId);
    
    @Query("{ 'userId': ?0, 'createdAt': { $gte: ?1 } }")
    List<Notification> findRecentNotifications(String userId, LocalDateTime since);
    
    @Query("{ 'userId': ?0, 'notificationType': ?1 }")
    List<Notification> findByUserIdAndType(String userId, String notificationType);
}
