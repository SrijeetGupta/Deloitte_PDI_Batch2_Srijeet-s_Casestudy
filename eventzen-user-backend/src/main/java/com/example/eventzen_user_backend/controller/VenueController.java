package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.ApiResponse;
import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.entity.VenueAvailability;
import com.example.eventzen_user_backend.service.VenueAvailabilityService;
import com.example.eventzen_user_backend.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for interactions concerning Venue endpoints and nested availability tracking.
 */
@RestController
@RequestMapping("/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;
    private final VenueAvailabilityService availabilityService;

    /**
     * Searches out venues across the system. Fully supports dynamic filtration via request parameters.
     */
    @GetMapping
    public ResponseEntity<List<Venue>> getAll(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(venueService.getAll(location, capacity));
    }

    /**
     * Loads explicit details of a lone venue via its identity.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Venue> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getById(id));
    }

    /**
     * Spawns a new venue instance globally accessible in search.
     */
    @PostMapping
    public ResponseEntity<Venue> create(@RequestBody Venue venue) {
        return ResponseEntity.status(HttpStatus.CREATED).body(venueService.create(venue));
    }

    /**
     * Commits comprehensive overwrites to an existing venue mapping.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Venue> update(@PathVariable Long id, @RequestBody Venue venue) {
        return ResponseEntity.ok(venueService.update(id, venue));
    }

    /**
     * Obliterates a venue permanently. Operations fail if tied events exist.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        venueService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Venue deleted successfully"));
    }

    /**
     * Exposes the calendared availability schedule belonging to the venue.
     */
    @GetMapping("/{id}/availability")
    public ResponseEntity<List<VenueAvailability>> getAvailability(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getByVenue(id, date));
    }

    /**
     * Blocks out or clears a venue on a designated grid day.
     */
    @PutMapping("/{id}/availability")
    public ResponseEntity<VenueAvailability> updateAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam VenueAvailability.AvailabilityStatus status) {
        return ResponseEntity.ok(availabilityService.update(id, date, status));
    }
}
