package com.sports.service;

import com.sports.model.entity.ForumPost;
import com.sports.repository.ForumPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Forum Service
 */
@Service
@RequiredArgsConstructor
public class ForumService {
    
    private final ForumPostRepository forumPostRepository;
    
    @Transactional
    public ForumPost createPost(ForumPost post) {
        post.setLikes(0);
        post.setReplyCount(0);
        return forumPostRepository.save(post);
    }
    
    @Transactional
    public ForumPost updatePost(String id, ForumPost updatedPost) {
        ForumPost post = forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        post.setTitle(updatedPost.getTitle());
        post.setContent(updatedPost.getContent());
        post.setCategory(updatedPost.getCategory());
        
        return forumPostRepository.save(post);
    }
    
    @Transactional
    public void deletePost(String id) {
        forumPostRepository.deleteById(id);
    }
    
    public ForumPost getPostById(String id) {
        return forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }
    
    public Page<ForumPost> getAllPosts(Pageable pageable) {
        return forumPostRepository.findAll(PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending()
        ));
    }
    
    public Page<ForumPost> getPostsByCategory(String category, Pageable pageable) {
        return forumPostRepository.findByCategory(category, PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending()
        ));
    }
    
    public Page<ForumPost> searchPosts(String query, Pageable pageable) {
        return forumPostRepository.searchPosts(query, pageable);
    }
    
    public List<ForumPost> getTrendingPosts() {
        return forumPostRepository.findByIsTrendingTrue();
    }
    
    @Transactional
    public ForumPost likePost(String postId, String userId) {
        ForumPost post = getPostById(postId);
        
        if (post.getLikedByUserIds().contains(userId)) {
            // Unlike
            post.getLikedByUserIds().remove(userId);
            post.setLikes(post.getLikes() - 1);
        } else {
            // Like
            post.getLikedByUserIds().add(userId);
            post.setLikes(post.getLikes() + 1);
        }
        
        return forumPostRepository.save(post);
    }
    
    @Transactional
    public ForumPost addReply(String postId, String content, String userId, String userName) {
        ForumPost post = getPostById(postId);
        
        ForumPost.ForumReply reply = ForumPost.ForumReply.builder()
                .id(UUID.randomUUID().toString())
                .content(content)
                .authorId(userId)
                .authorName(userName)
                .createdAt(LocalDateTime.now().toString())
                .likes(0)
                .build();
        
        post.getReplies().add(reply);
        post.setReplyCount(post.getReplies().size());
        
        return forumPostRepository.save(post);
    }
    
    public Map<String, Object> getForumStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalPosts = forumPostRepository.count();
        long cricketPosts = forumPostRepository.countByCategory("CRICKET");
        long footballPosts = forumPostRepository.countByCategory("FOOTBALL");
        
        stats.put("totalPosts", totalPosts);
        stats.put("activeMembers", totalPosts * 2); // Mock calculation
        stats.put("totalReplies", totalPosts * 5); // Mock calculation
        stats.put("cricketPosts", cricketPosts);
        stats.put("footballPosts", footballPosts);
        
        return stats;
    }
}
