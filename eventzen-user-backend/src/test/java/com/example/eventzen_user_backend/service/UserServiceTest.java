package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.UserUpdateRequest;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void getById_Success() {
        User user = User.builder().id(1L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void update_Success() {
        User user = User.builder().id(1L).name("Old").build();
        UserUpdateRequest req = new UserUpdateRequest("New", "new@test.com", "123", "newPass");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        User result = userService.update(1L, req);

        assertEquals("New", result.getName());
        assertEquals("new@test.com", result.getEmail());
    }

    @Test
    void makeAdmin_Success() {
        User user = User.builder().id(1L).role(User.Role.USER).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        User result = userService.makeAdmin(1L);

        assertEquals(User.Role.ADMIN, result.getRole());
    }
}
