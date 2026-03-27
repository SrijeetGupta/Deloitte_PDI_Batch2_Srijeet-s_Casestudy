package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueService venueService;

    private Venue sampleVenue;

    @BeforeEach
    void setUp() {
        sampleVenue = Venue.builder()
                .id(1L)
                .name("Grand Hall")
                .location("Mumbai")
                .capacity(500)
                .pricePerHour(1500.0)
                .build();
    }

    

    @Test
    @DisplayName("getAll – calls findAll when no filters provided")
    void getAll_noFilters() {
        when(venueRepository.findAll()).thenReturn(List.of(sampleVenue));

        List<Venue> result = venueService.getAll(null, null);

        assertThat(result).hasSize(1);
        verify(venueRepository).findAll();
        verify(venueRepository, never()).findByFilters(any(), any());
    }

    @Test
    @DisplayName("getAll – calls findByFilters when location provided")
    void getAll_withLocation() {
        when(venueRepository.findByFilters("Mumbai", null)).thenReturn(List.of(sampleVenue));

        List<Venue> result = venueService.getAll("Mumbai", null);

        assertThat(result).hasSize(1);
        verify(venueRepository).findByFilters("Mumbai", null);
    }

    @Test
    @DisplayName("getAll – calls findByFilters when capacity provided")
    void getAll_withCapacity() {
        when(venueRepository.findByFilters(null, 500)).thenReturn(List.of(sampleVenue));

        List<Venue> result = venueService.getAll(null, 500);

        assertThat(result).hasSize(1);
        verify(venueRepository).findByFilters(null, 500);
    }

    @Test
    @DisplayName("getAll – calls findByFilters when both location and capacity provided")
    void getAll_withBothFilters() {
        when(venueRepository.findByFilters("Mumbai", 500)).thenReturn(List.of(sampleVenue));

        List<Venue> result = venueService.getAll("Mumbai", 500);

        assertThat(result).hasSize(1);
        verify(venueRepository).findByFilters("Mumbai", 500);
    }

    

    @Test
    @DisplayName("getById – returns venue when found")
    void getById_found() {
        when(venueRepository.findById(1L)).thenReturn(Optional.of(sampleVenue));

        Venue result = venueService.getById(1L);

        assertThat(result.getName()).isEqualTo("Grand Hall");
    }

    @Test
    @DisplayName("getById – throws EntityNotFoundException when venue not found")
    void getById_notFound() {
        when(venueRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> venueService.getById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("create – saves and returns venue")
    void create_success() {
        when(venueRepository.save(sampleVenue)).thenReturn(sampleVenue);

        Venue result = venueService.create(sampleVenue);

        assertThat(result.getName()).isEqualTo("Grand Hall");
        verify(venueRepository).save(sampleVenue);
    }

    

    @Test
    @DisplayName("update – updates fields that are non-null")
    void update_success() {
        Venue updated = Venue.builder()
                .name("New Name")
                .location("Pune")
                .capacity(300)
                .pricePerHour(2000.0)
                .build();

        when(venueRepository.findById(1L)).thenReturn(Optional.of(sampleVenue));
        when(venueRepository.save(any(Venue.class))).thenAnswer(inv -> inv.getArgument(0));

        Venue result = venueService.update(1L, updated);

        assertThat(result.getName()).isEqualTo("New Name");
        assertThat(result.getLocation()).isEqualTo("Pune");
        assertThat(result.getCapacity()).isEqualTo(300);
        assertThat(result.getPricePerHour()).isEqualTo(2000.0);
    }

    @Test
    @DisplayName("update – throws EntityNotFoundException when venue not found")
    void update_notFound() {
        when(venueRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> venueService.update(99L, sampleVenue))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("delete – deletes venue when exists")
    void delete_success() {
        when(venueRepository.existsById(1L)).thenReturn(true);

        venueService.delete(1L);

        verify(venueRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete – throws EntityNotFoundException when venue not found")
    void delete_notFound() {
        when(venueRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> venueService.delete(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(venueRepository, never()).deleteById(any());
    }
}
