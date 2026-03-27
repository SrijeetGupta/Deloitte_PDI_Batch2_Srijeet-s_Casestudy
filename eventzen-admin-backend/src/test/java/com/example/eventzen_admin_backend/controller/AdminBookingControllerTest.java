package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.entity.Booking;
import com.example.eventzen_admin_backend.service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.MediaType;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AdminBookingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookingService bookingService;

    @InjectMocks
    private AdminBookingController adminBookingController;

    private Booking pendingBooking;
    private Booking approvedBooking;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(adminBookingController).build();
        pendingBooking = new Booking();
        pendingBooking.setId(1L);
        pendingBooking.setStatus(Booking.Status.PENDING);

        approvedBooking = new Booking();
        approvedBooking.setId(1L);
        approvedBooking.setStatus(Booking.Status.APPROVED);
    }

    

    @Test
    @DisplayName("GET /admin/bookings – returns 200 with list of bookings")
    void getAllBookings_returnsOk() throws Exception {
        when(bookingService.getAllAdmin()).thenReturn(List.of(pendingBooking));

        mockMvc.perform(get("/admin/bookings").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    

    @Test
    @DisplayName("PUT /admin/bookings/{id}/approve – returns 200 with approved booking")
    void approveBooking_returnsOk() throws Exception {
        when(bookingService.approve(1L)).thenReturn(approvedBooking);

        mockMvc.perform(put("/admin/bookings/1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    @DisplayName("PUT /admin/bookings/{id}/approve – returns 404 when booking not found")
    void approveBooking_notFound() throws Exception {
        when(bookingService.approve(99L)).thenThrow(new EntityNotFoundException("Booking not found: 99"));

        mockMvc.perform(put("/admin/bookings/99/approve"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("PUT /admin/bookings/{id}/reject – returns 200 with rejected booking")
    void rejectBooking_returnsOk() throws Exception {
        Booking rejected = new Booking();
        rejected.setId(1L);
        rejected.setStatus(Booking.Status.REJECTED);
        when(bookingService.reject(1L)).thenReturn(rejected);

        mockMvc.perform(put("/admin/bookings/1/reject"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }

    @Test
    @DisplayName("PUT /admin/bookings/{id}/reject – returns 404 when booking not found")
    void rejectBooking_notFound() throws Exception {
        when(bookingService.reject(99L)).thenThrow(new EntityNotFoundException("Booking not found: 99"));

        mockMvc.perform(put("/admin/bookings/99/reject"))
                .andExpect(status().isNotFound());
    }
}
