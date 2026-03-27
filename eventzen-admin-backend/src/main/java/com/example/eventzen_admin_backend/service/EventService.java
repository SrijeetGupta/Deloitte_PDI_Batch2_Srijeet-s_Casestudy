package com.example.eventzen_admin_backend.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.eventzen_admin_backend.entity.Event;
import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.repository.EventRepository;
import com.example.eventzen_admin_backend.repository.VenueRepository;

import java.util.List;
import java.util.Map;

/**
 * Service class dedicated to Event management for Administrators.
 * Facilitates comprehensive CRUD operations for events, including dynamic field-by-field updates.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    /**
     * Lists all existing events in the platform.
     * 
     * @return Complete List of Event entities
     */
    public List<Event> getAll() {
        return eventRepository.findAll();
    }

    /**
     * Retrieves a single event by its unique ID.
     * 
     * @param id The Event identifier
     * @return The requested Event entity
     * @throws EntityNotFoundException if the event does not exist
     */
    public Event getById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + id));
    }

    /**
     * Creates a new Event based on a generic property map.
     * Using a map allows partial data submission directly from API bodies.
     * 
     * @param body Key-value pairs matching Event attributes
     * @return The newly persisted Event
     */
    public Event create(Map<String, Object> body) {
        Event event = mapBody(new Event(), body);
        return eventRepository.save(event);
    }

    /**
     * Updates an existing event iteratively field-by-field.
     * 
     * @param id The ID of the event to modify
     * @param body The updated key-value properties
     * @return The modified Event entity
     */
    public Event update(Long id, Map<String, Object> body) {
        Event event = getById(id);
        mapBody(event, body);
        return eventRepository.save(event);
    }

    /**
     * Deletes an Event completely from the system.
     * 
     * @param id The ID of the event to delete
     * @throws EntityNotFoundException if the event does not exist prior to deletion
     */
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new EntityNotFoundException("Event not found: " + id);
        }
        eventRepository.deleteById(id);
    }

    /**
     * Helper mapping method to selectively apply Map payload fields to an Event entity.
     * 
     * @param event The target entity
     * @param body The source payload
     * @return The updated entity
     */
    private Event mapBody(Event event, Map<String, Object> body) {
        if (body.containsKey("name"))
            event.setName((String) body.get("name"));
        if (body.containsKey("description"))
            event.setDescription((String) body.get("description"));
        if (body.containsKey("capacity"))
            event.setCapacity(toInt(body.get("capacity")));
            
        // Convert ISO-8601 string to strict LocalDateTime
        if (body.containsKey("eventDate")) {
            String raw = (String) body.get("eventDate");
            if (raw != null && !raw.isBlank()) {
                event.setEventDate(java.time.LocalDateTime.parse(raw));
            }
        }
        
        // Resolve the nested Venue relationship if provided
        if (body.containsKey("venueId")) {
            Long venueId = toLong(body.get("venueId"));
            if (venueId != null) {
                Venue venue = venueRepository.findById(venueId)
                        .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + venueId));
                event.setVenue(venue);
            }
        }
        return event;
    }

    /**
     * Safe numeric casting to Long. Returns null if invalid or unparseable.
     */
    private Long toLong(Object v) {
        if (v == null)
            return null;
        if (v instanceof Number)
            return ((Number) v).longValue();
        try {
            return Long.parseLong(v.toString());
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Safe numeric casting to Integer. Returns null if invalid or unparseable.
     */
    private Integer toInt(Object v) {
        if (v == null)
            return null;
        if (v instanceof Number)
            return ((Number) v).intValue();
        try {
            return Integer.parseInt(v.toString());
        } catch (Exception e) {
            return null;
        }
    }
}
