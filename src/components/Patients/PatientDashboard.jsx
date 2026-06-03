// src/components/Patients/PatientDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarCheck, FaUserMd, FaClock, FaPrescription, FaHeartbeat,
  FaBell, FaChartLine, FaArrowRight, FaCalendarAlt, FaStethoscope,
  FaTimes, FaEdit, FaTrashAlt, FaCheckCircle, FaSpinner,
  FaMapMarkerAlt, FaRupeeSign, FaWallet, FaStar, FaPills
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import toast from 'react-hot-toast';
import { appointmentAPI, prescriptionAPI, doctorAPI } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper: convert "09:00 AM" → "09:00:00"
const convertTimeToISO = (timeStr) => {
  if (!timeStr) return null;
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
};

const normalizeStatus = (status) => {
  if (!status) return 'Scheduled';
  const lower = status.toLowerCase();
  if (lower === 'confirmed') return 'Confirmed';
  if (lower === 'cancelled') return 'Cancelled';
  if (lower === 'pending') return 'Pending';
  if (lower === 'completed') return 'Completed';
  if (lower === 'scheduled') return 'Scheduled';
  return 'Scheduled';
};

const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;
const cleanMessage = (msg) => {
  if (!msg) return "Notification";
  let cleaned = msg.replace(/undefined undefined/g, "Doctor");
  cleaned = cleaned.replace(/undefined/g, "");
  cleaned = cleaned.replace(/\s+/g, " ").trim();
  return cleaned || "Notification";
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, type: "spring", stiffness: 300 } },
  hover: { y: -8, boxShadow: "0 20px 30px -12px rgba(0,0,0,0.15)", transition: { type: "spring", stiffness: 400 } }
};

