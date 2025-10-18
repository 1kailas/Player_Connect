package com.sports.controller;

import com.sports.dto.ApiResponse;
import com.sports.model.entity.Certificate;
import com.sports.model.enums.CertificateType;
import com.sports.service.AuthService;
import com.sports.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Certificate Controller - For managing player certificates
 */
@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "Certificate management endpoints")
public class CertificateController {
    
    private final CertificateService certificateService;
    private final AuthService authService;
    
    // ==================== User Operations ====================
    
    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload a new certificate")
    public ResponseEntity<ApiResponse<Certificate>> uploadCertificate(
            @RequestPart("certificate") Certificate certificate,
            @RequestPart("file") MultipartFile file) {
        try {
            String userId = authService.getCurrentUser().getId();
            Certificate uploaded = certificateService.uploadCertificate(userId, certificate, file);
            return ResponseEntity.ok(ApiResponse.success("Certificate uploaded successfully", uploaded));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/my-certificates")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user's certificates")
    public ResponseEntity<ApiResponse<List<Certificate>>> getMyCertificates() {
        try {
            String userId = authService.getCurrentUser().getId();
            List<Certificate> certificates = certificateService.getUserCertificates(userId);
            return ResponseEntity.ok(ApiResponse.success(certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user's certificates")
    public ResponseEntity<ApiResponse<List<Certificate>>> getUserCertificates(@PathVariable String userId) {
        try {
            List<Certificate> certificates = certificateService.getUserCertificates(userId);
            return ResponseEntity.ok(ApiResponse.success(certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get certificate by ID")
    public ResponseEntity<ApiResponse<Certificate>> getCertificateById(@PathVariable String id) {
        try {
            Certificate certificate = certificateService.getCertificateById(id);
            return ResponseEntity.ok(ApiResponse.success(certificate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete own certificate")
    public ResponseEntity<ApiResponse<String>> deleteCertificate(@PathVariable String id) {
        try {
            String userId = authService.getCurrentUser().getId();
            Certificate certificate = certificateService.getCertificateById(id);
            
            // Check ownership
            if (!certificate.getUserId().equals(userId) && 
                !authService.getCurrentUser().getRoles().contains(com.sports.model.enums.UserRole.ADMIN)) {
                return ResponseEntity.status(403).body(ApiResponse.error("Unauthorized"));
            }
            
            certificateService.deleteCertificate(id);
            return ResponseEntity.ok(ApiResponse.success("Certificate deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // ==================== Admin Operations ====================
    
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all certificates (Admin)")
    public ResponseEntity<ApiResponse<Page<Certificate>>> getAllCertificates(
            @RequestParam(required = false) Boolean verified,
            @RequestParam(required = false) CertificateType type,
            Pageable pageable) {
        try {
            Page<Certificate> certificates = certificateService.getAllCertificates(verified, type, pageable);
            return ResponseEntity.ok(ApiResponse.success(certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get pending certificates for verification (Admin)")
    public ResponseEntity<ApiResponse<Page<Certificate>>> getPendingCertificates(Pageable pageable) {
        try {
            Page<Certificate> certificates = certificateService.getPendingCertificates(pageable);
            return ResponseEntity.ok(ApiResponse.success(certificates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/admin/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verify a certificate (Admin)")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificate(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> request) {
        try {
            String adminId = authService.getCurrentUser().getId();
            String notes = request != null ? request.get("notes") : "";
            Certificate verified = certificateService.verifyCertificate(id, adminId, notes);
            return ResponseEntity.ok(ApiResponse.success("Certificate verified successfully", verified));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject a certificate (Admin)")
    public ResponseEntity<ApiResponse<Certificate>> rejectCertificate(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String adminId = authService.getCurrentUser().getId();
            String reason = request.get("reason");
            Certificate rejected = certificateService.rejectCertificate(id, adminId, reason);
            return ResponseEntity.ok(ApiResponse.success("Certificate rejected", rejected));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get certificate statistics (Admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCertificateStats() {
        try {
            Map<String, Object> stats = certificateService.getCertificateStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
