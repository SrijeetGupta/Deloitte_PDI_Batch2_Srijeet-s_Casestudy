package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.entity.Attendee;
import com.example.eventzen_user_backend.security.JwtUtil;
import com.example.eventzen_user_backend.service.AttendeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AttendeeControllerTest {
    private MockMvc mockMvc;

    @Mock
    private AttendeeService attendeeService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AttendeeController attendeeController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(attendeeController).build();
    }

    @Test
    void add_Success() throws Exception {
        Attendee attendee = Attendee.builder().id(1L).name("John").build();
        when(attendeeService.add(eq(1L), any(Attendee.class))).thenReturn(attendee);

        mockMvc.perform(post("/attendees")
                        .param("bookingId", "1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(attendee)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("John"));
    }

    @Test
    void getByBooking_Success() throws Exception {
        when(attendeeService.getByBooking(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/attendees").param("bookingId", "1"))
                .andExpect(status().isOk());
    }
}
