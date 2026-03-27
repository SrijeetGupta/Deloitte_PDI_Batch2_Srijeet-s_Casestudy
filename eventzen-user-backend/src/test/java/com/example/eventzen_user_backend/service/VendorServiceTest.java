package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Vendor;
import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.VendorRepository;
import com.example.eventzen_user_backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;
    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VendorService vendorService;

    @Test
    void create_Success() {
        Long venueId = 1L;
        Vendor req = Vendor.builder().name("Vendor").build();
        Venue venue = Venue.builder().id(venueId).build();

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(venue));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(i -> i.getArguments()[0]);

        Vendor result = vendorService.create(venueId, req);

        assertEquals("Vendor", result.getName());
        assertEquals(venue, result.getVenue());
    }

    @Test
    void update_Success() {
        Vendor vendor = Vendor.builder().id(1L).name("Old").build();
        Vendor req = Vendor.builder().name("New").build();

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(vendor));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(i -> i.getArguments()[0]);

        Vendor result = vendorService.update(1L, req, null);

        assertEquals("New", result.getName());
    }
}