const PatientDashboard = () => {
  const [user, setUser] = useState({});
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    symptoms: '',
    type: 'Consultation'
  });
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalAppointments: 0,
    prescriptions: 0,
    completedVisits: 0,
    healthScore: 85,
    totalSpent: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const allTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];
  const [availableTimeSlots, setAvailableTimeSlots] = useState(allTimeSlots);

  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedPatientId = localStorage.getItem('patientId');
    if (!userStr) {
      window.location.href = '/login';
      return;
    }
    const loggedUser = JSON.parse(userStr);
    if (loggedUser.role !== 'PATIENT') {
      window.location.href = '/login';
      return;
    }
    setUser(loggedUser);
    if (!storedPatientId) {
      toast.error('Patient profile not found. Please contact admin or re-register.');
    } else {
      setPatientId(parseInt(storedPatientId));
    }
    loadData(loggedUser.id, storedPatientId);
  }, []);

  const loadData = async (userId, patId) => {
    setLoading(true);
    try {
      const effectivePatientId = patId || userId;
      const appointmentsRes = await appointmentAPI.getByPatient(effectivePatientId);
      let appointments = appointmentsRes.data?.data || appointmentsRes.data || [];
      
      const today = new Date().toISOString().split('T')[0];
      const upcoming = appointments.filter(apt => 
        apt.appointmentDate >= today && apt.status !== 'CANCELLED'
      );
      const completed = appointments.filter(apt => apt.status === 'COMPLETED');
      
      setStats(prev => ({
        ...prev,
        upcomingAppointments: upcoming.length,
        totalAppointments: appointments.length,
        completedVisits: completed.length,
      }));
      
      upcoming.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
      setUpcomingAppointments(upcoming.slice(0, 3));
      
      const prescriptionsRes = await prescriptionAPI.getByPatient(effectivePatientId);
      let prescriptionsList = prescriptionsRes.data?.data || prescriptionsRes.data || [];
      setPrescriptions(prescriptionsList);
      setStats(prev => ({ ...prev, prescriptions: prescriptionsList.length }));
      
      const doctorsRes = await doctorAPI.getAll();
      let doctorsList = doctorsRes.data?.data || doctorsRes.data || [];
      setDoctors(doctorsList);
      
      const notifKey = getStorageKey('notifications', userId);
      let allNotifications = JSON.parse(localStorage.getItem(notifKey) || '[]');
      allNotifications = allNotifications.map(notif => ({
        ...notif,
        message: cleanMessage(notif.message)
      }));
      allNotifications.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
      setNotifications(allNotifications.slice(0, 3));
      
      const activities = appointments.slice(-3).map(apt => ({
        id: apt.id,
        action: `Appointment ${apt.status === 'SCHEDULED' ? 'booked' : apt.status} with Dr. ${apt.doctor?.firstName || ''} ${apt.doctor?.lastName || ''}`,
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        icon: apt.status === 'SCHEDULED' ? '📅' : (apt.status === 'COMPLETED' ? '✅' : '❌')
      }));
      setRecentActivities(activities);
      
    } catch (err) {
      console.error('Failed to load patient data', err);
      toast.error('Failed to load dashboard data. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // ==================== CORRECTED TIME SLOT FILTER ====================
  useEffect(() => {
    if (!bookingData.date) {
      setAvailableTimeSlots(allTimeSlots);
      setBookingData(prev => ({ ...prev, time: '' }));
      return;
    }

    // Get local today's date string (YYYY-MM-DD)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const selectedDateStr = bookingData.date;
    
    let filtered = [...allTimeSlots];

    // If selected date is today, filter out past time slots
    if (selectedDateStr === todayStr) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      filtered = allTimeSlots.filter(timeSlot => {
        const [time, modifier] = timeSlot.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        minutes = parseInt(minutes);
        
        // Convert to 24-hour format
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        // Compare with current time
        if (hours < currentHour) return false;
        if (hours === currentHour && minutes <= currentMinute) return false;
        return true;
      });
    }
    
    setAvailableTimeSlots(filtered);
    if (filtered.length > 0) {
      setBookingData(prev => ({ ...prev, time: filtered[0] }));
    } else {
      setBookingData(prev => ({ ...prev, time: '' }));
      toast.error('No available time slots left for today. Please choose another date.');
    }
  }, [bookingData.date]);

  const handleDoctorSelect = (e) => {
    const doctorId = parseInt(e.target.value);
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor);
    setBookingData({
      ...bookingData,
      doctorId: doctorId,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`
    });
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookingData.doctorId || !bookingData.date || !bookingData.time) {
      toast.error('Please select doctor, date and time');
      return;
    }
    
    // Additional check: if no time slot is available
    if (!bookingData.time) {
      toast.error('Please select a valid time slot');
      return;
    }
    
    // Validate time not in past for today
    const selectedDateStr = bookingData.date;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (selectedDateStr === todayStr) {
      const [time, modifier] = bookingData.time.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime < now) {
        toast.error('Cannot book a time that has already passed. Please choose a future slot.');
        return;
      }
    }
    
    const effectivePatientId = patientId || localStorage.getItem('patientId');
    if (!effectivePatientId) {
      toast.error('Patient profile missing. Please logout and login again.');
      return;
    }
    
    try {
      const appointmentData = {
        patient: { id: parseInt(effectivePatientId) },
        doctor: { id: parseInt(bookingData.doctorId) },
        appointmentDate: bookingData.date,
        appointmentTime: convertTimeToISO(bookingData.time),
        symptoms: bookingData.symptoms,
        remarks: bookingData.type
      };
      const response = await appointmentAPI.create(appointmentData);
      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setShowBookingModal(false);
        setBookingData({ doctorId: '', doctorName: '', date: '', time: '', symptoms: '', type: 'Consultation' });
        setSelectedDoctor(null);
        loadData(user.id, effectivePatientId);
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      if (err.response?.data?.message?.includes('Patient not found')) {
        toast.error('Patient profile not found. Please contact admin or re-register.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to book appointment');
      }
    }
  };

  const handleCancelAppointment = async (appointment) => {
    if (window.confirm(`Cancel appointment on ${appointment.appointmentDate}?`)) {
      try {
        await appointmentAPI.cancel(appointment.id);
        toast.success('Appointment cancelled');
        const effectivePatientId = patientId || localStorage.getItem('patientId');
        loadData(user.id, effectivePatientId);
      } catch (err) {
        console.error(err);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const getStatusBadge = (status) => {
    const normalized = normalizeStatus(status);
    const badges = {
      Confirmed: { bg: '#d1fae5', color: '#065f46', icon: <FaCheckCircle />, text: 'Confirmed' },
      Scheduled: { bg: '#dbeafe', color: '#1e40af', icon: <FaClock />, text: 'Scheduled' },
      Completed: { bg: '#e9ecef', color: '#495057', icon: <FaCheckCircle />, text: 'Completed' },
      Cancelled: { bg: '#fee2e2', color: '#991b1b', icon: <FaTimes />, text: 'Cancelled' },
      Pending: { bg: '#fed7aa', color: '#92400e', icon: <FaSpinner />, text: 'Pending' }
    };
    return badges[normalized] || badges.Scheduled;
  };

  const healthTips = [
    { icon: '💧', title: 'Stay Hydrated', desc: 'Drink 8 glasses daily' },
    { icon: '😴', title: 'Quality Sleep', desc: '7-8 hours for better immunity' },
    { icon: '🏃', title: 'Regular Exercise', desc: '30 minutes, 5 days a week' },
    { icon: '🥗', title: 'Balanced Diet', desc: 'Include fruits & vegetables' }
  ];

  const styles = {
    container: { padding: '24px', background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    greeting: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' },
    dateText: { fontSize: '14px', color: '#666' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' },
    statCard: { background: 'white', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'all 0.3s', cursor: 'pointer' },
    statLeft: { display: 'flex', flexDirection: 'column', gap: '8px' },
    statIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' },
    statTitle: { fontSize: '13px', color: '#666', fontWeight: '500' },
    statValue: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
    quickSection: { marginBottom: '24px' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
    actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' },
    actionBtn: { background: 'white', borderRadius: '16px', padding: '18px', textAlign: 'center', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.03)', display: 'block', cursor: 'pointer' },
    actionIcon: { fontSize: '28px', marginBottom: '10px' },
    actionLabel: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
    threeColumn: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' },
    card: { background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '32px' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' },
    cardTitle: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' },
    viewLink: { color: '#4A90E2', fontSize: '13px', textDecoration: 'none' },
    appointmentList: { display: 'flex', flexDirection: 'column', gap: '16px' },
    appointmentCard: { background: '#f8f9fa', borderRadius: '16px', padding: '16px', transition: 'all 0.3s', border: '1px solid #e9ecef' },
    appointmentHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
    doctorAvatar: { width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' },
    appointmentInfo: { flex: 1 },
    doctorName: { fontWeight: '600', marginBottom: '4px' },
    doctorSpecialty: { fontSize: '12px', color: '#666' },
    appointmentMeta: { display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#666' },
    metaItem: { display: 'flex', alignItems: 'center', gap: '6px' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '500' },
    activityItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    activityIcon: { fontSize: '20px', minWidth: '32px', textAlign: 'center' },
    activityContent: { flex: 1, wordBreak: 'break-word' },
    notificationItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    notificationIcon: { fontSize: '20px', minWidth: '32px', textAlign: 'center' },
    notificationContent: { flex: 1 },
    notificationMessage: { fontSize: '13px', fontWeight: '500', color: '#333', lineHeight: '1.4', wordBreak: 'break-word' },
    notificationTime: { fontSize: '11px', color: '#999', marginTop: '4px' },
    prescriptionItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    prescriptionIcon: { fontSize: '20px', minWidth: '32px', textAlign: 'center' },
    prescriptionContent: { flex: 1 },
    prescriptionName: { fontWeight: '500', fontSize: '13px', wordBreak: 'break-word' },
    prescriptionMeta: { fontSize: '11px', color: '#999', marginTop: '2px' },
    tipCard: { background: '#f8f9fa', borderRadius: '12px', padding: '12px', textAlign: 'center', transition: 'transform 0.3s' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#999' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '24px', width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' },
    formGroup: { marginBottom: '18px' },
    formLabel: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '13px' },
    formSelect: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px', background: 'white' },
    formInput: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px' },
    formTextarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px', resize: 'vertical' },
    doctorInfo: { background: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '15px' },
    doctorInfoText: { fontSize: '13px', color: '#666', marginBottom: '5px' },
    submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.greeting}>Hello, {user.firstName || 'Patient'}! 👋</h1>
        <p style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard} onClick={() => window.location.href = '/patient/appointments'}>
          <div style={styles.statLeft}>
            <div style={{ ...styles.statIcon, background: '#e8f0fe', color: '#4A90E2' }}><FaCalendarCheck /></div>
            <div><div style={styles.statTitle}>Upcoming</div><div style={styles.statValue}>{stats.upcomingAppointments}</div></div>
          </div>
          <FaArrowRight style={{ color: '#ccc' }} />
        </div>
        <div style={styles.statCard} onClick={() => window.location.href = '/patient/appointments'}>
          <div style={styles.statLeft}>
            <div style={{ ...styles.statIcon, background: '#e6f7f5', color: '#28C76F' }}><FaUserMd /></div>
            <div><div style={styles.statTitle}>Total Visits</div><div style={styles.statValue}>{stats.totalAppointments}</div></div>
          </div>
          <FaArrowRight style={{ color: '#ccc' }} />
        </div>
        <div style={styles.statCard} onClick={() => window.location.href = '/patient/medical-records'}>
          <div style={styles.statLeft}>
            <div style={{ ...styles.statIcon, background: '#fff3e6', color: '#FF9F43' }}><FaPrescription /></div>
            <div><div style={styles.statTitle}>Prescriptions</div><div style={styles.statValue}>{stats.prescriptions}</div></div>
          </div>
          <FaArrowRight style={{ color: '#ccc' }} />
        </div>
      </div>

      <div style={styles.quickSection}>
        <h3 style={styles.sectionTitle}><FaStethoscope /> Quick Actions</h3>
        <div style={styles.actionsGrid}>
          <button onClick={() => setShowBookingModal(true)} style={styles.actionBtn}>
            <div style={{ ...styles.actionIcon, color: '#4A90E2' }}>📅</div>
            <div style={styles.actionLabel}>Book Appointment</div>
          </button>
          <Link to="/patient/appointments" style={styles.actionBtn}>
            <div style={{ ...styles.actionIcon, color: '#28C76F' }}>📋</div>
            <div style={styles.actionLabel}>My Appointments</div>
          </Link>
          <Link to="/patient/medical-records" style={styles.actionBtn}>
            <div style={{ ...styles.actionIcon, color: '#FF9F43' }}>📄</div>
            <div style={styles.actionLabel}>Medical Records</div>
          </Link>
          <Link to="/patient/billing" style={styles.actionBtn}>
            <div style={{ ...styles.actionIcon, color: '#EA5455' }}>💰</div>
            <div style={styles.actionLabel}>Payments</div>
          </Link>
          <Link to="/patient/doctors" style={styles.actionBtn}>
            <div style={{ ...styles.actionIcon, color: '#00CFE8' }}>👨‍⚕️</div>
            <div style={styles.actionLabel}>Find Doctors</div>
          </Link>
        </div>
      </div>

      <div style={styles.threeColumn}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}><FaCalendarAlt /> Upcoming</h3>
            <Link to="/patient/appointments" style={styles.viewLink}>View All →</Link>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No upcoming appointments</p>
              <button onClick={() => setShowBookingModal(true)} style={{ marginTop: '12px', color: '#4A90E2', background: 'none', border: 'none', cursor: 'pointer' }}>Book one now →</button>
            </div>
          ) : (
            <div style={styles.appointmentList}>
              {upcomingAppointments.map(apt => {
                const status = getStatusBadge(apt.status);
                return (
                  <div key={apt.id} style={styles.appointmentCard}>
                    <div style={styles.appointmentHeader}>
                      <div style={styles.doctorAvatar}>{apt.doctor?.firstName?.charAt(0) || apt.doctorName?.charAt(0) || 'D'}</div>
                      <div style={styles.appointmentInfo}>
                        <div style={styles.doctorName}>Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}</div>
                        <div style={styles.doctorSpecialty}>{apt.remarks || 'Consultation'}</div>
                      </div>
                      <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                        {status.icon} {status.text}
                      </span>
                    </div>
                    <div style={styles.appointmentMeta}>
                      <div style={styles.metaItem}><FaCalendarAlt size={12} /> {apt.appointmentDate}</div>
                      <div style={styles.metaItem}><FaClock size={12} /> {apt.appointmentTime}</div>
                      <div style={styles.metaItem}><FaRupeeSign size={12} /> {apt.doctor?.consultationFee || 500}</div>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                      <button style={{ fontSize: '12px', background: '#fee2e2', color: '#EA5455', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => handleCancelAppointment(apt)}>Cancel</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}><FaChartLine /> Recent Activity</h3>
            <Link to="/patient/notifications" style={styles.viewLink}>View All →</Link>
          </div>
          {recentActivities.length === 0 ? (
            <div style={styles.emptyState}>No recent activity</div>
          ) : (
            recentActivities.map(activity => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>{activity.icon}</div>
                <div style={styles.activityContent}>
                  <div style={{ fontWeight: '500', fontSize: '13px' }}>{activity.action}</div>
                  <div style={{ fontSize: '11px', color: '#999' }}>{activity.date} at {activity.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}><FaBell /> Recent Notifications</h3>
          <Link to="/patient/notifications" style={styles.viewLink}>View All →</Link>
        </div>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>No notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} style={styles.notificationItem}>
              <div style={styles.notificationIcon}>🔔</div>
              <div style={styles.notificationContent}>
                <div style={styles.notificationMessage}>{notif.message}</div>
                <div style={styles.notificationTime}>{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}><FaPills /> My Prescriptions</h3>
          <Link to="/patient/medical-records" style={styles.viewLink}>View All →</Link>
        </div>
        {prescriptions.length === 0 ? (
          <div style={styles.emptyState}>No prescriptions yet</div>
        ) : (
          prescriptions.slice(0, 5).map(p => (
            <div key={p.id} style={styles.prescriptionItem}>
              <div style={styles.prescriptionIcon}>💊</div>
              <div style={styles.prescriptionContent}>
                <div style={styles.prescriptionName}>{p.medicineName}</div>
                <div style={styles.prescriptionMeta}>Dr. {p.doctor?.firstName} {p.doctor?.lastName} · {p.dosage}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}><FaHeartbeat /> Health Tips for You</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {healthTips.map((tip, idx) => (
            <div key={idx} style={styles.tipCard}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{tip.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{tip.title}</div>
              <div style={{ fontSize: '11px', color: '#666' }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowBookingModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25 }} style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Book Appointment</h3>
                <button style={styles.closeBtn} onClick={() => setShowBookingModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleBookAppointment}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Select Doctor *</label>
                  <select style={styles.formSelect} onChange={handleDoctorSelect} required>
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>Dr. {doc.firstName} {doc.lastName} - {doc.specialization} (₹{doc.consultationFee})</option>
                    ))}
                  </select>
                </div>
                {selectedDoctor && (
                  <div style={styles.doctorInfo}>
                    <div style={styles.doctorInfoText}><strong>Specialization:</strong> {selectedDoctor.specialization}</div>
                    <div style={styles.doctorInfoText}><strong>Experience:</strong> {selectedDoctor.experience} years</div>
                    <div style={styles.doctorInfoText}><strong>Available:</strong> {selectedDoctor.availableDays}</div>
                  </div>
                )}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Date *</label>
                  <input type="date" name="date" style={styles.formInput} value={bookingData.date} onChange={handleBookingChange} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Time *</label>
                  <select name="time" style={styles.formSelect} value={bookingData.time} onChange={handleBookingChange} required>
                    <option value="">Select Time</option>
                    {availableTimeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                    {availableTimeSlots.length === 0 && (
                      <option disabled>No slots available</option>
                    )}
                  </select>
                  {availableTimeSlots.length === 0 && bookingData.date && (
                    <p style={{ fontSize: '12px', color: '#EA5455', marginTop: '5px' }}>No available time slots for the selected date. Please choose another date.</p>
                  )}
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Type</label>
                  <select name="type" style={styles.formSelect} value={bookingData.type} onChange={handleBookingChange}>
                    <option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Checkup</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Symptoms</label>
                  <textarea name="symptoms" style={styles.formTextarea} rows="3" value={bookingData.symptoms} onChange={handleBookingChange} placeholder="Describe your symptoms..."></textarea>
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={styles.submitBtn}>Confirm Booking</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;