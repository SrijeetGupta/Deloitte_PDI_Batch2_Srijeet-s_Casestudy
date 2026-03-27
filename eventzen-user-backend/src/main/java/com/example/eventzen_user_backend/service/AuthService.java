package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.AuthResponse;
import com.example.eventzen_user_backend.dto.LoginRequest;
import com.example.eventzen_user_backend.dto.RegisterRequest;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.UserRepository;
import com.example.eventzen_user_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Foundational Service overseeing public identity boundaries. 
 * Facilitates the generation of JWT definitions acting as user sessions.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;

    /**
     * Enrols a fresh profile to the backend structures. Applies cryptographic encoding to credentials securely.
     */
    public AuthResponse register(RegisterRequest req) {
        // Halt processing immediately if email identity conflicts globally
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + req.getEmail());
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.USER) // Inherently limits new accounts to basic user privileges
                .build();

        user = userRepository.save(user);
        
        // Output token for automated login post-signup
        String token = jwtUtil.generateToken(user.getEmail());

        return buildResponse(token, user);
    }

    /**
     * Grants ongoing access parameters securely confirming login integrity against the User store.
     */
    public AuthResponse login(LoginRequest req) {
        // Execute structural internal security verifications synchronously
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return buildResponse(token, user);
    }

    /**
     * Structural data-building mechanism normalizing login and register outward responses.
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
