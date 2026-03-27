package com.example.eventzen_admin_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.eventzen_admin_backend.entity.Booking;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser_Id(Long userId);

    List<Booking> findByEvent_Id(Long eventId);

}