package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.Appointment;
import com.medical_backend.model.AppointmentStatus;
import com.medical_backend.model.Doctor;
import com.medical_backend.model.Patient;
import com.medical_backend.repository.AppointmentRepository;
import com.medical_backend.repository.DoctorRepository;
import com.medical_backend.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    // Create new appointment
    @PostMapping
    public ResponseEntity<ApiResponse> createAppointment(@Valid @RequestBody Appointment appointment) {
        try {
            // Check if patient exists
            Patient patient = patientRepository.findById(appointment.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            // Check if doctor exists
            Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            // Check if doctor is available at that time
            long existingAppointments = appointmentRepository.countByDoctorIdAndAppointmentDate(
                doctor.getId(), appointment.getAppointmentDate());
            
            if (existingAppointments >= 10) { // Assuming max 10 appointments per day per doctor
                return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Doctor is fully booked for this date"));
            }
            
            appointment.setPatient(patient);
            appointment.setDoctor(doctor);
            
            Appointment savedAppointment = appointmentRepository.save(appointment);
            return ResponseEntity.ok(new ApiResponse(true, "Appointment booked successfully", savedAppointment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    // Get all appointments
    @GetMapping
    public ResponseEntity<ApiResponse> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Appointments retrieved successfully", appointments));
    }
    
    // Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getAppointmentById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
            .map(appointment -> ResponseEntity.ok(new ApiResponse(true, "Appointment found", appointment)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Appointment not found with id: " + id)));
    }
    
    // Update appointment
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateAppointment(@PathVariable Long id, @Valid @RequestBody Appointment appointmentDetails) {
        return appointmentRepository.findById(id)
            .map(appointment -> {
                appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                appointment.setSymptoms(appointmentDetails.getSymptoms());
                appointment.setRemarks(appointmentDetails.getRemarks());
                
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                return ResponseEntity.ok(new ApiResponse(true, "Appointment updated successfully", updatedAppointment));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Appointment not found with id: " + id)));
    }
    
    // Cancel appointment
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
            .map(appointment -> {
                appointment.setStatus(AppointmentStatus.CANCELLED);
                appointment.setRemarks("Cancelled by patient");
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                return ResponseEntity.ok(new ApiResponse(true, "Appointment cancelled successfully", updatedAppointment));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Appointment not found with id: " + id)));
    }
    
    // Update appointment status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateAppointmentStatus(@PathVariable Long id, @RequestParam AppointmentStatus status) {
        return appointmentRepository.findById(id)
            .map(appointment -> {
                appointment.setStatus(status);
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                return ResponseEntity.ok(new ApiResponse(true, "Appointment status updated successfully", updatedAppointment));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Appointment not found with id: " + id)));
    }
    
    // Get appointments by patient
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getAppointmentsByPatient(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        if (appointments.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "No appointments found for this patient", appointments));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Appointments found", appointments));
    }
    
    // Get appointments by doctor
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        if (appointments.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse(true, "No appointments found for this doctor", appointments));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Appointments found", appointments));
    }
    
    // Get appointments by date
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse> getAppointmentsByDate(@PathVariable String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<Appointment> appointments = appointmentRepository.findByAppointmentDate(appointmentDate);
        return ResponseEntity.ok(new ApiResponse(true, "Appointments found", appointments));
    }
    
    // Get appointments by doctor and date
    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<ApiResponse> getAppointmentsByDoctorAndDate(@PathVariable Long doctorId, @PathVariable String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, appointmentDate);
        return ResponseEntity.ok(new ApiResponse(true, "Appointments found", appointments));
    }
    
    // Get today's appointments
    @GetMapping("/today")
    public ResponseEntity<ApiResponse> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        List<Appointment> appointments = appointmentRepository.findByAppointmentDate(today);
        return ResponseEntity.ok(new ApiResponse(true, "Today's appointments", appointments));
    }
    
    // Get upcoming appointments
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse> getUpcomingAppointments() {
        LocalDate today = LocalDate.now();
        List<Appointment> appointments = appointmentRepository.findAppointmentsBetweenDates(today, today.plusDays(7));
        return ResponseEntity.ok(new ApiResponse(true, "Upcoming appointments for next 7 days", appointments));
    }
    
    // Get appointment statistics
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getAppointmentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("todayAppointments", appointmentRepository.findByAppointmentDate(LocalDate.now()).size());
        stats.put("upcomingAppointments", appointmentRepository.findAppointmentsBetweenDates(LocalDate.now(), LocalDate.now().plusDays(7)).size());
        
        return ResponseEntity.ok(new ApiResponse(true, "Appointment statistics", stats));
    }
}