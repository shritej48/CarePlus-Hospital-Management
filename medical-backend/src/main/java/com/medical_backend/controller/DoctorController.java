package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.Doctor;
import com.medical_backend.repository.DoctorRepository;
import com.medical_backend.repository.AppointmentRepository;
import com.medical_backend.repository.PrescriptionRepository;
import com.medical_backend.repository.MedicalRecordRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    // Create new doctor
    @PostMapping
    public ResponseEntity<ApiResponse> createDoctor(@Valid @RequestBody Doctor doctor) {
        try {
            if (doctor.getEmail() != null && !doctor.getEmail().isEmpty()) {
                if (doctorRepository.findByEmail(doctor.getEmail()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Doctor with this email already exists"));
                }
            }
            if (doctor.getPhoneNumber() != null && !doctor.getPhoneNumber().isEmpty()) {
                if (doctorRepository.findByPhoneNumber(doctor.getPhoneNumber()).isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Doctor with this phone number already exists"));
                }
            }
            Doctor savedDoctor = doctorRepository.save(doctor);
            return ResponseEntity.ok(new ApiResponse(true, "Doctor created successfully", savedDoctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    // Get all doctors
    @GetMapping
    public ResponseEntity<ApiResponse> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Doctors retrieved successfully", doctors));
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
            .map(doctor -> ResponseEntity.ok(new ApiResponse(true, "Doctor found", doctor)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Doctor not found with id: " + id)));
    }

    // Update doctor
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateDoctor(@PathVariable Long id, @Valid @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id)
            .map(doctor -> {
                doctor.setFirstName(doctorDetails.getFirstName());
                doctor.setLastName(doctorDetails.getLastName());
                doctor.setSpecialization(doctorDetails.getSpecialization());
                doctor.setPhoneNumber(doctorDetails.getPhoneNumber());
                doctor.setEmail(doctorDetails.getEmail());
                doctor.setQualification(doctorDetails.getQualification());
                doctor.setExperience(doctorDetails.getExperience());
                doctor.setConsultationFee(doctorDetails.getConsultationFee());
                doctor.setAvailableDays(doctorDetails.getAvailableDays());
                doctor.setAvailableTime(doctorDetails.getAvailableTime());
                doctor.setBio(doctorDetails.getBio());
                doctor.setImage(doctorDetails.getImage());
                Doctor updatedDoctor = doctorRepository.save(doctor);
                return ResponseEntity.ok(new ApiResponse(true, "Doctor updated successfully", updatedDoctor));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Doctor not found with id: " + id)));
    }

    // Delete doctor – delete all related records first
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDoctor(@PathVariable Long id) {
        return doctorRepository.findById(id)
            .map(doctor -> {
                // 1. Delete medical records for this doctor
                List<com.medical_backend.model.MedicalRecord> medicalRecords = medicalRecordRepository.findByDoctorId(id);
                medicalRecordRepository.deleteAll(medicalRecords);

                // 2. Delete appointments for this doctor
                List<com.medical_backend.model.Appointment> appointments = appointmentRepository.findByDoctorId(id);
                appointmentRepository.deleteAll(appointments);

                // 3. Delete prescriptions for this doctor
                List<com.medical_backend.model.Prescription> prescriptions = prescriptionRepository.findByDoctorId(id);
                prescriptionRepository.deleteAll(prescriptions);

                // 4. Now delete the doctor
                doctorRepository.delete(doctor);

                return ResponseEntity.ok(new ApiResponse(true, "Doctor and all associated records deleted successfully"));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Doctor not found with id: " + id)));
    }

    // Search doctors
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchDoctors(@RequestParam String keyword) {
        List<Doctor> doctors = doctorRepository.searchDoctors(keyword);
        if (doctors.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "No doctors found", doctors));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Doctors found", doctors));
    }

    // Get doctors by specialization
    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<ApiResponse> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
        return ResponseEntity.ok(new ApiResponse(true, "Doctors found", doctors));
    }

    // Get doctors by experience
    @GetMapping("/experience/{years}")
    public ResponseEntity<ApiResponse> getDoctorsByExperience(@PathVariable Integer years) {
        List<Doctor> doctors = doctorRepository.findByExperienceGreaterThanEqual(years);
        return ResponseEntity.ok(new ApiResponse(true, "Doctors found", doctors));
    }

    // Get doctor by email
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse> getDoctorByEmail(@PathVariable String email) {
        return doctorRepository.findByEmail(email)
            .map(doctor -> ResponseEntity.ok(new ApiResponse(true, "Doctor found", doctor)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Doctor not found with email: " + email)));
    }
}