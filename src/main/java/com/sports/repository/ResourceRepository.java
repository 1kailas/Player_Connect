package com.sports.repository;

import com.sports.model.entity.Resource;
import com.sports.model.enums.ResourceCategory;
import com.sports.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    Page<Resource> findByCategory(ResourceCategory category, Pageable pageable);
    
    Page<Resource> findByType(ResourceType type, Pageable pageable);
    
    Page<Resource> findByCategoryAndType(ResourceCategory category, ResourceType type, Pageable pageable);
    
    List<Resource> findByIsFeaturedTrue();
    
    List<Resource> findByAiGeneratedTrue();
    
    List<Resource> findByLanguagesContaining(String language);
    
    long countByAiGeneratedTrue();
    
    long countByCategory(ResourceCategory category);
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<Resource> searchResources(String search, Pageable pageable);
}
