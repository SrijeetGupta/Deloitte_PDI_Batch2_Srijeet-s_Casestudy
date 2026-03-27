package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.BookingRequest;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller serving dual roles for standard user booking management
 * and administrative oversight, strictly segmented by endpoint mapping and role evaluation.
 */
@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * Submits a new booking request for the currently authenticated standard user.
     */
    @PostMapping("/bookings")
    public ResponseEntity<Booking> create(@RequestBody BookingRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(req));
    }

    /**
     * Yields a history of bookings belonging explicitly to the calling user.
     */
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getMyBookings());
    }

    /**
     * Inspects a single booking. Validates ownership within the service tier.
     */
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    /**
     * Cancels an existing booking. State bounds checked by service layer.
     */
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancel(id));
    }

    /**
     * Administrative endpoint to pull every platform booking globally.
     */
    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllAdmin() {
        return ResponseEntity.ok(bookingService.getAllAdmin());
    }

    /**
     * Administrative endpoint to validate and progress a booking to APPROVED.
     */
    @PutMapping("/admin/bookings/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> approve(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approve(id));
    }

    /**
     * Administrative endpoint to deny a booking request.
     */
    @PutMapping("/admin/bookings/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> reject(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.reject(id));
    }
}
