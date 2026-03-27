package com.example.eventzen_user_backend.controller;

import com.example.eventzen_user_backend.dto.ApiResponse;
import com.example.eventzen_user_backend.dto.AuthResponse;
import com.example.eventzen_user_backend.dto.LoginRequest;
import com.example.eventzen_user_backend.dto.RegisterRequest;
import com.example.eventzen_user_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public REST Controller handling user registration and login flows.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Safely registers a new user to the platform.
     * 
     * @param req The validated user details
     * @return HTTP 201 Created containing User Details and an active JWT Token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    /**
     * Authenticates an existing user and provisions a new session token.
     * 
     * @param req Expected login credentials
     * @return HTTP 200 OK containing User Details and an active JWT Token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * Endpoint to signal the intent of a logout.
     * JWT lifecycle handles ultimate session termination client-side.
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully"));
    }
}
