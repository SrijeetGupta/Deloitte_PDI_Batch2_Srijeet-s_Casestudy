package com.example.eventzen_user_backend.repository;

import com.example.eventzen_user_backend.entity.VenueAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VenueAvailabilityRepository extends JpaRepository<VenueAvailability, Long> {

    List<VenueAvailability> findByVenue_Id(Long venueId);

    Optional<VenueAvailability> findByVenue_IdAndDate(Long venueId, LocalDate date);

}