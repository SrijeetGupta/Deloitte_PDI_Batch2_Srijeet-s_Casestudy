package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.entity.Event;
import com.example.eventzen_admin_backend.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class EventControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    private Event sampleEvent;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(eventController).build();
        sampleEvent = Event.builder()
                .id(1L)
                .name("Tech Conference")
                .description("Annual tech conference")
                .capacity(200)
                .build();
    }

    

    @Test
    @DisplayName("GET /events – returns 200 with list of events")
    void getAll_returnsOk() throws Exception {
        when(eventService.getAll()).thenReturn(List.of(sampleEvent));

        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Tech Conference"));
    }

    

    @Test
    @DisplayName("GET /events/{id} – returns 200 with event")
    void getById_found() throws Exception {
        when(eventService.getById(1L)).thenReturn(sampleEvent);

        mockMvc.perform(get("/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Tech Conference"));
    }

    @Test
    @DisplayName("GET /events/{id} – returns 404 when event not found")
    void getById_notFound() throws Exception {
        when(eventService.getById(99L)).thenThrow(new EntityNotFoundException("Event not found: 99"));

        mockMvc.perform(get("/events/99"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("POST /events – returns 201 when event created")
    void create_returnsCreated() throws Exception {
        Map<String, Object> body = Map.of("name", "New Event", "capacity", 100);
        when(eventService.create(anyMap())).thenReturn(sampleEvent);

        mockMvc.perform(post("/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Tech Conference"));
    }

    

    @Test
    @DisplayName("PUT /events/{id} – returns 200 with updated event")
    void update_returnsOk() throws Exception {
        Map<String, Object> body = Map.of("name", "Updated Name");
        Event updated = Event.builder().id(1L).name("Updated Name").capacity(200).build();
        when(eventService.update(eq(1L), anyMap())).thenReturn(updated);

        mockMvc.perform(put("/events/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    @DisplayName("PUT /events/{id} – returns 404 when event not found")
    void update_notFound() throws Exception {
        when(eventService.update(eq(99L), anyMap()))
                .thenThrow(new EntityNotFoundException("Event not found: 99"));

        mockMvc.perform(put("/events/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"X\"}"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("DELETE /events/{id} – returns 200 on success")
    void delete_returnsOk() throws Exception {
        doNothing().when(eventService).delete(1L);

        mockMvc.perform(delete("/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /events/{id} – returns 404 when event not found")
    void delete_notFound() throws Exception {
        doThrow(new EntityNotFoundException("Event not found: 99")).when(eventService).delete(99L);

        mockMvc.perform(delete("/events/99"))
                .andExpect(status().isNotFound());
    }
}
