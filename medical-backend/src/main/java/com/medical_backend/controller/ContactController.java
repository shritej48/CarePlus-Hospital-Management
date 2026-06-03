package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import com.medical_backend.model.ContactMessage;
import com.medical_backend.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactRepository;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitMessage(@Valid @RequestBody ContactMessage message) {
        try {
            ContactMessage saved = contactRepository.save(message);
            return ResponseEntity.ok(new ApiResponse(true, "Message sent successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to send message: " + e.getMessage()));
        }
    }
}