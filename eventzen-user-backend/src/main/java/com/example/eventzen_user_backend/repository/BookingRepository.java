package com.example.eventzen_user_backend.repository;

import com.example.eventzen_user_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByEvent_Id(Long eventId);

}