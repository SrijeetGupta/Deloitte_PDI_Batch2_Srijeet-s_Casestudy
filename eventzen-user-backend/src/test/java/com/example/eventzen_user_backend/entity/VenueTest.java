package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.*;

class VenueTest {

    @Test
    void testVenueBuilderAndGetters() {
        Venue venue = Venue.builder()
                .id(1L)
                .name("Grand Hall")
                .location("Downtown")
                .capacity(500)
                .pricePerHour(100.0)
                .vendors(new ArrayList<>())
                .availabilities(new ArrayList<>())
                .events(new ArrayList<>())
                .build();

        assertEquals(1L, venue.getId());
        assertEquals("Grand Hall", venue.getName());
        assertEquals("Downtown", venue.getLocation());
        assertEquals(500, venue.getCapacity());
        assertEquals(100.0, venue.getPricePerHour());
        assertNotNull(venue.getVendors());
        assertNotNull(venue.getAvailabilities());
        assertNotNull(venue.getEvents());
    }

    @Test
    void testVenueSetters() {
        Venue venue = new Venue();
        venue.setCapacity(200);
        assertEquals(200, venue.getCapacity());
    }
}
