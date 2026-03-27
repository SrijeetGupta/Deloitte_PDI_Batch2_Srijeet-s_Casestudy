package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.ApiResponse;
import com.example.eventzen_admin_backend.entity.Vendor;
import com.example.eventzen_admin_backend.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller handling administrative operations for Vendors.
 */
@RestController
@RequestMapping("/vendors")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    /**
     * Registers a new vendor and links them to a specific venue.
     * 
     * @param venueId ID of the parent venue
     * @param req Vendor details
     * @return HTTP 201 Created with the persisted Vendor entity
     */
    @PostMapping
    public ResponseEntity<Vendor> create(@RequestParam Long venueId,
            @RequestBody Vendor req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vendorService.create(venueId, req));
    }

    /**
     * Lists all vendors associated with a specific venue.
     */
    @GetMapping
    public ResponseEntity<List<Vendor>> getByVenue(@RequestParam Long venueId) {
        return ResponseEntity.ok(vendorService.getByVenue(venueId));
    }

    /**
     * Retrieves detailed information about a single vendor.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }

    /**
     * Updates an existing vendor's details and optionally reassigns them to a different venue.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> update(@PathVariable Long id,
            @RequestBody Vendor req,
            @RequestParam(required = false) Long venueId) {
        return ResponseEntity.ok(vendorService.update(id, req, venueId));
    }

    /**
     * Deletes a vendor from the system.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        vendorService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Vendor deleted successfully"));
    }
}
