package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.security.JwtUtil;
import com.example.eventzen_user_backend.service.EventService;
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

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EventService eventService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private EventController eventController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(eventController).build();
    }

    @Test
    void getAll_Success() throws Exception {
        when(eventService.getAll()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/events"))
                .andExpect(status().isOk());
    }

    @Test
    void create_Success() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Event");

        Event event = Event.builder().id(1L).name("Event").build();
        when(eventService.create(any())).thenReturn(event);

        mockMvc.perform(post("/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Event"));
    }
}
