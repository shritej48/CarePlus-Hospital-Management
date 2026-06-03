// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Backend not running! Start Spring Boot on port 8080');
      alert('Cannot connect to backend. Please make sure Spring Boot is running on http://localhost:8080');
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  testAuth: () => api.get('/auth/test-auth'),
};

// ==================== DOCTORS ====================
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  search: (keyword) => api.get(`/doctors/search?keyword=${keyword}`),
  getBySpecialization: (specialization) => api.get(`/doctors/specialization/${specialization}`),
  getByExperience: (years) => api.get(`/doctors/experience/${years}`),
  getByEmail: (email) => api.get(`/doctors/email/${email}`),
};

// ==================== PATIENTS ====================
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (keyword) => api.get(`/patients/search?keyword=${keyword}`),
  getByEmail: (email) => api.get(`/patients/email/${email}`),
};

// ==================== APPOINTMENTS ====================
export const appointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status?status=${status}`),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getByDate: (date) => api.get(`/appointments/date/${date}`),
  getByDoctorAndDate: (doctorId, date) => api.get(`/appointments/doctor/${doctorId}/date/${date}`),
  getToday: () => api.get('/appointments/today'),
  getUpcoming: () => api.get('/appointments/upcoming'),
  getStats: () => api.get('/appointments/stats'),
};

// ==================== PRESCRIPTIONS ====================
export const prescriptionAPI = {
  getAll: () => api.get('/prescriptions'),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  deactivate: (id) => api.put(`/prescriptions/${id}/deactivate`),
  getByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}`),
  getActiveByPatient: (patientId) => api.get(`/prescriptions/patient/${patientId}/active`),
  getByDoctor: (doctorId) => api.get(`/prescriptions/doctor/${doctorId}`),
  getExpired: () => api.get('/prescriptions/expired'),
};

// ==================== MEDICAL RECORDS ====================
export const medicalRecordAPI = {
  getAll: () => api.get('/medical-records'),
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
  getByPatient: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/medical-records/doctor/${doctorId}`),
  getPatientStats: (patientId) => api.get(`/medical-records/stats/${patientId}`),
};

// ==================== BILLING ====================
export const billingAPI = {
  getAll: () => api.get('/billing'),
  getById: (id) => api.get(`/billing/${id}`),
  create: (data) => api.post('/billing', data),
  update: (id, data) => api.put(`/billing/${id}`, data),
  delete: (id) => api.delete(`/billing/${id}`),
  pay: (id, paymentData) => api.put(`/billing/${id}/pay`, paymentData),
  getByPatient: (patientId) => api.get(`/billing/patient/${patientId}`),
  getByInvoiceNumber: (invoiceNumber) => api.get(`/billing/number/${invoiceNumber}`),
  getPending: () => api.get('/billing/pending'),
  getRevenueReport: (startDate, endDate) => api.get(`/billing/revenue?startDate=${startDate}&endDate=${endDate}`),
  getDashboard: () => api.get('/billing/dashboard'),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getMonthly: () => api.get('/dashboard/monthly'),
  getDoctorPerformance: () => api.get('/dashboard/doctors/performance'),
  getPatientDemographics: () => api.get('/dashboard/patients/demographics'),
  getFullReport: () => api.get('/dashboard/full-report'),
};

// ==================== TEST ====================
export const testAPI = {
  hello: () => api.get('/test/hello'),
};

export default api;