package com.sports.repository;

import com.sports.model.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    
    List<Comment> findByEntityTypeAndEntityId(String entityType, String entityId);
    
    Page<Comment> findByEntityTypeAndEntityId(String entityType, String entityId, Pageable pageable);
    
    List<Comment> findByUserId(String userId);
    
    List<Comment> findByParentCommentId(String parentCommentId);
    
    @Query(value = "{ 'entityType': ?0, 'entityId': ?1, 'parentCommentId': null }", sort = "{ 'createdAt': -1 }")
    Page<Comment> findTopLevelComments(String entityType, String entityId, Pageable pageable);
    
    long countByEntityTypeAndEntityId(String entityType, String entityId);
}
