package com.example.eventzen_user_backend.repository;

import com.example.eventzen_user_backend.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    List<Vendor> findByVenue_Id(Long venueId);

}