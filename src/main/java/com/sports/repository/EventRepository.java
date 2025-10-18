package com.sports.repository;

import com.sports.model.entity.Event;
import com.sports.model.enums.EventStatus;
import com.sports.model.enums.SportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    
    List<Event> findByStatus(EventStatus status);
    
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    
    List<Event> findBySportType(SportType sportType);
    
    Page<Event> findBySportType(SportType sportType, Pageable pageable);
    
    Page<Event> findBySportTypeAndStatus(SportType sportType, EventStatus status, Pageable pageable);
    
    List<Event> findByOrganizerId(String organizerId);
    
    @Query("{ 'startDate': { $gte: ?0, $lte: ?1 } }")
    List<Event> findEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query(value = "{ 'status': ?0, 'startDate': { $gt: ?1 } }", sort = "{ 'startDate': 1 }")
    List<Event> findUpcomingEvents(EventStatus status, LocalDateTime currentDate, Pageable pageable);
    
    @Query(value = "{ 'status': 'LIVE' }", sort = "{ 'totalViews': -1 }")
    List<Event> findLiveEvents();
    
    List<Event> findByFeaturedEventTrue();
    
    @Query("{ 'sportType': ?0, 'venueId': ?1 }")
    Page<Event> findBySportTypeAndVenueId(SportType sportType, String venueId, Pageable pageable);
    
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<Event> searchEvents(String search, Pageable pageable);
    
    long countByOrganizerId(String organizerId);
    
    // Geospatial queries for location-based events
    @Query("{ 'latitude': { $ne: null }, 'longitude': { $ne: null } }")
    List<Event> findEventsWithLocation();
    
    List<Event> findByCity(String city);
    
    List<Event> findByCityAndStatus(String city, EventStatus status);
    
    // Admin stats queries
    long countByStatus(EventStatus status);
    
    List<Event> findByEntryFeeGreaterThan(Double entryFee);
    
    List<Event> findByParticipantIdsContaining(String userId);
}
