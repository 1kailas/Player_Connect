package com.sports.model.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

/**
 * Comment Entity - Comments on events, matches, news
 */
@Document(collection = "comments")
@CompoundIndex(name = "entity_type_id_idx", def = "{'entity_type': 1, 'entity_id': 1}")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment extends BaseEntity {
    
    @Field("user_id")
    @Indexed
    private String userId;
    
    @Field("entity_type")
    @Indexed
    private String entityType; // EVENT, MATCH, NEWS
    
    @Field("entity_id")
    @Indexed
    private String entityId;
    
    @Field
    private String content;
    
    @Field("parent_comment_id")
    private String parentCommentId;
    
    @Field("like_count")
    @Builder.Default
    private Integer likeCount = 0;
    
    @Field("is_flagged")
    @Builder.Default
    private Boolean isFlagged = false;
}
