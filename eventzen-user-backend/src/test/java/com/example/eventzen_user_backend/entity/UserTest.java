package com.example.eventzen_user_backend.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testUserBuilderAndGetters() {
        User user = User.builder()
                .id(1L)
                .name("Admin")
                .email("admin@example.com")
                .password("password")
                .phone("1234567890")
                .role(User.Role.ADMIN)
                .build();

        assertEquals(1L, user.getId());
        assertEquals("Admin", user.getName());
        assertEquals("admin@example.com", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals("1234567890", user.getPhone());
        assertEquals(User.Role.ADMIN, user.getRole());
    }

    @Test
    void testUserSetters() {
        User user = new User();
        user.setRole(User.Role.USER);
        assertEquals(User.Role.USER, user.getRole());
    }
}
