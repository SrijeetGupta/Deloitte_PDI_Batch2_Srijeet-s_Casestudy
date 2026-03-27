package com.example.eventzen_admin_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventzen_admin_backend.entity.Venue;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {

       List<Venue> findByLocationContainingIgnoreCase(String location);

       List<Venue> findByCapacityGreaterThanEqual(Integer capacity);

       @Query("SELECT v FROM Venue v WHERE " +
                     "(:location IS NULL OR LOWER(v.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
                     "(:capacity IS NULL OR v.capacity >= :capacity)")
       List<Venue> findByFilters(@Param("location") String location,
                     @Param("capacity") Integer capacity);
}
