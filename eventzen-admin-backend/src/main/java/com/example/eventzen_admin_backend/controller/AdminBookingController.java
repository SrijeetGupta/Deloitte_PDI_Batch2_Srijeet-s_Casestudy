package com.example.eventzen_admin_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.eventzen_admin_backend.entity.Booking;
import com.example.eventzen_admin_backend.service.BookingService;

import java.util.List;

/**
 * REST Controller for managing Event Bookings from the Administrative perspective.
 * All endpoints mapped here are strictly reserved for users with the ADMIN role.
 */
@RestController
@RequestMapping("/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminBookingController {

    private final BookingService bookingService;

    /**
     * Retrieves all bookings across the system regardless of user or event.
     * 
     * @return HTTP 200 with a list of all Booking entities
     */
    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAllAdmin());
    }

    /**
     * Approves a specific user booking.
     * 
     * @param id The ID of the booking to approve
     * @return HTTP 200 with the updated Booking entity
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approve(id));
    }

    /**
     * Rejects a specific user booking.
     * 
     * @param id The ID of the booking to reject
     * @return HTTP 200 with the updated Booking entity
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> reject(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.reject(id));
    }
}
