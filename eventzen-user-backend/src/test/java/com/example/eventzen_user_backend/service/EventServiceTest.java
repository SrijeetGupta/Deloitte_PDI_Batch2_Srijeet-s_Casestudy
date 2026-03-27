package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.EventRepository;
import com.example.eventzen_user_backend.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;
    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void create_Success() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "New Event");
        body.put("venueId", 1L);

        Venue venue = Venue.builder().id(1L).build();
        when(venueRepository.findById(1L)).thenReturn(Optional.of(venue));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArguments()[0]);

        Event result = eventService.create(body);

        assertEquals("New Event", result.getName());
        assertEquals(venue, result.getVenue());
    }

    @Test
    void update_Success() {
        Event event = Event.builder().id(1L).name("Old").build();
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Updated");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArguments()[0]);

        Event result = eventService.update(1L, body);

        assertEquals("Updated", result.getName());
    }
}
