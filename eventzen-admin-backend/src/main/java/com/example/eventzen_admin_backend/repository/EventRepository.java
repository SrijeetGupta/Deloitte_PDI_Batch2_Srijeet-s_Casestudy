package com.example.eventzen_admin_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.eventzen_admin_backend.entity.Event;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByVenue_Id(Long venueId);

}