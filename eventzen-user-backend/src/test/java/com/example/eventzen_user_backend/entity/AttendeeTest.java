package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AttendeeTest {

    @Test
    void testAttendeeBuilderAndGetters() {
        Booking booking = Booking.builder().id(1L).build();
        Attendee attendee = Attendee.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .phone("1234567890")
                .booking(booking)
                .build();

        assertEquals(1L, attendee.getId());
        assertEquals("John Doe", attendee.getName());
        assertEquals("john@example.com", attendee.getEmail());
        assertEquals("1234567890", attendee.getPhone());
        assertEquals(booking, attendee.getBooking());
        assertEquals(1L, attendee.getBookingId());
    }

    @Test
    void testAttendeeSetters() {
        Attendee attendee = new Attendee();
        attendee.setId(2L);
        attendee.setName("Jane Doe");
        attendee.setEmail("jane@example.com");
        attendee.setPhone("0987654321");

        assertEquals(2L, attendee.getId());
        assertEquals("Jane Doe", attendee.getName());
        assertEquals("jane@example.com", attendee.getEmail());
        assertEquals("0987654321", attendee.getPhone());
    }

    @Test
    void testGetBookingIdWithNullBooking() {
        Attendee attendee = new Attendee();
        assertNull(attendee.getBookingId());
    }
}
