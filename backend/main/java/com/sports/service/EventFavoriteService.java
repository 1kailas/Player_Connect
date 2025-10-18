package com.sports.service;

import com.sports.model.entity.EventFavorite;
import com.sports.model.entity.User;
import com.sports.repository.EventFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Event Favorite Service
 */
@Service
@RequiredArgsConstructor
public class EventFavoriteService {
    
    private final EventFavoriteRepository eventFavoriteRepository;
    
    @Transactional
    public EventFavorite toggleFavorite(String eventId, User user) {
        // Check if already favorited
        if (eventFavoriteRepository.existsByUserIdAndEventId(user.getId(), eventId)) {
            // Unfavorite
            eventFavoriteRepository.deleteByUserIdAndEventId(user.getId(), eventId);
            return null;
        } else {
            // Add to favorites
            EventFavorite favorite = EventFavorite.builder()
                    .userId(user.getId())
                    .eventId(eventId)
                    .favoritedAt(LocalDateTime.now())
                    .notifyOnUpdates(true)
                    .notifyOnRegistration(true)
                    .isActive(true)
                    .build();
            
            return eventFavoriteRepository.save(favorite);
        }
    }
    
    public boolean isFavorited(String eventId, String userId) {
        return eventFavoriteRepository.existsByUserIdAndEventId(userId, eventId);
    }
    
    public Page<EventFavorite> getUserFavorites(String userId, Pageable pageable) {
        return eventFavoriteRepository.findByUserId(userId, pageable);
    }
    
    public List<String> getUserFavoriteEventIds(String userId) {
        return eventFavoriteRepository.findByUserId(userId).stream()
                .map(EventFavorite::getEventId)
                .toList();
    }
    
    public long getEventFavoriteCount(String eventId) {
        return eventFavoriteRepository.countByEventId(eventId);
    }
    
    @Transactional
    public EventFavorite updateNotificationPreferences(String eventId, User user, 
                                                        Boolean notifyOnUpdates, 
                                                        Boolean notifyOnRegistration) {
        EventFavorite favorite = eventFavoriteRepository.findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        
        if (notifyOnUpdates != null) {
            favorite.setNotifyOnUpdates(notifyOnUpdates);
        }
        
        if (notifyOnRegistration != null) {
            favorite.setNotifyOnRegistration(notifyOnRegistration);
        }
        
        return eventFavoriteRepository.save(favorite);
    }
}
