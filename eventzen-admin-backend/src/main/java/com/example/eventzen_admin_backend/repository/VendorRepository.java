package com.example.eventzen_admin_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.eventzen_admin_backend.entity.Vendor;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    List<Vendor> findByVenue_Id(Long venueId);

}