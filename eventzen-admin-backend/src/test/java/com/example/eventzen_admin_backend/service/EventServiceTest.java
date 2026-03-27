package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.entity.Event;
import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.repository.EventRepository;
import com.example.eventzen_admin_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private EventService eventService;

    private Event sampleEvent;
    private Venue sampleVenue;

    @BeforeEach
    void setUp() {
        sampleVenue = Venue.builder()
                .id(10L)
                .name("Grand Hall")
                .location("Mumbai")
                .capacity(500)
                .build();

        sampleEvent = Event.builder()
                .id(1L)
                .name("Tech Conference")
                .description("Annual tech conference")
                .capacity(200)
                .venue(sampleVenue)
                .build();
    }

    

    @Test
    @DisplayName("getAll – returns all events from repository")
    void getAll_returnsList() {
        when(eventRepository.findAll()).thenReturn(List.of(sampleEvent));

        List<Event> result = eventService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Tech Conference");
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll – returns empty list when no events")
    void getAll_empty() {
        when(eventRepository.findAll()).thenReturn(List.of());

        List<Event> result = eventService.getAll();

        assertThat(result).isEmpty();
    }

    

    @Test
    @DisplayName("getById – returns event when found")
    void getById_found() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));

        Event result = eventService.getById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Tech Conference");
    }

    @Test
    @DisplayName("getById – throws EntityNotFoundException when event not found")
    void getById_notFound() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.getById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("create – creates event with name, description, capacity")
    void create_basicFields() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "New Event");
        body.put("description", "A new event");
        body.put("capacity", 100);

        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> {
            Event e = inv.getArgument(0);
            e.setId(5L);
            return e;
        });

        Event result = eventService.create(body);

        assertThat(result.getName()).isEqualTo("New Event");
        assertThat(result.getDescription()).isEqualTo("A new event");
        assertThat(result.getCapacity()).isEqualTo(100);
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    @DisplayName("create – resolves and assigns venue when venueId is provided")
    void create_withVenueId() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Event With Venue");
        body.put("venueId", 10L);

        when(venueRepository.findById(10L)).thenReturn(Optional.of(sampleVenue));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));

        Event result = eventService.create(body);

        assertThat(result.getVenue()).isNotNull();
        assertThat(result.getVenue().getId()).isEqualTo(10L);
        verify(venueRepository).findById(10L);
    }

    @Test
    @DisplayName("create – throws EntityNotFoundException when venueId is invalid")
    void create_invalidVenueId() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Bad Event");
        body.put("venueId", 999L);

        when(venueRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.create(body))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("999");
    }

    @Test
    @DisplayName("create – parses eventDate ISO string")
    void create_withEventDate() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Dated Event");
        body.put("eventDate", "2025-12-25T10:00:00");

        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));

        Event result = eventService.create(body);

        assertThat(result.getEventDate()).isNotNull();
        assertThat(result.getEventDate().getYear()).isEqualTo(2025);
    }

    

    @Test
    @DisplayName("update – updates event fields")
    void update_success() {
        Map<String, Object> body = new HashMap<>();
        body.put("name", "Updated Name");
        body.put("capacity", 300);

        when(eventRepository.findById(1L)).thenReturn(Optional.of(sampleEvent));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));

        Event result = eventService.update(1L, body);

        assertThat(result.getName()).isEqualTo("Updated Name");
        assertThat(result.getCapacity()).isEqualTo(300);
    }

    @Test
    @DisplayName("update – throws EntityNotFoundException when event not found")
    void update_notFound() {
        when(eventRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.update(99L, Map.of("name", "X")))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("delete – deletes event when exists")
    void delete_success() {
        when(eventRepository.existsById(1L)).thenReturn(true);

        eventService.delete(1L);

        verify(eventRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete – throws EntityNotFoundException when event not found")
    void delete_notFound() {
        when(eventRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> eventService.delete(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(eventRepository, never()).deleteById(any());
    }
}
