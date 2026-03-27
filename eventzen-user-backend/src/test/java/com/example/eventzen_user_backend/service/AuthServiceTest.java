package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.AuthResponse;
import com.example.eventzen_user_backend.dto.LoginRequest;
import com.example.eventzen_user_backend.dto.RegisterRequest;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.UserRepository;
import com.example.eventzen_user_backend.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_Success() {
        RegisterRequest req = new RegisterRequest("User", "user@test.com", "pass", "123");
        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = (User) i.getArguments()[0];
            u.setId(1L);
            return u;
        });
        when(jwtUtil.generateToken(any())).thenReturn("token");

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("token", response.getToken());
        assertEquals("user@test.com", response.getEmail());
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest("user@test.com", "pass");
        User user = User.builder().id(1L).email("user@test.com").name("User").role(User.Role.USER).build();

        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(any())).thenReturn("token");

        AuthResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("token", response.getToken());
        verify(authManager).authenticate(any());
    }
}
