package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class VendorTest {

    @Test
    void testVendorBuilderAndGetters() {
        Venue venue = Venue.builder().id(1L).build();
        Vendor vendor = Vendor.builder()
                .id(1L)
                .name("Catering Pro")
                .serviceType("Catering")
                .venue(venue)
                .build();

        assertEquals(1L, vendor.getId());
        assertEquals("Catering Pro", vendor.getName());
        assertEquals("Catering", vendor.getServiceType());
        assertEquals(venue, vendor.getVenue());
        assertEquals(1L, vendor.getVenueId());
    }

    @Test
    void testVendorSetters() {
        Vendor vendor = new Vendor();
        vendor.setName("Music Group");
        assertEquals("Music Group", vendor.getName());
    }

    @Test
    void testGetVenueIdWithNullVenue() {
        Vendor vendor = new Vendor();
        assertNull(vendor.getVenueId());
    }
}
