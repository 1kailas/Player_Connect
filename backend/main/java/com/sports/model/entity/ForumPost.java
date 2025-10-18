package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

/**
 * Forum Post Entity - Community discussions
 */
@Document(collection = "forum_posts")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPost extends BaseEntity {
    
    private String title;
    
    private String content;
    
    private String authorId;
    
    private String authorName;
    
    private String category; // CRICKET, FOOTBALL, TRAINING, EVENTS, GENERAL
    
    @Builder.Default
    private Integer likes = 0;
    
    @Builder.Default
    private List<String> likedByUserIds = new ArrayList<>();
    
    @Builder.Default
    private Integer replyCount = 0;
    
    @Builder.Default
    private Boolean isPinned = false;
    
    @Builder.Default
    private Boolean isTrending = false;
    
    @Builder.Default
    private List<ForumReply> replies = new ArrayList<>();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForumReply {
        private String id;
        private String content;
        private String authorId;
        private String authorName;
        private String createdAt;
        private Integer likes;
    }
}
