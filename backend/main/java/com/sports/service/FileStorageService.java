package com.sports.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


/**
 * File Storage Service
 */
@Service
public class FileStorageService {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for certificates
    private static final String[] ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"};
    private static final String[] ALLOWED_DOCUMENT_EXTENSIONS = {".pdf", ".doc", ".docx"};
    
    public String storeProfilePicture(MultipartFile file, String userId) {
        validateFile(file);
        String filename = "profile_" + userId + "_" + System.currentTimeMillis() + getFileExtension(file.getOriginalFilename());
        return storeFile(file, "profiles", filename);
    }
    
    public String storeEventImage(MultipartFile file) {
        validateFile(file);
        String filename = "event_" + UUID.randomUUID() + "_" + System.currentTimeMillis() + getFileExtension(file.getOriginalFilename());
        return storeFile(file, "events", filename);
    }
    
    public String storeNewsImage(MultipartFile file) {
        validateFile(file);
        String filename = "news_" + UUID.randomUUID() + "_" + System.currentTimeMillis() + getFileExtension(file.getOriginalFilename());
        return storeFile(file, "news", filename);
    }
    
    // ============= NEW: Generic file upload method =============
    
    public String uploadFile(MultipartFile file, String subDir) {
        validateFile(file);
        String filename = subDir + "_" + UUID.randomUUID() + "_" + System.currentTimeMillis() + getFileExtension(file.getOriginalFilename());
        return storeFile(file, subDir, filename);
    }
    
    private String storeFile(MultipartFile file, String subDir, String filename) {
        try {
            // Create directories if they don't exist
            Path uploadPath = Paths.get(uploadDir, subDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Store file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return relative URL
            return "/uploads/" + subDir + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }
    
    public void deleteFile(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Invalid filename");
        }
        
        String extension = getFileExtension(filename).toLowerCase();
        boolean isAllowed = false;
        
        // Check image extensions
        for (String allowedExt : ALLOWED_IMAGE_EXTENSIONS) {
            if (extension.equals(allowedExt)) {
                isAllowed = true;
                break;
            }
        }
        
        // Check document extensions
        if (!isAllowed) {
            for (String allowedExt : ALLOWED_DOCUMENT_EXTENSIONS) {
                if (extension.equals(allowedExt)) {
                    isAllowed = true;
                    break;
                }
            }
        }
        
        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed. Allowed types: jpg, jpeg, png, gif, webp, pdf, doc, docx");
        }
    }
    
    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        return dotIndex > 0 ? filename.substring(dotIndex) : "";
    }
}
