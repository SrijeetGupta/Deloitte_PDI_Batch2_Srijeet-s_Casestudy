package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.entity.VenueAvailability;
import com.example.eventzen_admin_backend.repository.VenueAvailabilityRepository;
import com.example.eventzen_admin_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Service managing calendar block-outs and availability mapping for physical venues.
 */
@Service
@RequiredArgsConstructor
public class VenueAvailabilityService {

    private final VenueAvailabilityRepository availabilityRepository;
    private final VenueRepository             venueRepository;

    /**
     * Inspects a venue's calendar. Returns a single slot if a date is specified,
     * otherwise yields the venue's complete record of availability overrides.
     */
    public List<VenueAvailability> getByVenue(Long venueId, LocalDate date) {
        if (!venueRepository.existsById(venueId)) {
            throw new EntityNotFoundException("Venue not found: " + venueId);
        }
        
        // Return isolated record wrapped in an immutable list if date is provided
        if (date != null) {
            return availabilityRepository.findByVenue_IdAndDate(venueId, date)
                    .map(List::of)
                    .orElse(List.of());
        }
        return availabilityRepository.findByVenue_Id(venueId);
    }

    /**
     * Employs update-or-insert (upsert) mechanics to dictate availability on a specific calendar day.
     */
    public VenueAvailability update(Long venueId, LocalDate date,
                                    VenueAvailability.AvailabilityStatus status) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + venueId));

        VenueAvailability slot = availabilityRepository
                .findByVenue_IdAndDate(venueId, date)
                .orElse(VenueAvailability.builder().venue(venue).date(date).build());

        slot.setStatus(status);
        return availabilityRepository.save(slot);
    }
}
