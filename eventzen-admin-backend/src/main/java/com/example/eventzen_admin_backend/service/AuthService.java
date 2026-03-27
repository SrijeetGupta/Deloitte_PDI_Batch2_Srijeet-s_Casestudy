package com.example.eventzen_admin_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.eventzen_admin_backend.dto.AuthResponse;
import com.example.eventzen_admin_backend.dto.LoginRequest;
import com.example.eventzen_admin_backend.dto.RegisterRequest;
import com.example.eventzen_admin_backend.entity.User;
import com.example.eventzen_admin_backend.repository.UserRepository;
import com.example.eventzen_admin_backend.security.JwtUtil;

/**
 * Core Service for handling identity verifications, user registration, and JWT generation.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    /**
     * Registers a new user account, encrypting the password securely before saving.
     */
    public AuthResponse register(RegisterRequest req) {
        // Enforce uniqueness of emails
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.USER) // Default all new users to basic USER role
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());

        return buildResponse(token, user);
    }

    /**
     * Authenticates existing credentials and issues a signed JWT token on success.
     */
    public AuthResponse login(LoginRequest req) {
        // Leverages the underlying Spring Security manager to validate credentials
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Issue token encoding the user's primary email identity
        String token = jwtUtil.generateToken(user.getEmail());
        return buildResponse(token, user);
    }

    /**
     * Utility method to format the standard authentication response payload.
     */
    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
