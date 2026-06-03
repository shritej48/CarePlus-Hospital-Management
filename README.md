# 🏥 CarePlus – Hospital Management System

[![Java](https://img.shields.io/badge/Java-17-blue.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/shritej48/CarePlus-Hospital-Management)

## 📌 Overview

**CarePlus** is a full‑stack web‑based hospital management system designed to digitize and streamline healthcare operations. It provides three distinct role‑based portals – **Admin**, **Doctor**, and **Patient** – each with customised dashboards and functionalities. The system enables online appointment booking, electronic prescription management, patient medical record access, doctor profile management, and administrative oversight.

## ✨ Features

### 👨‍⚕️ Admin Portal
- Dashboard with real‑time statistics (total doctors, patients, today’s appointments)
- Manage doctors (add/edit/delete with image upload & auto‑generated password)
- Manage patients (view, search, delete)
- Manage appointments (view all, create, cancel)
- **Database Viewer** – browse any table with search, pagination & CSV export
- Analytics (revenue trends, top doctors, appointment status breakdown)

### 👨‍🏥 Doctor Portal
- View assigned appointments (confirm / cancel)
- Write, edit & delete electronic prescriptions
- View patient list and medical records (prescriptions)
- Edit own profile & change password

### 👤 Patient Portal
- Register & login
- Book appointments (dynamic time slots – past times disabled)
- Cancel upcoming appointments
- View prescription history & medical records
- Edit profile & change password

### 🌍 Public Home Page
- Hero section with statistics counter
- List of doctors (fetched from backend)
- Departments, facilities, testimonials, contact form
- Contact messages saved to database

## 🛠️ Technology Stack

| Layer       | Technology |
|-------------|------------|
| **Frontend** | React 18, Vite, Bootstrap, Tailwind CSS, Framer Motion, Chart.js |
| **Backend**  | Spring Boot 3.3.5, Spring Data JPA, Hibernate, MySQL Driver |
| **Database** | MySQL 8.0 |
| **Build Tools** | Maven (backend), npm (frontend) |
| **APIs**     | RESTful JSON over HTTP |
| **Security** | BCrypt password encoding, role‑based routing |

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/shritej48/CarePlus-Hospital-Management.git
cd CarePlus-Hospital-Management
