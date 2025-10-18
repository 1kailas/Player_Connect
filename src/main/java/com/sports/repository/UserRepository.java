package com.sports.repository;

import com.sports.model.entity.User;
import com.sports.model.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRolesContaining(UserRole role);
    
    Page<User> findByRolesContaining(UserRole role, Pageable pageable);
    
    Page<User> findByIsActive(Boolean isActive, Pageable pageable);
    
    Page<User> findByRolesContainingAndIsActive(UserRole role, Boolean isActive, Pageable pageable);
    
    long countByRolesContaining(UserRole role);
    
    long countByIsActiveTrue();
    
    long countByLastLoginAfter(LocalDateTime date);
    
    Page<User> findByCountryAndCity(String country, String city, Pageable pageable);
    
    @Query(value = "{ 'totalPoints': { $gt: ?0 } }", sort = "{ 'totalPoints': -1 }")
    List<User> findTopUsersByPoints(int minPoints, Pageable pageable);
    
    List<User> findByEmailVerifiedFalse();
    
    @Query("{ $or: [ " +
           "{ 'firstName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'lastName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'username': { $regex: ?0, $options: 'i' } } " +
           "] }")
    Page<User> searchUsers(String search, Pageable pageable);
    
    List<User> findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String username, String firstName, String lastName);
}
