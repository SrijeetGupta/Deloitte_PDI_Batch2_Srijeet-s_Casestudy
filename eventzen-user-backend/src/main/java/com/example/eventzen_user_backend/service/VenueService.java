package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Core business logic dedicated to Venue persistence and modifications.
 */
@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    /**
     * Yields venues, applying dynamic WHERE-clause evaluation if location or capacity specs are requested.
     */
    public List<Venue> getAll(String location, Integer capacity) {
        if ((location == null || location.isBlank()) && capacity == null) {
            return venueRepository.findAll();
        }
        return venueRepository.findByFilters(
                (location == null || location.isBlank()) ? null : location,
                capacity);
    }

    /**
     * Locates a distinct venue representation.
     */
    public Venue getById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + id));
    }

    /**
     * Registers a new venue entry.
     */
    public Venue create(Venue venue) {
        return venueRepository.save(venue);
    }

    /**
     * Conducts a safe, partial or full overwrite of properties for established venues.
     */
    public Venue update(Long id, Venue updated) {
        Venue venue = getById(id);
        
        if (updated.getName() != null)
            venue.setName(updated.getName());
        if (updated.getLocation() != null)
            venue.setLocation(updated.getLocation());
        if (updated.getCapacity() != null)
            venue.setCapacity(updated.getCapacity());
        if (updated.getPricePerHour() != null)
            venue.setPricePerHour(updated.getPricePerHour());
            
        return venueRepository.save(venue);
    }

    /**
     * Un-lists a venue.
     */
    public void delete(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new EntityNotFoundException("Venue not found: " + id);
        }
        venueRepository.deleteById(id);
    }
}
