package com.medical_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicalBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MedicalBackendApplication.class, args);
        System.out.println("🚀 Hospital Management System Started Successfully!");
        System.out.println("📝 Registration API: http://localhost:8080/api/auth/register");
    }
}