package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class BookingTest {

    @Test
    void testBookingBuilderAndGetters() {
        Event event = Event.builder().id(10L).build();
        User user = User.builder().id(20L).build();
        LocalDateTime now = LocalDateTime.now();

        Booking booking = Booking.builder()
                .id(1L)
                .event(event)
                .user(user)
                .bookingDate(now)
                .numberOfSeats(2)
                .status(Booking.Status.APPROVED)
                .attendees(new ArrayList<>())
                .build();

        assertEquals(1L, booking.getId());
        assertEquals(event, booking.getEvent());
        assertEquals(user, booking.getUser());
        assertEquals(now, booking.getBookingDate());
        assertEquals(2, booking.getNumberOfSeats());
        assertEquals(Booking.Status.APPROVED, booking.getStatus());
        assertNotNull(booking.getAttendees());
        assertEquals(10L, booking.getEventId());
        assertEquals(20L, booking.getUserId());
    }

    @Test
    void testBookingSetters() {
        Booking booking = new Booking();
        booking.setId(2L);
        booking.setStatus(Booking.Status.REJECTED);

        assertEquals(2L, booking.getId());
        assertEquals(Booking.Status.REJECTED, booking.getStatus());
    }

    @Test
    void testGetIdsWithNullRelations() {
        Booking booking = new Booking();
        assertNull(booking.getEventId());
        assertNull(booking.getUserId());
    }
}
