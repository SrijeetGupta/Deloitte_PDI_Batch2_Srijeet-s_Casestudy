package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Attendee;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.repository.AttendeeRepository;
import com.example.eventzen_user_backend.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
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
class AttendeeServiceTest {

    @Mock
    private AttendeeRepository attendeeRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private AttendeeService attendeeService;

    @Test
    void add_Success() {
        Long bookingId = 1L;
        Attendee req = Attendee.builder().name("John").email("john@test.com").phone("123").build();
        Booking booking = Booking.builder().id(bookingId).numberOfSeats(2).build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(attendeeRepository.findByBooking_Id(bookingId)).thenReturn(Collections.emptyList());
        when(attendeeRepository.save(any(Attendee.class))).thenAnswer(i -> i.getArguments()[0]);

        Attendee result = attendeeService.add(bookingId, req);

        assertNotNull(result);
        assertEquals("John", result.getName());
        verify(attendeeRepository).save(any(Attendee.class));
    }

    @Test
    void add_NoSeatsAvailable_ThrowsException() {
        Long bookingId = 1L;
        Attendee req = Attendee.builder().name("John").build();
        Booking booking = Booking.builder().id(bookingId).numberOfSeats(1).build();

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(attendeeRepository.findByBooking_Id(bookingId)).thenReturn(List.of(new Attendee()));

        assertThrows(IllegalArgumentException.class, () -> attendeeService.add(bookingId, req));
    }

    @Test
    void getByBooking_Success() {
        Long bookingId = 1L;
        when(bookingRepository.existsById(bookingId)).thenReturn(true);
        when(attendeeRepository.findByBooking_Id(bookingId)).thenReturn(Collections.emptyList());

        List<Attendee> result = attendeeService.getByBooking(bookingId);

        assertNotNull(result);
        verify(attendeeRepository).findByBooking_Id(bookingId);
    }

    @Test
    void getById_NotFound_ThrowsException() {
        when(attendeeRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> attendeeService.getById(1L));
    }

    @Test
    void delete_Success() {
        when(attendeeRepository.existsById(1L)).thenReturn(true);
        attendeeService.delete(1L);
        verify(attendeeRepository).deleteById(1L);
    }
}
