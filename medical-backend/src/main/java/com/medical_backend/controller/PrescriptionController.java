package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.Prescription;
import com.medical_backend.model.Patient;
import com.medical_backend.model.Doctor;
import com.medical_backend.repository.PrescriptionRepository;
import com.medical_backend.repository.PatientRepository;
import com.medical_backend.repository.DoctorRepository;
import com.medical_backend.repository.MedicalRecordRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createPrescription(@Valid @RequestBody Prescription prescription) {
        try {
            Patient patient = patientRepository.findById(prescription.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            Doctor doctor = doctorRepository.findById(prescription.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            prescription.setPatient(patient);
            prescription.setDoctor(doctor);
            
            Prescription savedPrescription = prescriptionRepository.save(prescription);
            return ResponseEntity.ok(new ApiResponse(true, "Prescription created successfully", savedPrescription));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Prescriptions retrieved successfully", prescriptions));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPrescriptionById(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
            .map(prescription -> ResponseEntity.ok(new ApiResponse(true, "Prescription found", prescription)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Prescription not found")));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getPrescriptionsByPatient(@PathVariable Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        return ResponseEntity.ok(new ApiResponse(true, "Prescriptions found", prescriptions));
    }
    
    @GetMapping("/patient/{patientId}/active")
    public ResponseEntity<ApiResponse> getActivePrescriptionsByPatient(@PathVariable Long patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdAndIsActiveTrue(patientId);
        return ResponseEntity.ok(new ApiResponse(true, "Active prescriptions found", prescriptions));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        List<Prescription> prescriptions = prescriptionRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse(true, "Prescriptions found", prescriptions));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePrescription(@PathVariable Long id, @Valid @RequestBody Prescription prescriptionDetails) {
        return prescriptionRepository.findById(id)
            .map(prescription -> {
                prescription.setMedicineName(prescriptionDetails.getMedicineName());
                prescription.setDosage(prescriptionDetails.getDosage());
                prescription.setFrequency(prescriptionDetails.getFrequency());
                prescription.setDuration(prescriptionDetails.getDuration());
                prescription.setInstructions(prescriptionDetails.getInstructions());
                prescription.setEndDate(prescriptionDetails.getEndDate());
                
                Prescription updatedPrescription = prescriptionRepository.save(prescription);
                return ResponseEntity.ok(new ApiResponse(true, "Prescription updated successfully", updatedPrescription));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Prescription not found")));
    }
    
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse> deactivatePrescription(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
            .map(prescription -> {
                prescription.setActive(false);
                Prescription updatedPrescription = prescriptionRepository.save(prescription);
                return ResponseEntity.ok(new ApiResponse(true, "Prescription deactivated successfully", updatedPrescription));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Prescription not found")));
    }
    
    @GetMapping("/expired")
    public ResponseEntity<ApiResponse> getExpiredPrescriptions() {
        List<Prescription> expired = prescriptionRepository.findExpiredPrescriptions(LocalDate.now());
        return ResponseEntity.ok(new ApiResponse(true, "Expired prescriptions", expired));
    }
}