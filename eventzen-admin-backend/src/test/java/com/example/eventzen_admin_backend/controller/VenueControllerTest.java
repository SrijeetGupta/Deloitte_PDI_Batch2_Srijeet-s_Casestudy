package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.service.VenueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class VenueControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private VenueService venueService;

    @InjectMocks
    private VenueController venueController;

    private Venue sampleVenue;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(venueController).build();
        sampleVenue = Venue.builder()
                .id(1L)
                .name("Grand Hall")
                .location("Mumbai")
                .capacity(500)
                .pricePerHour(1500.0)
                .build();
    }

    

    @Test
    @DisplayName("GET /venues – returns 200 with all venues (no filters)")
    void getAll_noFilters() throws Exception {
        when(venueService.getAll(null, null)).thenReturn(List.of(sampleVenue));

        mockMvc.perform(get("/venues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Grand Hall"));
    }

    @Test
    @DisplayName("GET /venues?location=Mumbai – returns 200 filtered list")
    void getAll_withLocation() throws Exception {
        when(venueService.getAll("Mumbai", null)).thenReturn(List.of(sampleVenue));

        mockMvc.perform(get("/venues").param("location", "Mumbai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].location").value("Mumbai"));
    }

    

    @Test
    @DisplayName("GET /venues/{id} – returns 200 with venue")
    void getById_found() throws Exception {
        when(venueService.getById(1L)).thenReturn(sampleVenue);

        mockMvc.perform(get("/venues/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.capacity").value(500));
    }

    @Test
    @DisplayName("GET /venues/{id} – returns 404 when not found")
    void getById_notFound() throws Exception {
        when(venueService.getById(99L)).thenThrow(new EntityNotFoundException("Venue not found: 99"));

        mockMvc.perform(get("/venues/99"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("POST /venues – returns 201 when venue created")
    void create_returnsCreated() throws Exception {
        when(venueService.create(any(Venue.class))).thenReturn(sampleVenue);

        mockMvc.perform(post("/venues")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleVenue)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Grand Hall"));
    }

    

    @Test
    @DisplayName("PUT /venues/{id} – returns 200 with updated venue")
    void update_returnsOk() throws Exception {
        Venue updated = Venue.builder().id(1L).name("New Hall").location("Pune").capacity(300).pricePerHour(2000.0)
                .build();
        when(venueService.update(eq(1L), any(Venue.class))).thenReturn(updated);

        mockMvc.perform(put("/venues/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Hall"));
    }

    @Test
    @DisplayName("PUT /venues/{id} – returns 404 when venue not found")
    void update_notFound() throws Exception {
        when(venueService.update(eq(99L), any(Venue.class)))
                .thenThrow(new EntityNotFoundException("Venue not found: 99"));

        mockMvc.perform(put("/venues/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleVenue)))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("DELETE /venues/{id} – returns 200 on success")
    void delete_returnsOk() throws Exception {
        doNothing().when(venueService).delete(1L);

        mockMvc.perform(delete("/venues/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /venues/{id} – returns 404 when not found")
    void delete_notFound() throws Exception {
        doThrow(new EntityNotFoundException("Venue not found: 99")).when(venueService).delete(99L);

        mockMvc.perform(delete("/venues/99"))
                .andExpect(status().isNotFound());
    }
}
