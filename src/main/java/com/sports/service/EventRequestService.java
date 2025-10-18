package com.sports.service;

import com.sports.model.entity.Event;
import com.sports.model.entity.EventRequest;
import com.sports.model.entity.User;
import com.sports.model.enums.EventRequestStatus;
import com.sports.model.enums.EventStatus;
import com.sports.repository.EventRepository;
import com.sports.repository.EventRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


/**
 * Event Request Service
 */
@Service
@RequiredArgsConstructor
public class EventRequestService {
    
    private final EventRequestRepository eventRequestRepository;
    private final EventRepository eventRepository;
    
    @Transactional
    public EventRequest createRequest(EventRequest request) {
        request.setStatus(EventRequestStatus.PENDING);
        return eventRequestRepository.save(request);
    }
    
    @Transactional
    public EventRequest approveRequest(String requestId, User admin, String comments) {
        EventRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Event request not found"));
        
        if (request.getStatus() != EventRequestStatus.PENDING) {
            throw new RuntimeException("Request is not in pending status");
        }
        
        // Create the actual event
        Event event = Event.builder()
                .name(request.getEventName())
                .description(request.getDescription())
                .sportType(request.getSportType())
                .startDate(request.getProposedStartDate())
                .endDate(request.getProposedEndDate())
                .organizerId(request.getRequesterId())
                .status(EventStatus.UPCOMING)
                .build();
        
        Event createdEvent = eventRepository.save(event);
        
        // Update request status
        request.setStatus(EventRequestStatus.APPROVED);
        request.setReviewedBy(admin.getId());
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewComments(comments);
        request.setCreatedEventId(createdEvent.getId());
        
        return eventRequestRepository.save(request);
    }
    
    @Transactional
    public EventRequest rejectRequest(String requestId, User admin, String comments) {
        EventRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Event request not found"));
        
        if (request.getStatus() != EventRequestStatus.PENDING) {
            throw new RuntimeException("Request is not in pending status");
        }
        
        request.setStatus(EventRequestStatus.REJECTED);
        request.setReviewedBy(admin.getId());
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewComments(comments);
        
        return eventRequestRepository.save(request);
    }
    
    @Transactional
    public EventRequest cancelRequest(String requestId, String userId) {
        EventRequest request = eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Event request not found"));
        
        if (!request.getRequesterId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own requests");
        }
        
        if (request.getStatus() != EventRequestStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }
        
        request.setStatus(EventRequestStatus.CANCELLED);
        
        return eventRequestRepository.save(request);
    }
    
    public EventRequest getRequestById(String requestId) {
        return eventRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Event request not found"));
    }
    
    public Page<EventRequest> getAllRequests(Pageable pageable) {
        return eventRequestRepository.findAll(pageable);
    }
    
    public Page<EventRequest> getPendingRequests(Pageable pageable) {
        return eventRequestRepository.findByStatus(EventRequestStatus.PENDING, pageable);
    }
    
    public Page<EventRequest> getRequestsByStatus(EventRequestStatus status, Pageable pageable) {
        return eventRequestRepository.findByStatus(status, pageable);
    }
    
    public Page<EventRequest> getUserRequests(String userId, Pageable pageable) {
        return eventRequestRepository.findByRequesterId(userId, pageable);
    }
    
    public Map<String, Object> getRequestStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", eventRequestRepository.count());
        stats.put("pendingRequests", eventRequestRepository.countByStatus(EventRequestStatus.PENDING));
        stats.put("approvedRequests", eventRequestRepository.countByStatus(EventRequestStatus.APPROVED));
        stats.put("rejectedRequests", eventRequestRepository.countByStatus(EventRequestStatus.REJECTED));
        stats.put("cancelledRequests", eventRequestRepository.countByStatus(EventRequestStatus.CANCELLED));
        return stats;
    }
}
