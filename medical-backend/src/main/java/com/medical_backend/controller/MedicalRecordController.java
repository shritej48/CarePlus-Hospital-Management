package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.MedicalRecord;
import com.medical_backend.model.Patient;
import com.medical_backend.model.Doctor;
import com.medical_backend.model.RecordType;
import com.medical_backend.repository.MedicalRecordRepository;
import com.medical_backend.repository.PatientRepository;
import com.medical_backend.repository.DoctorRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "*")
public class MedicalRecordController {
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createMedicalRecord(@Valid @RequestBody MedicalRecord medicalRecord) {
        try {
            Patient patient = patientRepository.findById(medicalRecord.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            Doctor doctor = doctorRepository.findById(medicalRecord.getDoctor().getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            medicalRecord.setPatient(patient);
            medicalRecord.setDoctor(doctor);
            
            MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);
            return ResponseEntity.ok(new ApiResponse(true, "Medical record created successfully", savedRecord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllMedicalRecords() {
        List<MedicalRecord> records = medicalRecordRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Medical records retrieved successfully", records));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getMedicalRecordById(@PathVariable Long id) {
        return medicalRecordRepository.findById(id)
            .map(record -> ResponseEntity.ok(new ApiResponse(true, "Medical record found", record)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Medical record not found")));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patientId);
        return ResponseEntity.ok(new ApiResponse(true, "Medical records found", records));
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecord> records = medicalRecordRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(new ApiResponse(true, "Medical records found", records));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateMedicalRecord(@PathVariable Long id, @Valid @RequestBody MedicalRecord recordDetails) {
        return medicalRecordRepository.findById(id)
            .map(record -> {
                record.setDiagnosis(recordDetails.getDiagnosis());
                record.setSymptoms(recordDetails.getSymptoms());
                record.setTreatment(recordDetails.getTreatment());
                record.setNotes(recordDetails.getNotes());
                record.setBloodPressure(recordDetails.getBloodPressure());
                record.setTemperature(recordDetails.getTemperature());
                record.setHeartRate(recordDetails.getHeartRate());
                record.setWeight(recordDetails.getWeight());
                record.setHeight(recordDetails.getHeight());
                record.setAllergies(recordDetails.getAllergies());
                record.setRecordType(recordDetails.getRecordType());
                
                MedicalRecord updatedRecord = medicalRecordRepository.save(record);
                return ResponseEntity.ok(new ApiResponse(true, "Medical record updated successfully", updatedRecord));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Medical record not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteMedicalRecord(@PathVariable Long id) {
        return medicalRecordRepository.findById(id)
            .map(record -> {
                medicalRecordRepository.delete(record);
                return ResponseEntity.ok(new ApiResponse(true, "Medical record deleted successfully"));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Medical record not found")));
    }
    
    @GetMapping("/stats/{patientId}")
    public ResponseEntity<ApiResponse> getPatientMedicalStats(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVisits", records.size());
        
        if (!records.isEmpty()) {
            stats.put("lastVisit", records.get(0).getRecordDate());
        } else {
            stats.put("lastVisit", null);
        }
        
        long followUpCount = records.stream()
            .filter(r -> r.getRecordType() != null && r.getRecordType() == RecordType.FOLLOW_UP)
            .count();
        stats.put("followUpVisits", followUpCount);
        
        long emergencyCount = records.stream()
            .filter(r -> r.getRecordType() != null && r.getRecordType() == RecordType.EMERGENCY)
            .count();
        stats.put("emergencyVisits", emergencyCount);
        
        return ResponseEntity.ok(new ApiResponse(true, "Patient medical statistics", stats));
    }
}