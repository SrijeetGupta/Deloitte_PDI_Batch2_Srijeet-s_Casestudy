package com.example.eventzen_user_backend.repository;

import com.example.eventzen_user_backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVenue_Id(Long venueId);

}