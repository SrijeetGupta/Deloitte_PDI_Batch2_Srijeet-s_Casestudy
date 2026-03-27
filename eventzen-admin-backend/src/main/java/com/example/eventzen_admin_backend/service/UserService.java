package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.dto.UserUpdateRequest;
import com.example.eventzen_admin_backend.entity.User;
import com.example.eventzen_admin_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service managing user-related domain logic such as profile updates and role escalations.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Resolves a user entity by ID.
     */
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    /**
     * Safely updates an existing user profile without blindly overwriting omitted fields.
     */
    public User update(Long id, UserUpdateRequest req) {
        User user = getById(id);

        if (req.getName() != null && !req.getName().isBlank())
            user.setName(req.getName());
        if (req.getEmail() != null && !req.getEmail().isBlank())
            user.setEmail(req.getEmail());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
            
        // Encrypt the new password before storing if it was included in the update
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Hard-deletes a user from the platform.
     */
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Fetches all users logic.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Escalates a regular user to an administrative role.
     */
    public User makeAdmin(Long id) {
        User user = getById(id);
        user.setRole(User.Role.ADMIN);
        return userRepository.save(user);
    }
}
