package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.entity.VenueAvailability;
import com.example.eventzen_user_backend.repository.VenueAvailabilityRepository;
import com.example.eventzen_user_backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueAvailabilityServiceTest {

    @Mock
    private VenueAvailabilityRepository availabilityRepository;
    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueAvailabilityService availabilityService;

    @Test
    void update_CreatesNewSlot_Success() {
        Long venueId = 1L;
        LocalDate date = LocalDate.now();
        Venue venue = Venue.builder().id(venueId).build();

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(venue));
        when(availabilityRepository.findByVenue_IdAndDate(venueId, date)).thenReturn(Optional.empty());
        when(availabilityRepository.save(any(VenueAvailability.class))).thenAnswer(i -> i.getArguments()[0]);

        VenueAvailability result = availabilityService.update(venueId, date, VenueAvailability.AvailabilityStatus.BOOKED);

        assertEquals(VenueAvailability.AvailabilityStatus.BOOKED, result.getStatus());
        assertEquals(venue, result.getVenue());
        assertEquals(date, result.getDate());
    }

    @Test
    void update_UpdatesExistingSlot_Success() {
        Long venueId = 1L;
        LocalDate date = LocalDate.now();
        VenueAvailability slot = VenueAvailability.builder().id(1L).status(VenueAvailability.AvailabilityStatus.AVAILABLE).build();

        when(venueRepository.findById(venueId)).thenReturn(Optional.of(new Venue()));
        when(availabilityRepository.findByVenue_IdAndDate(venueId, date)).thenReturn(Optional.of(slot));
        when(availabilityRepository.save(any(VenueAvailability.class))).thenAnswer(i -> i.getArguments()[0]);

        VenueAvailability result = availabilityService.update(venueId, date, VenueAvailability.AvailabilityStatus.MAINTENANCE);

        assertEquals(VenueAvailability.AvailabilityStatus.MAINTENANCE, result.getStatus());
    }
}
