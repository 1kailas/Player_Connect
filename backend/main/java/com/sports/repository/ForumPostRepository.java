package com.sports.repository;

import com.sports.model.entity.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends MongoRepository<ForumPost, String> {
    
    Page<ForumPost> findByCategory(String category, Pageable pageable);
    
    List<ForumPost> findByIsTrendingTrue();
    
    List<ForumPost> findByIsPinnedTrue();
    
    Page<ForumPost> findByAuthorId(String authorId, Pageable pageable);
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    Page<ForumPost> searchPosts(String search, Pageable pageable);
    
    long countByCategory(String category);
}
