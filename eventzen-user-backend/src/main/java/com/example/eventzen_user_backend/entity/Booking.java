package com.example.eventzen_user_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private LocalDateTime bookingDate;

    private Integer numberOfSeats;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @JsonIgnore
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendee> attendees;

    public enum Status {
        PENDING, APPROVED, CONFIRMED, REJECTED, CANCELLED
    }

    
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Long getEventId() {
        return event != null ? event.getId() : null;
    }
}
