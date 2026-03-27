package com.example.eventzen_admin_backend.config;

import com.example.eventzen_admin_backend.security.JwtAuthFilter;
import com.example.eventzen_admin_backend.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security Configuration class for the Admin Backend.
 * Sets up CORS, CSRF, JWT-based stateless authentication, and role-based access control.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Configures the main security filter chain.
     * Denies unauthorized access to sensitive endpoints and mandates JWT verification.
     *
     * @param http HttpSecurity object for configuration
     * @return The configured SecurityFilterChain
     * @throws Exception if an error occurs during configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF since we are using stateless JWT authentication
                .csrf(AbstractHttpConfigurer::disable)
                // Apply custom CORS configuration
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Enforce stateless session management
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Configure route authorization rules
                .authorizeHttpRequests(auth -> auth
                        // Allow completely public access to authentication endpoints
                        .requestMatchers("/auth/**").permitAll()
                        // Restrict sensitive endpoints to Admin users only
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/users/**").hasRole("ADMIN")
                        .requestMatchers("/events/**").hasRole("ADMIN")
                        .requestMatchers("/venues/**").hasRole("ADMIN")
                        .requestMatchers("/vendors/**").hasRole("ADMIN")
                        // Require authentication for any other unlisted request
                        .anyRequest().authenticated())
                // Set the custom authentication provider
                .authenticationProvider(authenticationProvider())
                // Ensure JWT is verified before Username/Password processing
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Defines Cross-Origin Resource Sharing (CORS) rules.
     * Allows frontend applications to make API requests without being blocked by the browser.
     *
     * @return CorsConfigurationSource containing allowed origins, methods, and headers
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Define allowed frontend origins (Vite dev server and CRA fallback)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173", 
                "http://localhost:3000" 
        ));
        
        // Define allowed HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // Allow all headers in requests
        config.setAllowedHeaders(List.of("*"));
        // Allow sending credentials (e.g., cookies or authorization headers)
        config.setAllowCredentials(true);
        // Cache preflight requests for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this configuration to all endpoints
        source.registerCorsConfiguration("/**", config);
        
        return source;
    }

    /**
     * Provides the DAO Authentication Provider setup.
     * Links the UserDetailsService and the PasswordEncoder to the authentication mechanism.
     *
     * @return Configured AuthenticationProvider instance
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Exposes the AuthenticationManager bean, required for processing authentication requests.
     *
     * @param config AuthenticationConfiguration provided by Spring
     * @return AuthenticationManager instance
     * @throws Exception if an error occurs while fetching the manager
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Provides the PasswordEncoder bean.
     * Uses BCrypt hashing algorithm to securely store and verify passwords.
     *
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
