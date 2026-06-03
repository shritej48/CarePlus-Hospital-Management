package com.medical_backend.service;

import com.medical_backend.model.*;
import com.medical_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private BillingRepository billingRepository;
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Patient Statistics
        long totalPatients = patientRepository.count();
        stats.put("totalPatients", totalPatients);
        
        // Doctor Statistics
        long totalDoctors = doctorRepository.count();
        stats.put("totalDoctors", totalDoctors);
        
        // Appointment Statistics
        long totalAppointments = appointmentRepository.count();
        long todayAppointments = appointmentRepository.findByAppointmentDate(LocalDate.now()).size();
        long upcomingAppointments = appointmentRepository.findAppointmentsBetweenDates(
            LocalDate.now(), LocalDate.now().plusDays(7)).size();
        
        stats.put("totalAppointments", totalAppointments);
        stats.put("todayAppointments", todayAppointments);
        stats.put("upcomingAppointments", upcomingAppointments);
        
        // Revenue Statistics
        BigDecimal totalRevenue = billingRepository.getTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        long pendingPayments = billingRepository.countPendingPayments();
        stats.put("pendingPayments", pendingPayments);
        
        // Medical Records
        long totalMedicalRecords = medicalRecordRepository.count();
        stats.put("totalMedicalRecords", totalMedicalRecords);
        
        return stats;
    }
    
    public Map<String, Object> getMonthlyStats() {
        Map<String, Object> monthlyStats = new HashMap<>();
        
        List<Map<String, Object>> appointmentsByMonth = new ArrayList<>();
        List<Map<String, Object>> revenueByMonth = new ArrayList<>();
        
        // Get last 6 months data
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime startOfMonth = now.minusMonths(i).withDayOfMonth(1).toLocalDate().atStartOfDay();
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
            
            String monthName = startOfMonth.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            
            // Count appointments for the month
            long appointmentCount = appointmentRepository.findAppointmentsBetweenDates(
                startOfMonth.toLocalDate(), endOfMonth.toLocalDate()).size();
            Map<String, Object> appointmentData = new HashMap<>();
            appointmentData.put("month", monthName);
            appointmentData.put("count", appointmentCount);
            appointmentsByMonth.add(appointmentData);
            
            // Calculate revenue for the month
            BigDecimal monthlyRevenue = billingRepository.getTotalRevenueBetweenDates(startOfMonth, endOfMonth);
            Map<String, Object> revenueData = new HashMap<>();
            revenueData.put("month", monthName);
            revenueData.put("revenue", monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO);
            revenueByMonth.add(revenueData);
        }
        
        monthlyStats.put("appointmentsByMonth", appointmentsByMonth);
        monthlyStats.put("revenueByMonth", revenueByMonth);
        
        return monthlyStats;
    }
    
    public Map<String, Object> getDoctorPerformance() {
        List<Map<String, Object>> doctorStats = new ArrayList<>();
        List<Doctor> doctors = doctorRepository.findAll();
        
        for (Doctor doctor : doctors) {
            Map<String, Object> doctorData = new HashMap<>();
            doctorData.put("doctorId", doctor.getId());
            doctorData.put("doctorName", doctor.getFirstName() + " " + doctor.getLastName());
            doctorData.put("specialization", doctor.getSpecialization());
            
            long totalAppointments = appointmentRepository.findByDoctorId(doctor.getId()).size();
            doctorData.put("totalAppointments", totalAppointments);
            
            long completedAppointments = appointmentRepository.findByDoctorIdAndStatus(
                doctor.getId(), AppointmentStatus.COMPLETED).size();
            doctorData.put("completedAppointments", completedAppointments);
            
            long cancelledAppointments = appointmentRepository.findByDoctorIdAndStatus(
                doctor.getId(), AppointmentStatus.CANCELLED).size();
            doctorData.put("cancelledAppointments", cancelledAppointments);
            
            doctorStats.add(doctorData);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("doctorPerformance", doctorStats);
        return result;
    }
    
    public Map<String, Object> getPatientDemographics() {
        Map<String, Object> demographics = new HashMap<>();
        
        // Gender distribution
        List<Patient> patients = patientRepository.findAll();
        long maleCount = patients.stream().filter(p -> "Male".equalsIgnoreCase(p.getGender())).count();
        long femaleCount = patients.stream().filter(p -> "Female".equalsIgnoreCase(p.getGender())).count();
        long otherCount = patients.size() - maleCount - femaleCount;
        
        Map<String, Long> genderDistribution = new HashMap<>();
        genderDistribution.put("Male", maleCount);
        genderDistribution.put("Female", femaleCount);
        genderDistribution.put("Other", otherCount);
        demographics.put("genderDistribution", genderDistribution);
        
        // Age distribution
        long under18 = 0, age18to30 = 0, age31to50 = 0, age51to70 = 0, above70 = 0;
        
        for (Patient patient : patients) {
            if (patient.getDateOfBirth() != null) {
                int age = LocalDate.now().getYear() - patient.getDateOfBirth().getYear();
                if (age < 18) under18++;
                else if (age <= 30) age18to30++;
                else if (age <= 50) age31to50++;
                else if (age <= 70) age51to70++;
                else above70++;
            }
        }
        
        Map<String, Long> ageDistribution = new HashMap<>();
        ageDistribution.put("Under 18", under18);
        ageDistribution.put("18-30", age18to30);
        ageDistribution.put("31-50", age31to50);
        ageDistribution.put("51-70", age51to70);
        ageDistribution.put("Above 70", above70);
        demographics.put("ageDistribution", ageDistribution);
        
        // Blood group distribution
        Map<String, Long> bloodGroupDistribution = new HashMap<>();
        for (Patient patient : patients) {
            String bloodGroup = patient.getBloodGroup();
            if (bloodGroup != null && !bloodGroup.isEmpty()) {
                bloodGroupDistribution.put(bloodGroup, 
                    bloodGroupDistribution.getOrDefault(bloodGroup, 0L) + 1);
            }
        }
        demographics.put("bloodGroupDistribution", bloodGroupDistribution);
        
        return demographics;
    }
}