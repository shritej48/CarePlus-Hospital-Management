package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.dto.ChangePasswordRequest;
import com.medical_backend.dto.LoginRequest;
import com.medical_backend.dto.RegisterRequest;
import com.medical_backend.model.Patient;
import com.medical_backend.model.User;
import com.medical_backend.repository.PatientRepository;
import com.medical_backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping("/test-auth")
    public ResponseEntity<ApiResponse> testAuth() {
        return ResponseEntity.ok(new ApiResponse(true, "AuthController is reachable", null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Email already exists"));
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(request.getRole());
        User saved = userRepository.save(user);

        // If role is PATIENT, automatically create a patient profile
        if ("PATIENT".equalsIgnoreCase(request.getRole())) {
            Patient patient = new Patient();
            patient.setFirstName(request.getFirstName());
            patient.setLastName(request.getLastName());
            patient.setEmail(request.getEmail());
            patient.setPhoneNumber(request.getPhoneNumber());
            patient.setGender(request.getGender());
            patient.setDateOfBirth(request.getDateOfBirth());
            patient.setUser(saved);
            patientRepository.save(patient);
        }

        return ResponseEntity.ok(new ApiResponse(true, "User registered", saved));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid email or password"));
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid email or password"));
        }

        Map<String, Object> responseData = new HashMap<>();
        Map<String, Object> userDto = new HashMap<>();
        userDto.put("id", user.getId());
        userDto.put("firstName", user.getFirstName());
        userDto.put("lastName", user.getLastName());
        userDto.put("email", user.getEmail());
        userDto.put("phoneNumber", user.getPhoneNumber());
        userDto.put("role", user.getRole());
        userDto.put("active", user.isActive());
        responseData.put("user", userDto);

        if ("PATIENT".equalsIgnoreCase(user.getRole())) {
            Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
            if (patient != null) {
                responseData.put("patientId", patient.getId());
            } else {
                Patient newPatient = new Patient();
                newPatient.setFirstName(user.getFirstName());
                newPatient.setLastName(user.getLastName());
                newPatient.setEmail(user.getEmail());
                newPatient.setPhoneNumber(user.getPhoneNumber());
                newPatient.setUser(user);
                Patient savedPatient = patientRepository.save(newPatient);
                responseData.put("patientId", savedPatient.getId());
            }
        }

        return ResponseEntity.ok(new ApiResponse(true, "Login successful", responseData));
    }

    // ✅ NEW: Change password endpoint
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Current password is incorrect"));
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }}