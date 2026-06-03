package com.medical_backend.repository;

import com.medical_backend.model.Billing;
import com.medical_backend.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillingRepository extends JpaRepository<Billing, Long> {
    
    Optional<Billing> findByInvoiceNumber(String invoiceNumber);
    
    List<Billing> findByPatientId(Long patientId);
    
    List<Billing> findByPaymentStatus(PaymentStatus status);
    
    List<Billing> findByAppointmentId(Long appointmentId);
    
    @Query("SELECT b FROM Billing b WHERE b.paymentDate BETWEEN :startDate AND :endDate")
    List<Billing> findBillingsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(b.totalAmount) FROM Billing b WHERE b.paymentStatus = 'PAID' AND b.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(b) FROM Billing b WHERE b.paymentStatus = 'PENDING'")
    long countPendingPayments();
    
    @Query("SELECT SUM(b.totalAmount) FROM Billing b WHERE b.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();
}