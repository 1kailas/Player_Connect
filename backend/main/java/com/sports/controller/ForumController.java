package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.ForumPost;
import com.sports.model.entity.User;
import com.sports.service.AuthService;
import com.sports.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Forum Controller
 */
@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
@Tag(name = "Forum", description = "Community forum endpoints")
public class ForumController {
    
    private final ForumService forumService;
    private final AuthService authService;
    
    @PostMapping("/posts")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create a new forum post")
    public ResponseEntity<ApiResponse<ForumPost>> createPost(@RequestBody ForumPost post) {
        try {
            User user = authService.getCurrentUser();
            post.setAuthorId(user.getId());
            post.setAuthorName(user.getUsername());
            
            ForumPost created = forumService.createPost(post);
            return ResponseEntity.ok(ApiResponse.success("Post created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/posts/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a forum post")
    public ResponseEntity<ApiResponse<ForumPost>> updatePost(
            @PathVariable String id,
            @RequestBody ForumPost post) {
        try {
            ForumPost updated = forumService.updatePost(id, post);
            return ResponseEntity.ok(ApiResponse.success("Post updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/posts/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a forum post")
    public ResponseEntity<ApiResponse<String>> deletePost(@PathVariable String id) {
        try {
            forumService.deletePost(id);
            return ResponseEntity.ok(ApiResponse.success("Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts/{id}")
    @Operation(summary = "Get post by ID")
    public ResponseEntity<ApiResponse<ForumPost>> getPostById(@PathVariable String id) {
        try {
            ForumPost post = forumService.getPostById(id);
            return ResponseEntity.ok(ApiResponse.success(post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/posts")
    @Operation(summary = "Get all posts")
    public ResponseEntity<ApiResponse<Page<ForumPost>>> getAllPosts(Pageable pageable) {
        Page<ForumPost> posts = forumService.getAllPosts(pageable);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @GetMapping("/posts/category/{category}")
    @Operation(summary = "Get posts by category")
    public ResponseEntity<ApiResponse<Page<ForumPost>>> getPostsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.getPostsByCategory(category, pageable);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @GetMapping("/posts/search")
    @Operation(summary = "Search posts")
    public ResponseEntity<ApiResponse<Page<ForumPost>>> searchPosts(
            @RequestParam String query,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.searchPosts(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @GetMapping("/posts/trending")
    @Operation(summary = "Get trending posts")
    public ResponseEntity<ApiResponse<List<ForumPost>>> getTrendingPosts() {
        List<ForumPost> posts = forumService.getTrendingPosts();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @PostMapping("/posts/{id}/like")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Like/unlike a post")
    public ResponseEntity<ApiResponse<ForumPost>> likePost(@PathVariable String id) {
        try {
            User user = authService.getCurrentUser();
            ForumPost post = forumService.likePost(id, user.getId());
            return ResponseEntity.ok(ApiResponse.success(post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/posts/{id}/reply")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Reply to a post")
    public ResponseEntity<ApiResponse<ForumPost>> addReply(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            User user = authService.getCurrentUser();
            String content = request.get("content");
            ForumPost post = forumService.addReply(id, content, user.getId(), user.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Reply added successfully", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get forum statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getForumStats() {
        Map<String, Object> stats = forumService.getForumStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
