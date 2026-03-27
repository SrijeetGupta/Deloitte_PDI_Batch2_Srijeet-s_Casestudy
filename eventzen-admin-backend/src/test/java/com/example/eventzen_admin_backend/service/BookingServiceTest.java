package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Booking;
import com.example.eventzen_admin_backend.repository.BookingRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking pendingBooking;
    private Booking approvedBooking;

    @BeforeEach
    void setUp() {
        pendingBooking = Booking.builder()
                .id(1L)
                .status(Booking.Status.PENDING)
                .build();

        approvedBooking = Booking.builder()
                .id(2L)
                .status(Booking.Status.APPROVED)
                .build();
    }

    

    @Test
    @DisplayName("getAllAdmin – returns all bookings from repository")
    void getAllAdmin_returnsAll() {
        when(bookingRepository.findAll()).thenReturn(List.of(pendingBooking, approvedBooking));

        List<Booking> result = bookingService.getAllAdmin();

        assertThat(result).hasSize(2);
        verify(bookingRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAllAdmin – returns empty list when no bookings exist")
    void getAllAdmin_empty() {
        when(bookingRepository.findAll()).thenReturn(List.of());

        List<Booking> result = bookingService.getAllAdmin();

        assertThat(result).isEmpty();
    }

    

    @Test
    @DisplayName("approve – changes status to APPROVED and saves")
    void approve_success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(pendingBooking));
        when(bookingRepository.save(pendingBooking)).thenReturn(pendingBooking);

        Booking result = bookingService.approve(1L);

        assertThat(result.getStatus()).isEqualTo(Booking.Status.APPROVED);
        verify(bookingRepository).save(pendingBooking);
    }

    @Test
    @DisplayName("approve – throws EntityNotFoundException when booking not found")
    void approve_notFound() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.approve(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    @DisplayName("approve – throws IllegalArgumentException when booking is already APPROVED")
    void approve_alreadyApproved() {
        when(bookingRepository.findById(2L)).thenReturn(Optional.of(approvedBooking));

        assertThatThrownBy(() -> bookingService.approve(2L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already approved");

        verify(bookingRepository, never()).save(any());
    }

    

    @Test
    @DisplayName("reject – changes status to REJECTED and saves")
    void reject_success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(pendingBooking));
        when(bookingRepository.save(pendingBooking)).thenReturn(pendingBooking);

        Booking result = bookingService.reject(1L);

        assertThat(result.getStatus()).isEqualTo(Booking.Status.REJECTED);
        verify(bookingRepository).save(pendingBooking);
    }

    @Test
    @DisplayName("reject – throws EntityNotFoundException when booking not found")
    void reject_notFound() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.reject(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }
}
