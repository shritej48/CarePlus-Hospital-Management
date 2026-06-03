package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        try {
            Object stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(new ApiResponse(true, "Dashboard statistics retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse> getMonthlyStats() {
        try {
            Object stats = dashboardService.getMonthlyStats();
            return ResponseEntity.ok(new ApiResponse(true, "Monthly statistics retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/doctors/performance")
    public ResponseEntity<ApiResponse> getDoctorPerformance() {
        try {
            Object stats = dashboardService.getDoctorPerformance();
            return ResponseEntity.ok(new ApiResponse(true, "Doctor performance retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/patients/demographics")
    public ResponseEntity<ApiResponse> getPatientDemographics() {
        try {
            Object demographics = dashboardService.getPatientDemographics();
            return ResponseEntity.ok(new ApiResponse(true, "Patient demographics retrieved", demographics));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/full-report")
    public ResponseEntity<ApiResponse> getFullReport() {
        try {
            java.util.Map<String, Object> fullReport = new java.util.HashMap<>();
            fullReport.put("dashboardStats", dashboardService.getDashboardStats());
            fullReport.put("monthlyStats", dashboardService.getMonthlyStats());
            fullReport.put("doctorPerformance", dashboardService.getDoctorPerformance());
            fullReport.put("patientDemographics", dashboardService.getPatientDemographics());
            
            return ResponseEntity.ok(new ApiResponse(true, "Full report generated", fullReport));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
}