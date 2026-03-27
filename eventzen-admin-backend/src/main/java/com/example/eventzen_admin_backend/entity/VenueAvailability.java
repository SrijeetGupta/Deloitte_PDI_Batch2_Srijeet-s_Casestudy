package com.example.eventzen_admin_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "venue_availability",
       uniqueConstraints = @UniqueConstraint(columnNames = {"venue_id", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AvailabilityStatus status = AvailabilityStatus.AVAILABLE;

    public Long getVenueId() {
        return venue != null ? venue.getId() : null;
    }

    public enum AvailabilityStatus {
        AVAILABLE, BOOKED, MAINTENANCE
    }
}
