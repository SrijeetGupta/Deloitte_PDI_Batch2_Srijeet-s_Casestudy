package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.ApiResponse;
import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.service.VenueService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for administrative venue management.
 */
@RestController
@RequestMapping("/venues")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    /**
     * Lists venues across the system. Supports optional filtering by generic location strings and capacity minimums.
     */
    @GetMapping
    public ResponseEntity<List<Venue>> getAll(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer capacity
    ) {
        return ResponseEntity.ok(venueService.getAll(location, capacity));
    }

    /**
     * Fetches a single venue's extensive details including location, capacity, and linked vendors.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Venue> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venueService.getById(id));
    }

    /**
     * Provisions a brand new venue into the database.
     */
    @PostMapping
    public ResponseEntity<Venue> create(@RequestBody Venue venue) {
        return ResponseEntity.status(HttpStatus.CREATED).body(venueService.create(venue));
    }

    /**
     * Overwrites an existing venue's details entirely.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Venue> update(@PathVariable Long id,
            @RequestBody Venue venue) {
        return ResponseEntity.ok(venueService.update(id, venue));
    }

    /**
     * Removes a venue from the system. Fails if active events are linked.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        venueService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Venue deleted successfully"));
    }
}
