package com.example.eventzen_user_backend.dto;

import com.example.eventzen_user_backend.entity.Booking;
import lombok.Data;

import java.time.LocalDateTime;


@Data
public class BookingRequest {

    private EventRef event; 
    private LocalDateTime bookingDate;
    private Booking.Status status;
    private Integer numberOfSeats;

    @Data
    public static class EventRef {
        private Long id;
    }
}
