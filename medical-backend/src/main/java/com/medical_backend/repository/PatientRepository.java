package com.medical_backend.repository;

import com.medical_backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByEmail(String email);
    
    Optional<Patient> findByPhoneNumber(String phoneNumber);
    
    Optional<Patient> findByUserId(Long userId);
    
    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Patient> searchPatients(@Param("keyword") String keyword);
}