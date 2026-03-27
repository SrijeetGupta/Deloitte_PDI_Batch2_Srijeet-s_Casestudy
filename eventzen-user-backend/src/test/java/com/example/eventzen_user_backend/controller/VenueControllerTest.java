package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.security.JwtUtil;
import com.example.eventzen_user_backend.service.VenueService;
import com.example.eventzen_user_backend.service.VenueAvailabilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VenueControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VenueService venueService;

    @Mock
    private VenueAvailabilityService availabilityService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private VenueController venueController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(venueController).build();
    }

    @Test
    void getAll_Success() throws Exception {
        when(venueService.getAll(null, null)).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/venues"))
                .andExpect(status().isOk());
    }
}
