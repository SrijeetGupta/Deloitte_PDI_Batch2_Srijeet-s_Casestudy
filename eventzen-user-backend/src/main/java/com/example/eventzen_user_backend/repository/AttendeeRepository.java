package com.example.eventzen_user_backend.repository;

import com.example.eventzen_user_backend.entity.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {

    List<Attendee> findByBooking_Id(Long bookingId);

}