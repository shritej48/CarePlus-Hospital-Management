package com.medical_backend.repository;

import com.medical_backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPatientId(Long patientId);
    
    List<Prescription> findByDoctorId(Long doctorId);
    
    List<Prescription> findByMedicalRecordId(Long medicalRecordId);
    
    List<Prescription> findByPatientIdAndIsActiveTrue(Long patientId);
    
    @Query("SELECT p FROM Prescription p WHERE p.endDate < :date AND p.isActive = true")
    List<Prescription> findExpiredPrescriptions(@Param("date") LocalDate date);
}