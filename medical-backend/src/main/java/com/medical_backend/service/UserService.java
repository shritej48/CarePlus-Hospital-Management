package com.medical_backend.service;

import com.medical_backend.dto.RegisterRequest;
import com.medical_backend.model.User;
import com.medical_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        // Determine role (default PATIENT)
        String role = "PATIENT";
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            role = request.getRole().toUpperCase();
            // Validate role (optional)
            if (!role.matches("PATIENT|DOCTOR|ADMIN|STAFF")) {
                role = "PATIENT";
            }
        }
        user.setRole(role);   // setRole expects a String

        // No 'active' field in your User entity – remove the setActive line
        // user.setActive(true);   // ❌ DELETE THIS LINE

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // No 'active' check – remove or add field to User
        // if (!user.isActive()) {
        //     throw new RuntimeException("Account is disabled");
        // }

        return user;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}