package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Vendor;
import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.repository.VendorRepository;
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
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VendorService vendorService;

    private Venue sampleVenue;
    private Vendor sampleVendor;

    @BeforeEach
    void setUp() {
        sampleVenue = Venue.builder()
                .id(10L)
                .name("Grand Hall")
                .build();

        sampleVendor = Vendor.builder()
                .id(1L)
                .name("Catering Co.")
                .serviceType("Catering")
                .venue(sampleVenue)
                .build();
    }

    

    @Test
    @DisplayName("create – creates vendor linked to given venue")
    void create_success() {
        Vendor req = Vendor.builder().name("DJ Services").serviceType("Music").build();

        when(venueRepository.findById(10L)).thenReturn(Optional.of(sampleVenue));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        Vendor result = vendorService.create(10L, req);

        assertThat(result.getName()).isEqualTo("DJ Services");
        assertThat(result.getVenue()).isEqualTo(sampleVenue);
        verify(vendorRepository).save(any(Vendor.class));
    }

    @Test
    @DisplayName("create – throws EntityNotFoundException when venue not found")
    void create_venueNotFound() {
        when(venueRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vendorService.create(99L, new Vendor()))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(vendorRepository, never()).save(any());
    }

    

    @Test
    @DisplayName("getByVenue – returns vendors for existing venue")
    void getByVenue_success() {
        when(venueRepository.existsById(10L)).thenReturn(true);
        when(vendorRepository.findByVenue_Id(10L)).thenReturn(List.of(sampleVendor));

        List<Vendor> result = vendorService.getByVenue(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Catering Co.");
    }

    @Test
    @DisplayName("getByVenue – throws EntityNotFoundException when venue not found")
    void getByVenue_venueNotFound() {
        when(venueRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> vendorService.getByVenue(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("getById – returns vendor when found")
    void getById_found() {
        when(vendorRepository.findById(1L)).thenReturn(Optional.of(sampleVendor));

        Vendor result = vendorService.getById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("getById – throws EntityNotFoundException when vendor not found")
    void getById_notFound() {
        when(vendorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vendorService.getById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("update – updates vendor name and serviceType")
    void update_fieldsOnly() {
        Vendor req = Vendor.builder().name("Sound Inc").serviceType("AV").build();

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(sampleVendor));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        Vendor result = vendorService.update(1L, req, null);

        assertThat(result.getName()).isEqualTo("Sound Inc");
        assertThat(result.getServiceType()).isEqualTo("AV");
    }

    @Test
    @DisplayName("update – reassigns venue when venueId is provided")
    void update_withVenueId() {
        Venue newVenue = Venue.builder().id(20L).name("Small Room").build();
        Vendor req = Vendor.builder().name("Sound Inc").build();

        when(vendorRepository.findById(1L)).thenReturn(Optional.of(sampleVendor));
        when(venueRepository.findById(20L)).thenReturn(Optional.of(newVenue));
        when(vendorRepository.save(any(Vendor.class))).thenAnswer(inv -> inv.getArgument(0));

        Vendor result = vendorService.update(1L, req, 20L);

        assertThat(result.getVenue().getId()).isEqualTo(20L);
    }

    @Test
    @DisplayName("update – throws EntityNotFoundException when vendor not found")
    void update_notFound() {
        when(vendorRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vendorService.update(99L, new Vendor(), null))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("delete – deletes vendor when exists")
    void delete_success() {
        when(vendorRepository.existsById(1L)).thenReturn(true);

        vendorService.delete(1L);

        verify(vendorRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete – throws EntityNotFoundException when vendor not found")
    void delete_notFound() {
        when(vendorRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> vendorService.delete(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(vendorRepository, never()).deleteById(any());
    }
}
