package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

/**
 * Venue Entity - Sports venues/locations
 */
@Document(collection = "venues")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue extends BaseEntity {
    
    @Field
    @Indexed
    private String name;
    
    @Field
    private String address;
    
    @Field
    @Indexed
    private String city;
    
    @Field
    @Indexed
    private String state;
    
    @Field
    @Indexed
    private String country;
    
    @Field
    private String postalCode;
    
    @Field
    private Double latitude;
    
    @Field
    private Double longitude;
    
    @Field
    private Integer capacity;
    
    @Field
    private String facilities; // JSON array of facilities
    
    @Field
    private String contactEmail;
    
    @Field
    private String contactPhone;
    
    @Field("manager_id")
    private String managerId;
    
    @Field
    private String imageUrls; // JSON array of image URLs
    
    @Field
    private Double hourlyRate;
    
    @Field("availability_schedule")
    private String availabilitySchedule; // JSON representation of schedule
    
    @Field("verified_venue")
    @Builder.Default
    private Boolean verifiedVenue = false;
}
