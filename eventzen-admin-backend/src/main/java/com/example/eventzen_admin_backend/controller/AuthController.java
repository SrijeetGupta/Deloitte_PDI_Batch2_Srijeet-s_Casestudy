package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.ApiResponse;
import com.example.eventzen_admin_backend.dto.AuthResponse;
import com.example.eventzen_admin_backend.dto.LoginRequest;
import com.example.eventzen_admin_backend.dto.RegisterRequest;
import com.example.eventzen_admin_backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller handling public authentication endpoints.
 * Provides APIs for user registration, login, and abstract logout flows.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user into the platform.
     * 
     * @param req The validated registration payload (name, email, password)
     * @return HTTP 201 Created with the authenticated user details and generated JWT
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    /**
     * Authenticates an existing user.
     * 
     * @param req The validated login payload (email, password)
     * @return HTTP 200 OK with the authenticated user details and generated JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * Placeholder endpoint for user logout.
     * Note: Since JWT is stateless, actual logout implies dropping the token on the client side.
     * 
     * @return HTTP 200 OK with a generic success response
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully"));
    }
}
