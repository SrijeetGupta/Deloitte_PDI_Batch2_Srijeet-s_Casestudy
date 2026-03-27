package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.BookingRequest;
import com.example.eventzen_user_backend.entity.Attendee;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.BookingRepository;
import com.example.eventzen_user_backend.repository.EventRepository;
import com.example.eventzen_user_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class handling all business logic related to Bookings.
 * This includes creating, fetching, cancelling, approving, and rejecting bookings.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * Helper method to retrieve the currently authenticated User.
     * Uses the SecurityContext to get the email and fetches the explicit User record.
     * 
     * @return User object of the currently logged-in user
     * @throws EntityNotFoundException if the user cannot be found in the database
     */
    private User currentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Authenticated user not found"));
    }

    /**
     * Creates a new booking for an event by the currently authenticated user.
     * 
     * @param req Data Transfer Object containing event details and requested seats
     * @return The newly created Booking entity in a PENDING status
     * @throws IllegalArgumentException if the event ID is missing
     * @throws EntityNotFoundException if the target event does not exist
     */
    public Booking create(BookingRequest req) {
        Long eventId = req.getEvent() != null ? req.getEvent().getId() : null;
        if (eventId == null)
            throw new IllegalArgumentException("event.id is required");

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));

        User user = currentUser();

        // Build the booking entity with a default PENDING status
        Booking booking = Booking.builder()
                .event(event)
                .user(user)
                .bookingDate(req.getBookingDate() != null ? req.getBookingDate() : LocalDateTime.now())
                .numberOfSeats(req.getNumberOfSeats())
                .status(Booking.Status.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    /**
     * Retrieves all bookings made by the currently authenticated user.
     * 
     * @return A list of Booking entities belonging to the current user
     */
    public List<Booking> getMyBookings() {
        return bookingRepository.findByUser_Id(currentUser().getId());
    }

    /**
     * Retrieves a specific booking by its ID.
     * Enforces access control: Users can only view their own bookings, while Admins can view any.
     * 
     * @param id The ID of the booking to retrieve
     * @return The requested Booking entity
     * @throws EntityNotFoundException if the booking does not exist
     * @throws IllegalArgumentException if the current user lacks permission to view the booking
     */
    public Booking getById(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
        User user = currentUser();
        
        // Authorization check: Ensure user owns the booking or has ADMIN privileges
        if (!b.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Access denied to booking " + id);
        }
        return b;
    }

    /**
     * Cancels a specific booking.
     * 
     * @param id The ID of the booking to cancel
     * @return The updated Booking entity with CANCELLED status
     * @throws IllegalArgumentException if the booking is already cancelled
     */
    public Booking cancel(Long id) {
        Booking b = getById(id);
        if (b.getStatus() == Booking.Status.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        
        b.setStatus(Booking.Status.CANCELLED);
        return bookingRepository.save(b);
    }

    /**
     * Retrieves all bookings in the system. Intended for Admin use only.
     * 
     * @return A list of all Booking entities
     */
    public List<Booking> getAllAdmin() {
        return bookingRepository.findAll();
    }

    /**
     * Approves a specific booking. 
     * Once approved, an Attendee record is automatically generated for the user.
     * 
     * @param id The ID of the booking to approve
     * @return The updated Booking entity with APPROVED status and a new Attendee linked
     * @throws EntityNotFoundException if the booking does not exist
     * @throws IllegalArgumentException if the booking is already approved
     */
    public Booking approve(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));

        if (b.getStatus() == Booking.Status.APPROVED) {
            throw new IllegalArgumentException("Booking is already approved");
        }

        b.setStatus(Booking.Status.APPROVED);

        User user = b.getUser();
        
        // Automatically create an Attendee record to link the verified user to the event
        Attendee attendee = Attendee.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .booking(b)
                .build();

        // Ensure the attendees list is initialized before adding
        if (b.getAttendees() == null) {
            b.setAttendees(new java.util.ArrayList<>());
        }
        b.getAttendees().add(attendee);

        return bookingRepository.save(b);
    }

    /**
     * Rejects a specific booking.
     * 
     * @param id The ID of the booking to reject
     * @return The updated Booking entity with REJECTED status
     * @throws EntityNotFoundException if the booking does not exist
     */
    public Booking reject(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found: " + id));
                
        b.setStatus(Booking.Status.REJECTED);
        return bookingRepository.save(b);
    }
}
