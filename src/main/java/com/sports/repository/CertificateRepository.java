package com.sports.repository;

import com.sports.model.entity.Certificate;
import com.sports.model.enums.CertificateType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    
    List<Certificate> findByUserId(String userId);
    
    Page<Certificate> findByUserId(String userId, Pageable pageable);
    
    Page<Certificate> findByVerified(Boolean verified, Pageable pageable);
    
    Page<Certificate> findByCertificateType(CertificateType certificateType, Pageable pageable);
    
    Page<Certificate> findByVerifiedAndCertificateType(Boolean verified, CertificateType certificateType, Pageable pageable);
    
    long countByUserId(String userId);
    
    long countByVerified(Boolean verified);
    
    long countByVerifiedFalse();
    
    List<Certificate> findByVerifiedFalseOrderByCreatedAtDesc();
}
