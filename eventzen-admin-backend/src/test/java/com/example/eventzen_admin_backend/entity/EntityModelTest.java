package com.example.eventzen_admin_backend.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EntityModelTest {

    

    @Test
    @DisplayName("User – default role is USER")
    void user_defaultRole() {
        User user = new User();
        user.setRole(User.Role.USER);
        assertThat(user.getRole()).isEqualTo(User.Role.USER);
    }

    @Test
    @DisplayName("User – builder creates user with all fields")
    void user_builder() {
        User user = User.builder()
                .id(1L)
                .name("Alice")
                .email("alice@example.com")
                .password("secret")
                .phone("9999999999")
                .role(User.Role.ADMIN)
                .build();

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getName()).isEqualTo("Alice");
        assertThat(user.getEmail()).isEqualTo("alice@example.com");
        assertThat(user.getPhone()).isEqualTo("9999999999");
        assertThat(user.getRole()).isEqualTo(User.Role.ADMIN);
    }

    

    @Test
    @DisplayName("Booking – getUserId returns null when user is null")
    void booking_getUserId_null() {
        Booking b = new Booking();
        assertThat(b.getUserId()).isNull();
    }

    @Test
    @DisplayName("Booking – getEventId returns null when event is null")
    void booking_getEventId_null() {
        Booking b = new Booking();
        assertThat(b.getEventId()).isNull();
    }

    @Test
    @DisplayName("Booking – getUserId returns correct id")
    void booking_getUserId() {
        User user = User.builder().id(5L).name("Bob").build();
        Booking b = Booking.builder().id(1L).user(user).build();
        assertThat(b.getUserId()).isEqualTo(5L);
    }

    @Test
    @DisplayName("Booking – getEventId returns correct id")
    void booking_getEventId() {
        Event event = Event.builder().id(10L).name("Conference").build();
        Booking b = Booking.builder().id(1L).event(event).build();
        assertThat(b.getEventId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Booking – default status is PENDING")
    void booking_defaultStatus() {
        Booking b = new Booking();
        b.setStatus(Booking.Status.PENDING);
        assertThat(b.getStatus()).isEqualTo(Booking.Status.PENDING);
    }

    

    @Test
    @DisplayName("Event – getVenueId returns null when venue is null")
    void event_getVenueId_null() {
        Event e = new Event();
        assertThat(e.getVenueId()).isNull();
    }

    @Test
    @DisplayName("Event – getVenueId returns correct venue id")
    void event_getVenueId() {
        Venue venue = Venue.builder().id(7L).name("Hall A").build();
        Event e = Event.builder().id(1L).name("Concert").venue(venue).build();
        assertThat(e.getVenueId()).isEqualTo(7L);
    }

    

    @Test
    @DisplayName("Venue – builder sets all fields")
    void venue_builder() {
        Venue v = Venue.builder()
                .id(1L)
                .name("Stadium")
                .location("Delhi")
                .capacity(1000)
                .pricePerHour(5000.0)
                .build();

        assertThat(v.getName()).isEqualTo("Stadium");
        assertThat(v.getLocation()).isEqualTo("Delhi");
        assertThat(v.getCapacity()).isEqualTo(1000);
        assertThat(v.getPricePerHour()).isEqualTo(5000.0);
    }

    

    @Test
    @DisplayName("Vendor – getVenueId returns null when venue is null")
    void vendor_getVenueId_null() {
        Vendor vendor = new Vendor();
        assertThat(vendor.getVenueId()).isNull();
    }

    @Test
    @DisplayName("Vendor – getVenueId returns correct id")
    void vendor_getVenueId() {
        Venue venue = Venue.builder().id(3L).name("Hall B").build();
        Vendor vendor = Vendor.builder().id(1L).name("DJ Pro").venue(venue).build();
        assertThat(vendor.getVenueId()).isEqualTo(3L);
    }

    @Test
    @DisplayName("Vendor – builder creates vendor with all fields")
    void vendor_builder() {
        Vendor v = Vendor.builder()
                .id(1L)
                .name("Floral Art")
                .serviceType("Decoration")
                .build();

        assertThat(v.getName()).isEqualTo("Floral Art");
        assertThat(v.getServiceType()).isEqualTo("Decoration");
    }
}
