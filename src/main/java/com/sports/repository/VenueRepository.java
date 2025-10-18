package com.sports.repository;

import com.sports.model.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends MongoRepository<Venue, String> {
    
    List<Venue> findByCity(String city);
    
    List<Venue> findByState(String state);
    
    List<Venue> findByCountry(String country);
    
    Page<Venue> findByCityAndState(String city, String state, Pageable pageable);
    
    List<Venue> findByVerifiedVenueTrue();
    
    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'city': { $regex: ?0, $options: 'i' } } ] }")
    Page<Venue> searchVenues(String search, Pageable pageable);
    
    @Query("{ 'capacity': { $gte: ?0 } }")
    List<Venue> findByMinimumCapacity(int minCapacity);
}
