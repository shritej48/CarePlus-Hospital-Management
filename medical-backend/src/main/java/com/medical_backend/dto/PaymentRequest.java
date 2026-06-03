package com.medical_backend.dto;

import com.medical_backend.model.PaymentMethod;

public class PaymentRequest {
    private PaymentMethod paymentMethod;
    private String transactionId;
    private String remarks;
    
    // Getters and Setters
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}