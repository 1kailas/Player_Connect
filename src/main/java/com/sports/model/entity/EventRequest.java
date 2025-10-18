package com.sports.model.entity;

import com.sports.model.enums.EventRequestStatus;
import com.sports.model.enums.SportType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * Event Request Entity - Users can request to conduct events
 */
@Document(collection = "event_requests")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest extends BaseEntity {
    
    @Field("requester_id")
    @Indexed
    private String requesterId;
    
    @Field("event_name")
    private String eventName;
    
    @Field
    private String description;
    
    @Field("sport_type")
    @Indexed
    private SportType sportType;
    
    @Field("proposed_start_date")
    private LocalDateTime proposedStartDate;
    
    @Field("proposed_end_date")
    private LocalDateTime proposedEndDate;
    
    @Field("proposed_venue")
    private String proposedVenue;
    
    @Field("expected_participants")
    private Integer expectedParticipants;
    
    @Field("additional_details")
    private String additionalDetails;
    
    @Field
    @Indexed
    private EventRequestStatus status = EventRequestStatus.PENDING;
    
    @Field("reviewed_by")
    private String reviewedBy;
    
    @Field("reviewed_at")
    private LocalDateTime reviewedAt;
    
    @Field("review_comments")
    private String reviewComments;
    
    @Field("created_event_id")
    private String createdEventId;
}
