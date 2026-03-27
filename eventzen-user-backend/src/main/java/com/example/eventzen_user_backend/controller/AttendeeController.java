package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.ApiResponse;
import com.example.eventzen_user_backend.entity.Attendee;
import com.example.eventzen_user_backend.service.AttendeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for managing individual Event Attendees linked to Bookings.
 */
@RestController
@RequestMapping("/attendees")
@RequiredArgsConstructor
public class AttendeeController {

    private final AttendeeService attendeeService;

    /**
     * Registers a new attendee under an existing booking.
     * 
     * @param bookingId ID of the parent booking
     * @param req Detailed attendee profile
     * @return HTTP 201 Created with the persisted Attendee
     */
    @PostMapping
    public ResponseEntity<Attendee> add(@RequestParam Long bookingId,
            @RequestBody Attendee req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendeeService.add(bookingId, req));
    }

    /**
     * Lists all attendees attached to a specific booking.
     */
    @GetMapping
    public ResponseEntity<List<Attendee>> getByBooking(@RequestParam Long bookingId) {
        return ResponseEntity.ok(attendeeService.getByBooking(bookingId));
    }

    /**
     * Retrieves information about a distinct attendee.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Attendee> getById(@PathVariable Long id) {
        return ResponseEntity.ok(attendeeService.getById(id));
    }

    /**
     * Removes an attendee from a booking.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        attendeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Attendee removed"));
    }
}
