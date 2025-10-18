package com.sports.repository;

import com.sports.model.entity.Team;
import com.sports.model.enums.SportType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    
    Optional<Team> findByTeamCode(String teamCode);
    
    List<Team> findBySportType(SportType sportType);
    
    Page<Team> findBySportType(SportType sportType, Pageable pageable);
    
    List<Team> findByCity(String city);
    
    List<Team> findByCountry(String country);
    
    @Query(value = "{ 'sportType': ?0, 'currentRank': { $ne: null } }", sort = "{ 'currentRank': 1 }")
    List<Team> findTopRankedTeams(SportType sportType, Pageable pageable);
    
    List<Team> findByVerifiedTeamTrue();
    
    @Query("{ 'sportType': ?0, 'name': { $regex: ?1, $options: 'i' } }")
    Page<Team> searchTeams(SportType sportType, String search, Pageable pageable);
    
    @Query("{ $or: [ { 'captainId': ?0 }, { 'coachId': ?0 } ] }")
    List<Team> findTeamsByLeader(String userId);
}
