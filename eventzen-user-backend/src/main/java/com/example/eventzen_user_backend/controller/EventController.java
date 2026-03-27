package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.ApiResponse;
import com.example.eventzen_user_backend.entity.Event;
import com.example.eventzen_user_backend.service.EventService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for interactions concerning dynamic Event data.
 */
@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * Fetches all published events system-wide.
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAll() {
        return ResponseEntity.ok(eventService.getAll());
    }

    /**
     * Resolves metadata for an individual identified event.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Event> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    /**
     * Dynamically instantiates a new event from unstructured JSON keys.
     */
    @PostMapping
    public ResponseEntity<Event> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(body));
    }

    /**
     * Applies precise, targeted modifications to an event entity using Map logic.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(eventService.update(id, body));
    }

    /**
     * Permanently wipes an event entry from the database.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully"));
    }
}
