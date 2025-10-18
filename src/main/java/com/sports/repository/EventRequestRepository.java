package com.sports.repository;

import com.sports.model.entity.EventRequest;
import com.sports.model.enums.EventRequestStatus;
import com.sports.model.enums.SportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRequestRepository extends MongoRepository<EventRequest, String> {
    
    List<EventRequest> findByRequesterId(String requesterId);
    
    Page<EventRequest> findByRequesterId(String requesterId, Pageable pageable);
    
    List<EventRequest> findByStatus(EventRequestStatus status);
    
    Page<EventRequest> findByStatus(EventRequestStatus status, Pageable pageable);
    
    List<EventRequest> findBySportType(SportType sportType);
    
    Page<EventRequest> findByStatusAndSportType(EventRequestStatus status, SportType sportType, Pageable pageable);
    
    long countByRequesterId(String requesterId);
    
    long countByStatus(EventRequestStatus status);
}
