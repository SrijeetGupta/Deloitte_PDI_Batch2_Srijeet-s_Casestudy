package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class VenueAvailabilityTest {

    @Test
    void testVenueAvailabilityBuilderAndGetters() {
        Venue venue = Venue.builder().id(1L).build();
        LocalDate date = LocalDate.now();
        VenueAvailability availability = VenueAvailability.builder()
                .id(1L)
                .venue(venue)
                .date(date)
                .status(VenueAvailability.AvailabilityStatus.BOOKED)
                .build();

        assertEquals(1L, availability.getId());
        assertEquals(venue, availability.getVenue());
        assertEquals(date, availability.getDate());
        assertEquals(VenueAvailability.AvailabilityStatus.BOOKED, availability.getStatus());
        assertEquals(1L, availability.getVenueId());
    }

    @Test
    void testVenueAvailabilitySetters() {
        VenueAvailability availability = new VenueAvailability();
        availability.setStatus(VenueAvailability.AvailabilityStatus.MAINTENANCE);
        assertEquals(VenueAvailability.AvailabilityStatus.MAINTENANCE, availability.getStatus());
    }

    @Test
    void testDefaultStatus() {
        VenueAvailability availability = new VenueAvailability();
        
        
        
        assertEquals(VenueAvailability.AvailabilityStatus.AVAILABLE, availability.getStatus());
    }

    @Test
    void testGetVenueIdWithNullVenue() {
        VenueAvailability availability = new VenueAvailability();
        assertNull(availability.getVenueId());
    }
}
