package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.EventRepository;
import com.example.eventzen_user_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Service class for managing Events.
 * Handles the creation, retrieval, updating, and deletion of events.
 * Also manages dynamically mapping key-value attributes to the Event entity.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    /**
     * Retrieves a list of all existing events.
     * 
     * @return List of Event entities
     */
    public List<Event> getAll() {
        return eventRepository.findAll();
    }

    /**
     * Retrieves an event by its ID.
     * 
     * @param id The ID of the event
     * @return The Event entity if found
     * @throws EntityNotFoundException if the event does not exist
     */
    public Event getById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + id));
    }

    /**
     * Creates a new Event from a raw attribute map.
     * 
     * @param body A Map containing event attributes (e.g. name, description, venueId)
     * @return The successfully created Event entity
     */
    public Event create(Map<String, Object> body) {
        Event event = mapBody(new Event(), body);
        return eventRepository.save(event);
    }

    /**
     * Updates an existing event based on a raw attribute map.
     * 
     * @param id The ID of the event to update
     * @param body A Map containing the updated event attributes
     * @return The newly updated Event entity
     */
    public Event update(Long id, Map<String, Object> body) {
        Event event = getById(id);
        mapBody(event, body);
        return eventRepository.save(event);
    }

    /**
     * Deletes an event by its ID.
     * 
     * @param id The ID of the event to delete
     * @throws EntityNotFoundException if the event does not exist
     */
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new EntityNotFoundException("Event not found: " + id);
        }
        eventRepository.deleteById(id);
    }

    /**
     * Helper method to map a raw untyped payload (Map) into an Event entity.
     * Safely checks for keys and casts values to ensure structural integrity.
     * 
     * @param event The target Event entity to update or populate
     * @param body The source Map containing payload data
     * @return The populated Event entity
     * @throws EntityNotFoundException if a provided venueId maps to a non-existent Venue
     */
    private Event mapBody(Event event, Map<String, Object> body) {
        if (body.containsKey("name"))
            event.setName((String) body.get("name"));
        if (body.containsKey("description"))
            event.setDescription((String) body.get("description"));
        if (body.containsKey("capacity"))
            event.setCapacity(toInt(body.get("capacity")));
            
        // Safely parse the event date from ISO string
        if (body.containsKey("eventDate")) {
            String raw = (String) body.get("eventDate");
            if (raw != null && !raw.isBlank()) {
                event.setEventDate(java.time.LocalDateTime.parse(raw));
            }
        }
        
        // Ensure Venue exists before assigning it to the event
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
     * Helper utility to safely extract and parse a Long value from an untyped Object.
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
     * Helper utility to safely extract and parse an Integer value from an untyped Object.
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
