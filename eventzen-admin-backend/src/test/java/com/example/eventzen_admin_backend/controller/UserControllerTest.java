package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.dto.UserUpdateRequest;
import com.example.eventzen_admin_backend.entity.User;
import com.example.eventzen_admin_backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        adminUser = User.builder()
                .id(1L)
                .name("Admin")
                .email("admin@example.com")
                .role(User.Role.ADMIN)
                .build();

        regularUser = User.builder()
                .id(2L)
                .name("Alice")
                .email("alice@example.com")
                .role(User.Role.USER)
                .build();
    }

    

    @Test
    @DisplayName("GET /users – returns 200 with list of users")
    void getAllUsers_returnsOk() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(adminUser, regularUser));

        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    

    @Test
    @DisplayName("GET /users/{id} – returns 200 with user")
    void getUser_found() throws Exception {
        when(userService.getById(2L)).thenReturn(regularUser);

        mockMvc.perform(get("/users/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Alice"))
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    @DisplayName("GET /users/{id} – returns 404 when not found")
    void getUser_notFound() throws Exception {
        when(userService.getById(99L)).thenThrow(new EntityNotFoundException("User not found: 99"));

        mockMvc.perform(get("/users/99"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("PUT /users/{id} – returns 200 with updated user")
    void updateUser_returnsOk() throws Exception {
        UserUpdateRequest req = new UserUpdateRequest();
        req.setName("Bob");

        User updated = User.builder().id(2L).name("Bob").email("alice@example.com").build();
        when(userService.update(eq(2L), any(UserUpdateRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/users/2")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Bob"));
    }

    

    @Test
    @DisplayName("DELETE /users/{id} – returns 200 on success")
    void deleteUser_returnsOk() throws Exception {
        doNothing().when(userService).delete(2L);

        mockMvc.perform(delete("/users/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("DELETE /users/{id} – returns 404 when not found")
    void deleteUser_notFound() throws Exception {
        doThrow(new EntityNotFoundException("User not found: 99")).when(userService).delete(99L);

        mockMvc.perform(delete("/users/99"))
                .andExpect(status().isNotFound());
    }

    

    @Test
    @DisplayName("PUT /users/{id}/admin – returns 200 with promoted user")
    void makeAdmin_returnsOk() throws Exception {
        regularUser.setRole(User.Role.ADMIN);
        when(userService.makeAdmin(2L)).thenReturn(regularUser);

        mockMvc.perform(put("/users/2/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    @DisplayName("PUT /users/{id}/admin – returns 404 when user not found")
    void makeAdmin_notFound() throws Exception {
        when(userService.makeAdmin(99L)).thenThrow(new EntityNotFoundException("User not found: 99"));

        mockMvc.perform(put("/users/99/admin"))
                .andExpect(status().isNotFound());
    }
}
