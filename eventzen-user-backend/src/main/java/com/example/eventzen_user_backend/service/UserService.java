package com.example.eventzen_user_backend.service;

import com.example.eventzen_user_backend.dto.UserUpdateRequest;
import com.example.eventzen_user_backend.entity.User;
import com.example.eventzen_user_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service directing User profile modifications and lifecycle endpoints.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Resolves metadata for an individual identified user.
     */
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    /**
     * Applies demographic modifications specified within the generic profile bounds.
     */
    public User update(Long id, UserUpdateRequest req) {
        User user = getById(id);

        if (req.getName() != null && !req.getName().isBlank())
            user.setName(req.getName());
        if (req.getEmail() != null && !req.getEmail().isBlank())
            user.setEmail(req.getEmail());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }

        return userRepository.save(user);
    }

    /**
     * Wipes a client account from the platform. Requires direct administrative override.
     */
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
    }

    /**
     * Iterates all user objects over the system architecture. Restricted to ADMIN usage only.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Grants sweeping administrator entitlements unconditionally to a chosen user account.
     */
    public User makeAdmin(Long id) {
        User user = getById(id);
        user.setRole(User.Role.ADMIN);
        return userRepository.save(user);
    }
}
