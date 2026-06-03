import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Components
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AnimationDemo from './components/AnimationDemo';
// Patient Components
import PatientDashboard from './components/Patients/PatientDashboard';
import PatientDoctors from './components/Patients/PatientDoctors';
import PatientAppointments from './components/Patients/PatientAppointments';
import PatientMedicalRecords from './components/Patients/PatientMedicalRecords';
import PatientBilling from './components/Patients/PatientBilling';
import PatientProfile from './components/Patients/PatientProfile';
import PatientNotifications from './components/Patients/PatientNotifications';
import PatientBookAppointment from './components/Patients/PatientBookAppointment'; // 🆕

// Doctor Components
import DoctorApp from './components/Doctor/DoctorApp';
import DoctorAppointments from './components/Doctor/DoctorAppointments'; // 🆕

// Staff Components
import StaffApp from './components/Staff/StaffApp';
import StaffAppointments from './components/Staff/StaffAppointments'; // 🆕

// Admin Components
import AdminApp from './components/Admin/AdminApp';

import './index.css';

function App() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAuthenticated = user !== null;
    const userRole = user?.role || null;

    console.log('App State:', { isAuthenticated, userRole, user });

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Patient Routes */}
                <Route path="/patient/dashboard" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientDashboard /> : <Navigate to="/login" />
                } />
                <Route path="/patient/doctors" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientDoctors /> : <Navigate to="/login" />
                } />
                <Route path="/patient/appointments" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientAppointments /> : <Navigate to="/login" />
                } />
                <Route path="/patient/medical-records" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientMedicalRecords /> : <Navigate to="/login" />
                } />
                <Route path="/patient/billing" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientBilling /> : <Navigate to="/login" />
                } />
                <Route path="/patient/profile" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientProfile /> : <Navigate to="/login" />
                } />
                <Route path="/patient/notifications" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientNotifications /> : <Navigate to="/login" />
                } />
                {/* 🆕 Patient book appointment */}
                <Route path="/patient/book-appointment" element={
                    isAuthenticated && userRole === 'PATIENT' ? <PatientBookAppointment /> : <Navigate to="/login" />
                } />

                {/* Doctor Routes – more specific routes first, then wildcard */}
                <Route path="/doctor/appointments" element={
                    isAuthenticated && userRole === 'DOCTOR' ? <DoctorAppointments /> : <Navigate to="/login" />
                } />
                <Route path="/doctor/*" element={
                    isAuthenticated && userRole === 'DOCTOR' ? <DoctorApp /> : <Navigate to="/login" />
                } />

                {/* Staff Routes – more specific routes first, then wildcard */}
                <Route path="/staff/appointments" element={
                    isAuthenticated && userRole === 'STAFF' ? <StaffAppointments /> : <Navigate to="/login" />
                } />
                <Route path="/staff/*" element={
                    isAuthenticated && userRole === 'STAFF' ? <StaffApp /> : <Navigate to="/login" />
                } />

                <Route path="/animation-demo" element={<AnimationDemo />} />
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                    isAuthenticated && userRole === 'ADMIN' ? <AdminApp /> : <Navigate to="/login" />
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-right" />
        </Router>
    );
}

export default App;