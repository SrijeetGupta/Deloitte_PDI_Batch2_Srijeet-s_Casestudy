package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.entity.Vendor;
import com.example.eventzen_user_backend.entity.Venue;
import com.example.eventzen_user_backend.repository.VendorRepository;
import com.example.eventzen_user_backend.repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service orchestrating Vendor logic, specifically regarding their associations with Venues.
 */
@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;
    private final VenueRepository venueRepository;

    /**
     * Initializes a new vendor and guarantees it is mapped to an existing venue.
     */
    public Vendor create(Long venueId, Vendor req) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + venueId));

        Vendor vendor = Vendor.builder()
                .name(req.getName())
                .serviceType(req.getServiceType())
                .venue(venue)
                .build();

        return vendorRepository.save(vendor);
    }

    /**
     * Retrieves a complete list of all Vendors in the system.
     */
    public List<Vendor> getAll() {
        return vendorRepository.findAll();
    }

    /**
     * Retrieves all vendors localized to a specific venue.
     */
    public List<Vendor> getByVenue(Long venueId) {
        if (!venueRepository.existsById(venueId)) {
            throw new EntityNotFoundException("Venue not found: " + venueId);
        }
        return vendorRepository.findByVenue_Id(venueId);
    }

    /**
     * Resolves a distinct vendor entity.
     */
    public Vendor getById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vendor not found: " + id));
    }

    /**
     * Modifies vendor attributes such as their offered service category or base venue.
     */
    public Vendor update(Long id, Vendor req, Long venueId) {
        Vendor vendor = getById(id);
        if (req.getName() != null)
            vendor.setName(req.getName());
        if (req.getServiceType() != null)
            vendor.setServiceType(req.getServiceType());
        
        // Optional reassignment if the vendor moves locations
        if (venueId != null) {
            Venue venue = venueRepository.findById(venueId)
                    .orElseThrow(() -> new EntityNotFoundException("Venue not found: " + venueId));
            vendor.setVenue(venue);
        }
        return vendorRepository.save(vendor);
    }

    /**
     * Erases a vendor profile.
     */
    public void delete(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new EntityNotFoundException("Vendor not found: " + id);
        }
        vendorRepository.deleteById(id);
    }
}
