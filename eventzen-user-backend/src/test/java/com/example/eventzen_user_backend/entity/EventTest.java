package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class EventTest {

    @Test
    void testEventBuilderAndGetters() {
        Venue venue = Venue.builder().id(1L).build();
        LocalDateTime now = LocalDateTime.now();
        Event event = Event.builder()
                .id(1L)
                .name("Conference")
                .description("Annual Tech Conference")
                .eventDate(now)
                .capacity(100)
                .venue(venue)
                .bookings(new ArrayList<>())
                .build();

        assertEquals(1L, event.getId());
        assertEquals("Conference", event.getName());
        assertEquals("Annual Tech Conference", event.getDescription());
        assertEquals(now, event.getEventDate());
        assertEquals(100, event.getCapacity());
        assertEquals(venue, event.getVenue());
        assertNotNull(event.getBookings());
        assertEquals(1L, event.getVenueId());
    }

    @Test
    void testEventSetters() {
        Event event = new Event();
        event.setName("Workshop");
        assertEquals("Workshop", event.getName());
    }

    @Test
    void testGetVenueIdWithNullVenue() {
        Event event = new Event();
        assertNull(event.getVenueId());
    }
}
