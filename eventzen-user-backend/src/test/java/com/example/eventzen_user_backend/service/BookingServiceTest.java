package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.BookingRequest;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.BookingRepository;
import com.example.eventzen_user_backend.repository.EventRepository;
import com.example.eventzen_user_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setupSecurity() {
        SecurityContextHolder.setContext(securityContext);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
    }

    @Test
    void create_Success() {
        BookingRequest req = new BookingRequest();
        BookingRequest.EventRef eventRef = new BookingRequest.EventRef();
        eventRef.setId(1L);
        req.setEvent(eventRef);
        req.setNumberOfSeats(2);

        User user = User.builder().id(1L).email("test@test.com").build();
        Event event = Event.builder().id(1L).build();

        when(authentication.getName()).thenReturn("test@test.com");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArguments()[0]);

        Booking result = bookingService.create(req);

        assertNotNull(result);
        assertEquals(Booking.Status.PENDING, result.getStatus());
        assertEquals(user, result.getUser());
    }

    @Test
    void approve_Success() {
        User user = User.builder().id(1L).name("User").build();
        Booking booking = Booking.builder().id(1L).user(user).status(Booking.Status.PENDING).build();

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArguments()[0]);

        Booking result = bookingService.approve(1L);

        assertEquals(Booking.Status.APPROVED, result.getStatus());
        assertNotNull(result.getAttendees());
        assertEquals(1, result.getAttendees().size());
    }
}
