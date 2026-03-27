package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.ApiResponse;
import com.example.eventzen_user_backend.entity.Vendor;
import com.example.eventzen_user_backend.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller directing public and user-level inquiries concerning Vendors.
 */
@RestController
@RequestMapping("/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    /**
     * Lists vendors. Optionally filters results to those linked with a provided Venue.
     * 
     * @param venueId Optional Venue ID to filter by
     * @return HTTP 200 with the subset or complete list of Vendor entities
     */
    @GetMapping
    public ResponseEntity<List<Vendor>> getByVenue(
            @RequestParam(required = false) Long venueId) {
        if (venueId != null) {
            return ResponseEntity.ok(vendorService.getByVenue(venueId));
        }
        return ResponseEntity.ok(vendorService.getAll());
    }

    /**
     * Resolves metadata for an individual identified vendor.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }

    /**
     * Registers a new vendor and connects it to a target venue representing their operating location.
     */
    @PostMapping
    public ResponseEntity<Vendor> create(@RequestParam Long venueId,
            @RequestBody Vendor vendor) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vendorService.create(venueId, vendor));
    }

    /**
     * Corrects or refreshes an existing vendor profile.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Vendor> update(@PathVariable Long id,
            @RequestParam(required = false) Long venueId,
            @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.update(id, vendor, venueId));
    }

    /**
     * Permanently wipes a vendor entry from the system.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        vendorService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Vendor deleted successfully"));
    }
}
