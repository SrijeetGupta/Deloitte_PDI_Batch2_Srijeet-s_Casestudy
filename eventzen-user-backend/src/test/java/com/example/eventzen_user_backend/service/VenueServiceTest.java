package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueService venueService;

    @Test
    void getAll_NoFilters_Success() {
        when(venueRepository.findAll()).thenReturn(Collections.emptyList());
        List<Venue> result = venueService.getAll(null, null);
        assertNotNull(result);
        verify(venueRepository).findAll();
    }

    @Test
    void getAll_WithFilters_Success() {
        when(venueRepository.findByFilters("London", 100)).thenReturn(Collections.emptyList());
        List<Venue> result = venueService.getAll("London", 100);
        assertNotNull(result);
        verify(venueRepository).findByFilters("London", 100);
    }

    @Test
    void update_Success() {
        Venue venue = Venue.builder().id(1L).name("Old").build();
        Venue updateReq = Venue.builder().name("New").build();

        when(venueRepository.findById(1L)).thenReturn(Optional.of(venue));
        when(venueRepository.save(any(Venue.class))).thenAnswer(i -> i.getArguments()[0]);

        Venue result = venueService.update(1L, updateReq);

        assertEquals("New", result.getName());
    }
}
