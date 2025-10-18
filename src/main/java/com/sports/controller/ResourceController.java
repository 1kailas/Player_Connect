package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.Resource;
import com.sports.model.enums.ResourceCategory;
import com.sports.model.enums.ResourceType;
import com.sports.service.ResourceService;
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
 * Resource Controller
 */
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Tag(name = "Resources", description = "Resource management endpoints")
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new resource")
    public ResponseEntity<ApiResponse<Resource>> createResource(@RequestBody Resource resource) {
        try {
            Resource created = resourceService.createResource(resource);
            return ResponseEntity.ok(ApiResponse.success("Resource created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a resource")
    public ResponseEntity<ApiResponse<Resource>> updateResource(
            @PathVariable String id,
            @RequestBody Resource resource) {
        try {
            Resource updated = resourceService.updateResource(id, resource);
            return ResponseEntity.ok(ApiResponse.success("Resource updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a resource")
    public ResponseEntity<ApiResponse<String>> deleteResource(@PathVariable String id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get resource by ID")
    public ResponseEntity<ApiResponse<Resource>> getResourceById(@PathVariable String id) {
        try {
            Resource resource = resourceService.getResourceById(id);
            return ResponseEntity.ok(ApiResponse.success(resource));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping
    @Operation(summary = "Get all resources")
    public ResponseEntity<ApiResponse<Page<Resource>>> getAllResources(Pageable pageable) {
        Page<Resource> resources = resourceService.getAllResources(pageable);
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
    
    @GetMapping("/filter")
    @Operation(summary = "Filter resources by category and type")
    public ResponseEntity<ApiResponse<Page<Resource>>> filterResources(
            @RequestParam(required = false) ResourceCategory category,
            @RequestParam(required = false) ResourceType type,
            Pageable pageable) {
        Page<Resource> resources = resourceService.filterResources(category, type, pageable);
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search resources")
    public ResponseEntity<ApiResponse<Page<Resource>>> searchResources(
            @RequestParam String query,
            Pageable pageable) {
        Page<Resource> resources = resourceService.searchResources(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
    
    @GetMapping("/featured")
    @Operation(summary = "Get featured resources")
    public ResponseEntity<ApiResponse<List<Resource>>> getFeaturedResources() {
        List<Resource> resources = resourceService.getFeaturedResources();
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
    
    @GetMapping("/ai-generated")
    @Operation(summary = "Get AI-generated resources")
    public ResponseEntity<ApiResponse<List<Resource>>> getAIGeneratedResources() {
        List<Resource> resources = resourceService.getAIGeneratedResources();
        return ResponseEntity.ok(ApiResponse.success(resources));
    }
    
    @PostMapping("/{id}/download")
    @Operation(summary = "Track resource download")
    public ResponseEntity<ApiResponse<Resource>> trackDownload(@PathVariable String id) {
        try {
            Resource resource = resourceService.incrementDownloads(id);
            return ResponseEntity.ok(ApiResponse.success(resource));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get resource statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getResourceStats() {
        Map<String, Object> stats = resourceService.getResourceStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
