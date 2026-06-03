package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.Patient;
import com.medical_backend.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientRepository patientRepository;
    
    // Create new patient
    @PostMapping
    public ResponseEntity<ApiResponse> createPatient(@Valid @RequestBody Patient patient) {
        try {
            // Check if email already exists
            if (patient.getEmail() != null && !patient.getEmail().isEmpty()) {
                if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Patient with this email already exists"));
                }
            }
            
            // Check if phone already exists
            if (patient.getPhoneNumber() != null && !patient.getPhoneNumber().isEmpty()) {
                if (patientRepository.findByPhoneNumber(patient.getPhoneNumber()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Patient with this phone number already exists"));
                }
            }
            
            Patient savedPatient = patientRepository.save(patient);
            return ResponseEntity.ok(new ApiResponse(true, "Patient created successfully", savedPatient));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    // Get all patients
    @GetMapping
    public ResponseEntity<ApiResponse> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Patients retrieved successfully", patients));
    }
    
    // Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
            .map(patient -> ResponseEntity.ok(new ApiResponse(true, "Patient found", patient)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Patient not found with id: " + id)));
    }
    
    // Update patient
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePatient(@PathVariable Long id, @Valid @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
            .map(patient -> {
                // Update fields
                patient.setFirstName(patientDetails.getFirstName());
                patient.setLastName(patientDetails.getLastName());
                patient.setDateOfBirth(patientDetails.getDateOfBirth());
                patient.setGender(patientDetails.getGender());
                patient.setPhoneNumber(patientDetails.getPhoneNumber());
                patient.setEmail(patientDetails.getEmail());
                patient.setAddress(patientDetails.getAddress());
                patient.setBloodGroup(patientDetails.getBloodGroup());
                patient.setEmergencyContact(patientDetails.getEmergencyContact());
                patient.setMedicalHistory(patientDetails.getMedicalHistory());
                
                Patient updatedPatient = patientRepository.save(patient);
                return ResponseEntity.ok(new ApiResponse(true, "Patient updated successfully", updatedPatient));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Patient not found with id: " + id)));
    }
    
    // Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deletePatient(@PathVariable Long id) {
        return patientRepository.findById(id)
            .map(patient -> {
                patientRepository.delete(patient);
                return ResponseEntity.ok(new ApiResponse(true, "Patient deleted successfully"));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Patient not found with id: " + id)));
    }
    
    // Search patients
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchPatients(@RequestParam String keyword) {
        List<Patient> patients = patientRepository.searchPatients(keyword);
        if (patients.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "No patients found", patients));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Patients found", patients));
    }
    
    // Get patient by email
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse> getPatientByEmail(@PathVariable String email) {
        return patientRepository.findByEmail(email)
            .map(patient -> ResponseEntity.ok(new ApiResponse(true, "Patient found", patient)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Patient not found with email: " + email)));
    }
}