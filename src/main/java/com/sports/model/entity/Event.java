package com.sports.model.entity;

import com.sports.model.enums.EventStatus;
import com.sports.model.enums.SportType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Event/Tournament Entity
 */
@Document(collection = "events")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {
    
    @Field
    @Indexed
    private String name;
    
    @Field
    private String description;
    
    @Field
    @Indexed
    private SportType sportType;
    
    @Field
    @Indexed
    @Builder.Default
    private EventStatus status = EventStatus.DRAFT;
    
    @Field("organizer_id")
    @Indexed
    private String organizerId;
    
    @Field("venue_id")
    private String venueId;
    
    @Field("start_date")
    @Indexed
    private LocalDateTime startDate;
    
    @Field("end_date")
    @Indexed
    private LocalDateTime endDate;
    
    @Field("registration_deadline")
    private LocalDateTime registrationDeadline;
    
    @Field("max_participants")
    private Integer maxParticipants;
    
    @Field("min_participants")
    @Builder.Default
    private Integer minParticipants = 2;
    
    @Field("entry_fee")
    @Builder.Default
    private Double entryFee = 0.0;
    
    @Field
    private String prizePool;
    
    @Field
    private String rules;
    
    @Field
    private String bannerImageUrl;
    
    @Field
    private String sponsorLogos; // JSON array
    
    @Field("is_team_event")
    @Builder.Default
    private Boolean isTeamEvent = false;
    
    @Field("is_online")
    @Builder.Default
    private Boolean isOnline = false;
    
    @Field("streaming_url")
    private String streamingUrl;
    
    @Field("participant_ids")
    @Builder.Default
    private List<String> participantIds = new ArrayList<>();
    
    @Field("participating_team_ids")
    @Builder.Default
    private List<String> participatingTeamIds = new ArrayList<>();
    
    @Field("match_ids")
    @Builder.Default
    private List<String> matchIds = new ArrayList<>();
    
    @Field("total_views")
    @Builder.Default
    private Integer totalViews = 0;
    
    @Field("featured_event")
    @Builder.Default
    private Boolean featuredEvent = false;
    
    // Location fields for map integration
    @Field
    private String address;
    
    @Field
    private String city;
    
    @Field
    private String state;
    
    @Field
    private String country;
    
    @Field
    private String postalCode;
    
    @Field
    @Indexed(name = "location_2dsphere")
    private Double latitude;
    
    @Field
    @Indexed(name = "location_2dsphere")
    private Double longitude;
    
    @Field
    private String venueName; // e.g., "Chinnaswamy Stadium", "Court 1"
}
