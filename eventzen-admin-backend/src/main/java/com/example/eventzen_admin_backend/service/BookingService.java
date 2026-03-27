package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Booking;
import com.example.eventzen_admin_backend.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for handling Booking-related operations specific to Administrators.
 * Includes capabilities to view, approve, or reject user bookings.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    /**
     * Retrieves all bookings across the entire system.
     * Intended exclusively for admin oversight and reporting.
     * 
     * @return A complete list of all Booking entities
     */
    public List<Booking> getAllAdmin() {
        return bookingRepository.findAll();
    }

    /**
     * Approves a specific user booking.
     * 
     * @param id The unique identifier of the booking
     * @return The updated Booking entity with APPROVED status
     * @throws EntityNotFoundException if the target booking is not found
     * @throws IllegalArgumentException if the booking is already approved
     */
    public Booking approve(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));

        // Prevent redundant state transitions
        if (b.getStatus() == Booking.Status.APPROVED) {
            throw new IllegalArgumentException("Booking is already approved");
        }

        b.setStatus(Booking.Status.APPROVED);
        return bookingRepository.save(b);
    }

    /**
     * Rejects a specific user booking, for instance, if payment failed or capacity is reached.
     * 
     * @param id The unique identifier of the booking
     * @return The updated Booking entity with REJECTED status
     * @throws EntityNotFoundException if the target booking is not found
     */
    public Booking reject(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
                
        b.setStatus(Booking.Status.REJECTED);
        return bookingRepository.save(b);
    }
}
