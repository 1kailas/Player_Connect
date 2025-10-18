package com.sports.service;

import com.sports.model.entity.Resource;
import com.sports.model.enums.ResourceCategory;
import com.sports.model.enums.ResourceType;
import com.sports.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Resource Service
 */
@Service
@RequiredArgsConstructor
public class ResourceService {
    
    private final ResourceRepository resourceRepository;
    
    @Transactional
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public Resource updateResource(String id, Resource updatedResource) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        
        resource.setTitle(updatedResource.getTitle());
        resource.setDescription(updatedResource.getDescription());
        resource.setCategory(updatedResource.getCategory());
        resource.setType(updatedResource.getType());
        resource.setLanguages(updatedResource.getLanguages());
        resource.setFileUrl(updatedResource.getFileUrl());
        resource.setThumbnailUrl(updatedResource.getThumbnailUrl());
        resource.setIsFeatured(updatedResource.getIsFeatured());
        resource.setAiGenerated(updatedResource.getAiGenerated());
        resource.setTags(updatedResource.getTags());
        
        return resourceRepository.save(resource);
    }
    
    @Transactional
    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }
    
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }
    
    public Page<Resource> getAllResources(Pageable pageable) {
        return resourceRepository.findAll(pageable);
    }
    
    public Page<Resource> filterResources(ResourceCategory category, ResourceType type, Pageable pageable) {
        if (category != null && type != null) {
            return resourceRepository.findByCategoryAndType(category, type, pageable);
        } else if (category != null) {
            return resourceRepository.findByCategory(category, pageable);
        } else if (type != null) {
            return resourceRepository.findByType(type, pageable);
        } else {
            return resourceRepository.findAll(pageable);
        }
    }
    
    public Page<Resource> searchResources(String query, Pageable pageable) {
        return resourceRepository.searchResources(query, pageable);
    }
    
    public List<Resource> getFeaturedResources() {
        return resourceRepository.findByIsFeaturedTrue();
    }
    
    public List<Resource> getAIGeneratedResources() {
        return resourceRepository.findByAiGeneratedTrue();
    }
    
    @Transactional
    public Resource incrementDownloads(String id) {
        Resource resource = getResourceById(id);
        resource.setDownloads(resource.getDownloads() + 1);
        return resourceRepository.save(resource);
    }
    
    public Map<String, Object> getResourceStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long total = resourceRepository.count();
        long aiGenerated = resourceRepository.countByAiGeneratedTrue();
        long featured = resourceRepository.findByIsFeaturedTrue().size();
        
        stats.put("total", total);
        stats.put("aiGenerated", aiGenerated);
        stats.put("featured", featured);
        stats.put("coaching", resourceRepository.countByCategory(ResourceCategory.COACHING));
        stats.put("training", resourceRepository.countByCategory(ResourceCategory.TRAINING));
        stats.put("nutrition", resourceRepository.countByCategory(ResourceCategory.NUTRITION));
        
        return stats;
    }
}
