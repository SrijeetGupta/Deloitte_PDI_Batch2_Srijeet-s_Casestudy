package com.example.eventzen_admin_backend.controller;

import com.example.eventzen_admin_backend.entity.Vendor;
import com.example.eventzen_admin_backend.entity.Venue;
import com.example.eventzen_admin_backend.service.VendorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.MediaType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class VendorControllerTest {

        private MockMvc mockMvc;

        private ObjectMapper objectMapper = new ObjectMapper();

        @Mock
        private VendorService vendorService;

        @InjectMocks
        private VendorController vendorController;

        private Venue sampleVenue;
        private Vendor sampleVendor;

        @BeforeEach
        void setUp() throws Exception {
                MockitoAnnotations.openMocks(this);
                mockMvc = MockMvcBuilders.standaloneSetup(vendorController).build();
                sampleVenue = Venue.builder()
                                .id(10L)
                                .name("Grand Hall")
                                .build();

                sampleVendor = Vendor.builder()
                                .id(1L)
                                .name("Catering Co.")
                                .serviceType("Catering")
                                .venue(sampleVenue)
                                .build();
        }

        

        @Test
        @DisplayName("POST /vendors?venueId – returns 201 when vendor created")
        void create_returnsCreated() throws Exception {
                when(vendorService.create(eq(10L), any(Vendor.class))).thenReturn(sampleVendor);

                mockMvc.perform(post("/vendors")
                                .param("venueId", "10")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sampleVendor)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.name").value("Catering Co."));
        }

        @Test
        @DisplayName("POST /vendors?venueId – returns 404 when venue not found")
        void create_venueNotFound() throws Exception {
                when(vendorService.create(eq(99L), any(Vendor.class)))
                                .thenThrow(new EntityNotFoundException("Venue not found: 99"));

                mockMvc.perform(post("/vendors")
                                .param("venueId", "99")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(sampleVendor)))
                                .andExpect(status().isNotFound());
        }

        

        @Test
        @DisplayName("GET /vendors?venueId – returns 200 with vendors for venue")
        void getByVenue_returnsOk() throws Exception {
                when(vendorService.getByVenue(10L)).thenReturn(List.of(sampleVendor));

                mockMvc.perform(get("/vendors").param("venueId", "10"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].name").value("Catering Co."))
                                .andExpect(jsonPath("$[0].serviceType").value("Catering"));
        }

        @Test
        @DisplayName("GET /vendors?venueId – returns 404 when venue not found")
        void getByVenue_venueNotFound() throws Exception {
                when(vendorService.getByVenue(99L))
                                .thenThrow(new EntityNotFoundException("Venue not found: 99"));

                mockMvc.perform(get("/vendors").param("venueId", "99"))
                                .andExpect(status().isNotFound());
        }

        

        @Test
        @DisplayName("GET /vendors/{id} – returns 200 with vendor")
        void getById_found() throws Exception {
                when(vendorService.getById(1L)).thenReturn(sampleVendor);

                mockMvc.perform(get("/vendors/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1));
        }

        @Test
        @DisplayName("GET /vendors/{id} – returns 404 when not found")
        void getById_notFound() throws Exception {
                when(vendorService.getById(99L))
                                .thenThrow(new EntityNotFoundException("Vendor not found: 99"));

                mockMvc.perform(get("/vendors/99"))
                                .andExpect(status().isNotFound());
        }

        

        @Test
        @DisplayName("PUT /vendors/{id} – returns 200 with updated vendor")
        void update_returnsOk() throws Exception {
                Vendor updated = Vendor.builder().id(1L).name("Updated Co.").serviceType("Music").build();
                when(vendorService.update(eq(1L), any(Vendor.class), isNull())).thenReturn(updated);

                mockMvc.perform(put("/vendors/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updated)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Updated Co."));
        }

        @Test
        @DisplayName("PUT /vendors/{id} – returns 404 when vendor not found")
        void update_notFound() throws Exception {
                when(vendorService.update(eq(99L), any(Vendor.class), isNull()))
                                .thenThrow(new EntityNotFoundException("Vendor not found: 99"));

                mockMvc.perform(put("/vendors/99")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}"))
                                .andExpect(status().isNotFound());
        }

        

        @Test
        @DisplayName("DELETE /vendors/{id} – returns 200 on success")
        void delete_returnsOk() throws Exception {
                doNothing().when(vendorService).delete(1L);

                mockMvc.perform(delete("/vendors/1"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.success").value(true));
        }

        @Test
        @DisplayName("DELETE /vendors/{id} – returns 404 when not found")
        void delete_notFound() throws Exception {
                doThrow(new EntityNotFoundException("Vendor not found: 99")).when(vendorService).delete(99L);

                mockMvc.perform(delete("/vendors/99"))
                                .andExpect(status().isNotFound());
        }
}
