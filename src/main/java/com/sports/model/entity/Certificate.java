package com.sports.model.entity;

import com.sports.model.enums.CertificateType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;

/**
 * Certificate Entity - Player certifications and achievements
 */
@Document(collection = "certificates")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate extends BaseEntity {
    
    @Field("user_id")
    @Indexed
    private String userId;
    
    @Field
    private String title;
    
    @Field
    private String description;
    
    @Field("certificate_type")
    private CertificateType certificateType;
    
    @Field("issuing_organization")
    private String issuingOrganization;
    
    @Field("issue_date")
    private LocalDate issueDate;
    
    @Field("expiry_date")
    private LocalDate expiryDate;
    
    @Field("certificate_url")
    private String certificateUrl; // URL to uploaded certificate image/PDF
    
    @Field("credential_id")
    private String credentialId;
    
    @Field("credential_url")
    private String credentialUrl; // External verification URL
    
    @Field("verified")
    @Builder.Default
    private Boolean verified = false;
    
    @Field("verified_by")
    private String verifiedBy; // Admin ID who verified
    
    @Field("verified_at")
    private java.time.LocalDateTime verifiedAt;
    
    @Field("verification_notes")
    private String verificationNotes;
    
    @Field("sport_type")
    private String sportType; // CRICKET, FOOTBALL, etc.
    
    @Field("achievement_level")
    private String achievementLevel; // INTERNATIONAL, NATIONAL, STATE, DISTRICT
}
