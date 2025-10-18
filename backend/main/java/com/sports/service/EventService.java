package com.sports.service;


import com.sports.model.entity.Event;
import com.sports.model.entity.User;
import com.sports.model.enums.EventStatus;
import com.sports.model.enums.SportType;
import com.sports.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Event Service
 */
@Service
@RequiredArgsConstructor
public class EventService {
    
    private final EventRepository eventRepository;
    private final NotificationService notificationService;
    
    @Transactional
    public Event createEvent(Event event, User organizer) {
        event.setOrganizerId(organizer.getId());
        // Only set DRAFT if status is not already set
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.DRAFT);
        }
        Event savedEvent = eventRepository.save(event);
        
        // Send notification
        notificationService.notifyEventCreated(savedEvent);
        
        return savedEvent;
    }
    
    @Transactional
    public Event updateEvent(String eventId, Event updatedEvent) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Update fields
        event.setName(updatedEvent.getName());
        event.setDescription(updatedEvent.getDescription());
        event.setStartDate(updatedEvent.getStartDate());
        event.setEndDate(updatedEvent.getEndDate());
        event.setVenueId(updatedEvent.getVenueId());
        event.setMaxParticipants(updatedEvent.getMaxParticipants());
        event.setEntryFee(updatedEvent.getEntryFee());
        event.setPrizePool(updatedEvent.getPrizePool());
        event.setRules(updatedEvent.getRules());
        
        Event saved = eventRepository.save(event);
        notificationService.notifyEventUpdated(saved);
        
        return saved;
    }
    
    @Transactional
    public Event updateEventStatus(String eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setStatus(status);
        Event saved = eventRepository.save(event);
        
        if (status == EventStatus.REGISTRATION_OPEN) {
            notificationService.notifyRegistrationOpened(saved);
        } else if (status == EventStatus.LIVE) {
            notificationService.notifyEventStarted(saved);
        }
        
        return saved;
    }
    
    @Transactional
    public void registerForEvent(String eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (event.getStatus() != EventStatus.REGISTRATION_OPEN) {
            throw new RuntimeException("Registration is not open");
        }
        
        if (event.getParticipantIds().size() >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }
        
        event.getParticipantIds().add(user.getId());
        eventRepository.save(event);
        
        notificationService.notifyUserRegistered(event, user);
    }
    
    public Event getEventById(String eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
    
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }
    
    public Page<Event> getEventsBySportType(SportType sportType, Pageable pageable) {
        return eventRepository.findBySportType(sportType, pageable);
    }
    
    public Page<Event> filterEvents(SportType sportType, EventStatus status, Pageable pageable) {
        if (sportType != null && status != null) {
            return eventRepository.findBySportTypeAndStatus(sportType, status, pageable);
        } else if (sportType != null) {
            return eventRepository.findBySportType(sportType, pageable);
        } else if (status != null) {
            return eventRepository.findByStatus(status, pageable);
        } else {
            return eventRepository.findAll(pageable);
        }
    }
    
    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(
                EventStatus.UPCOMING, 
                LocalDateTime.now(), 
                Pageable.ofSize(10)
        );
    }
    
    public List<Event> getLiveEvents() {
        return eventRepository.findLiveEvents();
    }
    
    public Page<Event> searchEvents(String search, Pageable pageable) {
        return eventRepository.searchEvents(search, pageable);
    }
    
    @Transactional
    public void deleteEvent(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setIsActive(false);
        eventRepository.save(event);
    }
    
    // Location-based methods
    public List<Event> getEventsWithLocation() {
        return eventRepository.findEventsWithLocation();
    }
    
    public List<Event> getNearbyEvents(Double latitude, Double longitude, Double radiusKm) {
        // Get all events with location
        List<Event> allEvents = eventRepository.findEventsWithLocation();
        
        // Filter by distance using Haversine formula
        return allEvents.stream()
                .filter(event -> {
                    if (event.getLatitude() == null || event.getLongitude() == null) {
                        return false;
                    }
                    double distance = calculateDistance(
                            latitude, longitude,
                            event.getLatitude(), event.getLongitude()
                    );
                    return distance <= radiusKm;
                })
                .sorted((e1, e2) -> {
                    double d1 = calculateDistance(latitude, longitude, e1.getLatitude(), e1.getLongitude());
                    double d2 = calculateDistance(latitude, longitude, e2.getLatitude(), e2.getLongitude());
                    return Double.compare(d1, d2);
                })
                .toList();
    }
    
    public List<Event> getEventsByCity(String city) {
        return eventRepository.findByCity(city);
    }
    
    public List<Event> getEventsByCityAndStatus(String city, EventStatus status) {
        return eventRepository.findByCityAndStatus(city, status);
    }
    
    /**
     * Calculate distance between two coordinates using Haversine formula
     * @return distance in kilometers
     */
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
}
