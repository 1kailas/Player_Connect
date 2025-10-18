package com.sports.model.entity;

import com.sports.model.enums.ResourceCategory;
import com.sports.model.enums.ResourceType;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * Resource Entity - Training materials, guides, videos for sports
 */
@Document(collection = "resources")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource extends BaseEntity {
    
    private String title;
    
    private String description;
    
    private ResourceCategory category; // COACHING, TRAINING, NUTRITION, etc.
    
    private ResourceType type; // PDF, VIDEO, ARTICLE
    
    @Builder.Default
    private List<String> languages = new ArrayList<>(); // English, Hindi, Tamil, etc.
    
    private String fileUrl;
    
    private String thumbnailUrl;
    
    @Builder.Default
    private Integer downloads = 0;
    
    @Builder.Default
    private Boolean isFeatured = false;
    
    @Builder.Default
    private Boolean aiGenerated = false;
    
    private String authorId;
    
    @Builder.Default
    private Double rating = 0.0;
    
    @Builder.Default
    private Integer reviewCount = 0;
    
    @Builder.Default
    private List<String> tags = new ArrayList<>();
}
