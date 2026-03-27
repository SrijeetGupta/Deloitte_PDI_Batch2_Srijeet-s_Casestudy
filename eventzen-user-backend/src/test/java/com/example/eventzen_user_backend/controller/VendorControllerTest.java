package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.security.JwtUtil;
import com.example.eventzen_user_backend.service.VendorService;
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
class VendorControllerTest {

    private MockMvc mockMvc;

    @Mock
    private VendorService vendorService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private VendorController vendorController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(vendorController).build();
    }

    @Test
    void getByVenue_Success() throws Exception {
        when(vendorService.getByVenue(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/vendors").param("venueId", "1"))
                .andExpect(status().isOk());
    }
}
