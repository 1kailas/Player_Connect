package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.User;
import com.sports.service.AuthService;
import com.sports.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * File Upload Controller
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload and management endpoints")
public class FileUploadController {
    
    private final FileStorageService fileStorageService;
    private final AuthService authService;
    
    @PostMapping("/upload/profile-picture")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload profile picture")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {
        try {
            User currentUser = authService.getCurrentUser();
            String fileUrl = fileStorageService.storeProfilePicture(file, currentUser.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("message", "Profile picture uploaded successfully");
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/upload/event-image")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Upload event image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadEventImage(
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.storeEventImage(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("message", "Event image uploaded successfully");
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/upload/news-image")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    @Operation(summary = "Upload news article image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadNewsImage(
            @RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = fileStorageService.storeNewsImage(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("message", "News image uploaded successfully");
            
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{filename}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete uploaded file")
    public ResponseEntity<ApiResponse<String>> deleteFile(@PathVariable String filename) {
        try {
            fileStorageService.deleteFile(filename);
            return ResponseEntity.ok(ApiResponse.success("File deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
