package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.ApiResponse;
import com.example.eventzen_admin_backend.entity.Event;
import com.example.eventzen_admin_backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for managing Events.
 * Features full CRUD capabilities strictly restricted to Administrators.
 */
@RestController
@RequestMapping("/events")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Fetches all events in the system.
     * 
     * @return HTTP 200 with the complete list of Events
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAll() {
        return ResponseEntity.ok(eventService.getAll());
    }

    /**
     * Fetches details of a specific event.
     * 
     * @param id The ID of the requested event
     * @return HTTP 200 with the Event entity
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    /**
     * Creates a new event dynamically from an untyped JSON payload.
     * 
     * @param body A Map containing event configuration (name, property arrays, etc.)
     * @return HTTP 201 Created with the persisted Event entity
     */
    @PostMapping
    public ResponseEntity<Event> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(body));
    }

    /**
     * Updates an existing event based on a dynamically structured map.
     * 
     * @param id The ID of the event to modify
     * @param body A Map containing the updated fields
     * @return HTTP 200 with the fully updated Event entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(eventService.update(id, body));
    }

    /**
     * Deletes a specific event from the database.
     * 
     * @param id The ID of the event to safely erase
     * @return HTTP 200 with a generic success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully"));
    }
}
