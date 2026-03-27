package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.ApiResponse;
import com.example.eventzen_admin_backend.dto.UserUpdateRequest;
import com.example.eventzen_admin_backend.entity.User;
import com.example.eventzen_admin_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for comprehensive administrative management of Users.
 */
@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Fetches details of an individual user.
     * 
     * @param id The unique identifier of the user account
     * @return HTTP 200 with the specified User entity
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    /**
     * Updates an existing user's basic demographic info.
     * 
     * @param id The ID of the user to adjust
     * @param req The Data Transfer Object specifying changes
     * @return HTTP 200 with the modified User entity
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
            @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(userService.update(id, req));
    }

    /**
     * Deletes a user account entirely.
     * 
     * @param id The ID of the user account to erase
     * @return HTTP 200 with a success indicator
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully"));
    }

    /**
     * Displays all registered platform users.
     * 
     * @return HTTP 200 with a complete user list
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Elevates a standard user to an Admin role, granting them overarching platform permissions.
     * 
     * @param id The ID of the target user
     * @return HTTP 200 with the newly privileged User entity
     */
    @PutMapping("/{id}/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> makeAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(userService.makeAdmin(id));
    }
}
