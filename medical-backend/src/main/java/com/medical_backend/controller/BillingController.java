package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.dto.PaymentRequest;
import com.medical_backend.model.Billing;
import com.medical_backend.model.PaymentStatus;
import com.medical_backend.model.Patient;
import com.medical_backend.repository.BillingRepository;
import com.medical_backend.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {
    
    @Autowired
    private BillingRepository billingRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createInvoice(@Valid @RequestBody Billing billing) {
        try {
            Patient patient = patientRepository.findById(billing.getPatient().getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            billing.setPatient(patient);
            billing.calculateTotal();
            
            Billing savedBilling = billingRepository.save(billing);
            return ResponseEntity.ok(new ApiResponse(true, "Invoice created successfully", savedBilling));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllInvoices() {
        List<Billing> invoices = billingRepository.findAll();
        return ResponseEntity.ok(new ApiResponse(true, "Invoices retrieved successfully", invoices));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInvoiceById(@PathVariable Long id) {
        return billingRepository.findById(id)
            .map(invoice -> ResponseEntity.ok(new ApiResponse(true, "Invoice found", invoice)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Invoice not found with id: " + id)));
    }
    
    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<ApiResponse> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return billingRepository.findByInvoiceNumber(invoiceNumber)
            .map(invoice -> ResponseEntity.ok(new ApiResponse(true, "Invoice found", invoice)))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Invoice not found with number: " + invoiceNumber)));
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getInvoicesByPatient(@PathVariable Long patientId) {
        List<Billing> invoices = billingRepository.findByPatientId(patientId);
        return ResponseEntity.ok(new ApiResponse(true, "Invoices found", invoices));
    }
    
    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPendingInvoices() {
        List<Billing> pendingInvoices = billingRepository.findByPaymentStatus(PaymentStatus.PENDING);
        return ResponseEntity.ok(new ApiResponse(true, "Pending invoices", pendingInvoices));
    }
    
    @PutMapping("/{id}/pay")
    public ResponseEntity<ApiResponse> processPayment(@PathVariable Long id, @Valid @RequestBody PaymentRequest paymentRequest) {
        return billingRepository.findById(id)
            .map(invoice -> {
                invoice.setPaymentStatus(PaymentStatus.PAID);
                invoice.setPaymentMethod(paymentRequest.getPaymentMethod());
                invoice.setTransactionId(paymentRequest.getTransactionId());
                invoice.setPaymentDate(LocalDateTime.now());
                invoice.setRemarks(paymentRequest.getRemarks());
                
                Billing updatedInvoice = billingRepository.save(invoice);
                return ResponseEntity.ok(new ApiResponse(true, "Payment processed successfully", updatedInvoice));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Invoice not found")));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateInvoice(@PathVariable Long id, @Valid @RequestBody Billing billingDetails) {
        return billingRepository.findById(id)
            .map(invoice -> {
                invoice.setAmount(billingDetails.getAmount());
                invoice.setTax(billingDetails.getTax());
                invoice.setDiscount(billingDetails.getDiscount());
                invoice.setDescription(billingDetails.getDescription());
                invoice.calculateTotal();
                
                Billing updatedInvoice = billingRepository.save(invoice);
                return ResponseEntity.ok(new ApiResponse(true, "Invoice updated successfully", updatedInvoice));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Invoice not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteInvoice(@PathVariable Long id) {
        return billingRepository.findById(id)
            .map(invoice -> {
                billingRepository.delete(invoice);
                return ResponseEntity.ok(new ApiResponse(true, "Invoice deleted successfully"));
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, "Invoice not found")));
    }
    
    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse> getRevenueReport(@RequestParam(required = false) String startDate,
                                                        @RequestParam(required = false) String endDate) {
        try {
            Map<String, Object> revenueReport = new HashMap<>();
            
            BigDecimal totalRevenue = billingRepository.getTotalRevenue();
            revenueReport.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            
            long pendingPayments = billingRepository.countPendingPayments();
            revenueReport.put("pendingPayments", pendingPayments);
            
            long paidInvoices = billingRepository.findByPaymentStatus(PaymentStatus.PAID).size();
            revenueReport.put("paidInvoices", paidInvoices);
            
            revenueReport.put("totalInvoices", billingRepository.count());
            
            if (startDate != null && endDate != null) {
                LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
                LocalDateTime end = LocalDate.parse(endDate).atTime(LocalTime.MAX);
                
                BigDecimal periodRevenue = billingRepository.getTotalRevenueBetweenDates(start, end);
                revenueReport.put("periodRevenue", periodRevenue != null ? periodRevenue : BigDecimal.ZERO);
                revenueReport.put("periodStart", startDate);
                revenueReport.put("periodEnd", endDate);
            }
            
            return ResponseEntity.ok(new ApiResponse(true, "Revenue report generated", revenueReport));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getBillingDashboard() {
        Map<String, Object> stats = new HashMap<>();
        
        BigDecimal totalRevenue = billingRepository.getTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        long pendingInvoices = billingRepository.countPendingPayments();
        stats.put("pendingInvoices", pendingInvoices);
        
        stats.put("totalInvoices", billingRepository.count());
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        LocalDateTime now = LocalDateTime.now();
        BigDecimal last30DaysRevenue = billingRepository.getTotalRevenueBetweenDates(thirtyDaysAgo, now);
        stats.put("last30DaysRevenue", last30DaysRevenue != null ? last30DaysRevenue : BigDecimal.ZERO);
        
        return ResponseEntity.ok(new ApiResponse(true, "Billing dashboard stats", stats));
    }
}