package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.entity.VenueAvailability;
import com.example.eventzen_admin_backend.service.VenueAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for managing block-out dates and availability status of individual Venues.
 */
@RestController
@RequestMapping("/venues/{venueId}/availability")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class VenueAvailabilityController {

    private final VenueAvailabilityService availabilityService;

    /**
     * Fetches availability records for a venue. Optionally filters by a specific date.
     * 
     * @param venueId ID of the venue
     * @param date Optional specific date to search for
     * @return List of availability statuses
     */
    @GetMapping
    public ResponseEntity<List<VenueAvailability>> getAvailability(
            @PathVariable Long venueId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(availabilityService.getByVenue(venueId, date));
    }

    /**
     * Upserts an availability record (e.g., marking a specific date as UNAVAILABLE).
     */
    @PutMapping
    public ResponseEntity<VenueAvailability> updateAvailability(
            @PathVariable Long venueId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam VenueAvailability.AvailabilityStatus status
    ) {
        return ResponseEntity.ok(availabilityService.update(venueId, date, status));
    }
}
