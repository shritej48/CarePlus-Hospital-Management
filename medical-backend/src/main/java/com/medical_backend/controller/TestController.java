package com.medical_backend.controller;

import com.medical_backend.dto.ApiResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    @GetMapping("/hello")
    public ApiResponse hello() {
        return new ApiResponse(true, "Hospital Management System API is running!", null);
    }
}