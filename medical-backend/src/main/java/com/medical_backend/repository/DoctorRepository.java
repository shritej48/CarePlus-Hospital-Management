package com.medical_backend.repository;

import com.medical_backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByPhoneNumber(String phoneNumber);
    
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    
    @Query("SELECT d FROM Doctor d WHERE d.firstName LIKE %:keyword% OR d.lastName LIKE %:keyword% OR d.specialization LIKE %:keyword%")
    List<Doctor> searchDoctors(@Param("keyword") String keyword);
    
    List<Doctor> findByExperienceGreaterThanEqual(Integer experience);
}