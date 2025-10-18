package com.sports.service;

import com.sports.model.entity.Certificate;
import com.sports.model.entity.User;
import com.sports.model.enums.CertificateType;
import com.sports.repository.CertificateRepository;
import com.sports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Certificate Service - Manages player certificates and achievements
 */
@Service
@RequiredArgsConstructor
public class CertificateService {
    
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    
    @Transactional
    public Certificate uploadCertificate(String userId, Certificate certificate, MultipartFile file) {
        // Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Upload file
        String fileUrl = fileStorageService.uploadFile(file, "certificates");
        
        certificate.setUserId(userId);
        certificate.setCertificateUrl(fileUrl);
        certificate.setVerified(false);
        
        Certificate saved = certificateRepository.save(certificate);
        
        // Update user's certificate list
        user.getCertificateIds().add(saved.getId());
        userRepository.save(user);
        
        // Notify user
        notificationService.notifyCertificateUploaded(user, saved);
        
        return saved;
    }
    
    @Transactional
    public Certificate verifyCertificate(String certificateId, String adminId, String notes) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        
        certificate.setVerified(true);
        certificate.setVerifiedBy(adminId);
        certificate.setVerifiedAt(LocalDateTime.now());
        certificate.setVerificationNotes(notes);
        
        Certificate updated = certificateRepository.save(certificate);
        
        // Notify user
        User user = userRepository.findById(certificate.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationService.notifyCertificateVerified(user, updated);
        
        return updated;
    }
    
    @Transactional
    public Certificate rejectCertificate(String certificateId, String adminId, String reason) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
        
        certificate.setVerified(false);
        certificate.setVerifiedBy(adminId);
        certificate.setVerifiedAt(LocalDateTime.now());
        certificate.setVerificationNotes("REJECTED: " + reason);
        
        Certificate updated = certificateRepository.save(certificate);
        
        // Notify user
        User user = userRepository.findById(certificate.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        notificationService.notifyCertificateRejected(user, updated, reason);
        
        return updated;
    }
    
    public List<Certificate> getUserCertificates(String userId) {
        return certificateRepository.findByUserId(userId);
    }
    
    public Page<Certificate> getPendingCertificates(Pageable pageable) {
        return certificateRepository.findByVerified(false, pageable);
    }
    
    public Page<Certificate> getAllCertificates(Boolean verified, CertificateType type, Pageable pageable) {
        if (verified != null && type != null) {
            return certificateRepository.findByVerifiedAndCertificateType(verified, type, pageable);
        } else if (verified != null) {
            return certificateRepository.findByVerified(verified, pageable);
        } else if (type != null) {
            return certificateRepository.findByCertificateType(type, pageable);
        } else {
            return certificateRepository.findAll(pageable);
        }
    }
    
    public Certificate getCertificateById(String id) {
        return certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));
    }
    
    @Transactional
    public void deleteCertificate(String certificateId) {
        Certificate certificate = getCertificateById(certificateId);
        
        // Remove from user's certificate list
        User user = userRepository.findById(certificate.getUserId()).orElse(null);
        if (user != null) {
            user.getCertificateIds().remove(certificateId);
            userRepository.save(user);
        }
        
        // Delete file
        if (certificate.getCertificateUrl() != null) {
            fileStorageService.deleteFile(certificate.getCertificateUrl());
        }
        
        certificateRepository.deleteById(certificateId);
    }
    
    public Map<String, Object> getCertificateStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = certificateRepository.count();
        long verified = certificateRepository.countByVerified(true);
        long pending = certificateRepository.countByVerifiedFalse();
        
        stats.put("totalCertificates", total);
        stats.put("verifiedCertificates", verified);
        stats.put("pendingCertificates", pending);
        stats.put("rejectedCertificates", total - verified - pending);
        
        return stats;
    }
}
