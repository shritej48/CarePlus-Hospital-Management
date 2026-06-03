package com.medical_backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private String patientName;
    private String patientEmail;
    private BigDecimal amount;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private String description;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String transactionId;
    private LocalDateTime createdAt;
}