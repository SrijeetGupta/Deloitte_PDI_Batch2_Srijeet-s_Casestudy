package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.BookingRequest;
import com.example.eventzen_user_backend.entity.Booking;
import com.example.eventzen_user_backend.security.JwtUtil;
import com.example.eventzen_user_backend.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BookingService bookingService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private BookingController bookingController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(bookingController).build();
    }

    @Test
    void create_Success() throws Exception {
        BookingRequest req = new BookingRequest();
        Booking resp = Booking.builder().id(1L).status(Booking.Status.PENDING).build();
        when(bookingService.create(any(BookingRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void approve_Success() throws Exception {
        Booking resp = Booking.builder().id(1L).status(Booking.Status.APPROVED).build();
        when(bookingService.approve(1L)).thenReturn(resp);

        mockMvc.perform(put("/admin/bookings/1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }
}
