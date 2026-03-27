package com.example.eventzen_admin_backend.service;

import com.example.eventzen_admin_backend.dto.UserUpdateRequest;
import com.example.eventzen_admin_backend.entity.User;
import com.example.eventzen_admin_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alice")
                .email("alice@example.com")
                .password("encoded-password")
                .phone("1234567890")
                .role(User.Role.USER)
                .build();
    }

    

    @Test
    @DisplayName("getById – returns user when found")
    void getById_found() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        User result = userService.getById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    @DisplayName("getById – throws EntityNotFoundException when user does not exist")
    void getById_notFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("getAllUsers – returns all users")
    void getAllUsers_returnsAll() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<User> result = userService.getAllUsers();

        assertThat(result).hasSize(1);
        verify(userRepository, times(1)).findAll();
    }

    

    @Test
    @DisplayName("update – updates name and email when provided")
    void update_nameAndEmail() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setName("Bob");
        req.setEmail("bob@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.update(1L, req);

        assertThat(result.getName()).isEqualTo("Bob");
        assertThat(result.getEmail()).isEqualTo("bob@example.com");
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    @DisplayName("update – encodes password when new password is provided")
    void update_encodesPassword() {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setPassword("newPlainPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.encode("newPlainPassword")).thenReturn("new-encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.update(1L, req);

        assertThat(result.getPassword()).isEqualTo("new-encoded");
        verify(passwordEncoder).encode("newPlainPassword");
    }

    @Test
    @DisplayName("update – throws EntityNotFoundException when user does not exist")
    void update_notFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.update(99L, new UserUpdateRequest()))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }

    

    @Test
    @DisplayName("delete – deletes user when exists")
    void delete_success() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.delete(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete – throws EntityNotFoundException when user does not exist")
    void delete_notFound() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userService.delete(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");

        verify(userRepository, never()).deleteById(any());
    }

    

    @Test
    @DisplayName("makeAdmin – sets role to ADMIN and saves")
    void makeAdmin_success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = userService.makeAdmin(1L);

        assertThat(result.getRole()).isEqualTo(User.Role.ADMIN);
        verify(userRepository).save(sampleUser);
    }

    @Test
    @DisplayName("makeAdmin – throws EntityNotFoundException when user does not exist")
    void makeAdmin_notFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.makeAdmin(99L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("99");
    }
}
