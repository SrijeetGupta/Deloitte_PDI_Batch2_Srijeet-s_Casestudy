package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Attendee;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.repository.AttendeeRepository;
import com.example.eventzen_user_backend.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service encapsulating the logistics surrounding event Attendees.
 */
@Service
@RequiredArgsConstructor
public class AttendeeService {

    private final AttendeeRepository attendeeRepository;
    private final BookingRepository bookingRepository;

    /**
     * Processes a new attendee attached to a booking. 
     * Performs strict mathematical validations to ensure no more attendees are added 
     * than there are seats permitted under the referenced booking ID.
     */
    public Attendee add(Long bookingId, Attendee req) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + bookingId));

        // Enforce physical constraints: Attendee count cannot bypass the purchased seat allowance.
        if (booking.getNumberOfSeats() <= attendeeRepository.findByBooking_Id(bookingId).size()) {
            throw new IllegalArgumentException("No seats available for booking: " + bookingId);
        }

        Attendee attendee = Attendee.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .booking(booking)
                .build();

        return attendeeRepository.save(attendee);
    }

    /**
     * Yields the precise array of attendees associated with a targeted booking context.
     */
    public List<Attendee> getByBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new EntityNotFoundException("Booking not found: " + bookingId);
        }
        return attendeeRepository.findByBooking_Id(bookingId);
    }

    /**
     * Looks up an individual attendee directly without walking upwards through the booking domain.
     */
    public Attendee getById(Long id) {
        return attendeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Attendee not found: " + id));
    }

    /**
     * Drops an attendee from the database system.
     */
    public void delete(Long id) {
        if (!attendeeRepository.existsById(id)) {
            throw new EntityNotFoundException("Attendee not found: " + id);
        }
        attendeeRepository.deleteById(id);
    }
}
