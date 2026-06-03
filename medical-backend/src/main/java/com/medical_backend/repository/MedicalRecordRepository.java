package com.medical_backend.repository;

import com.medical_backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    List<MedicalRecord> findByPatientIdOrderByRecordDateDesc(Long patientId);
    
    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId AND m.recordDate BETWEEN :startDate AND :endDate")
    List<MedicalRecord> findPatientRecordsBetweenDates(@Param("patientId") Long patientId, 
                                                        @Param("startDate") LocalDate startDate, 
                                                        @Param("endDate") LocalDate endDate);
}