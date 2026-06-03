import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  FaBell, FaEnvelope, FaVideo, FaCalendarAlt, FaUserMd, FaPills, FaChartLine, 
  FaEdit, FaSave, FaTimes, FaSyncAlt, FaSearch, FaPlus, FaTrashAlt, 
  FaEye, FaPhone, FaUsers, FaCalendarCheck, FaUserCircle
} from 'react-icons/fa';
import { doctorAPI, appointmentAPI, prescriptionAPI } from '../../services/api';
import axios from 'axios';
import toast from 'react-hot-toast';

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

const AnimatedCounter = ({ value, duration = 1.5, prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{prefix}{count}</span>;
};

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showMedicalRecordsModal, setShowMedicalRecordsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [searchPatientTerm, setSearchPatientTerm] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', consultationFee: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    patientName: '',
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const loggedUser = JSON.parse(userStr);
    if (loggedUser.role !== 'DOCTOR') {
      navigate('/login');
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const res = await doctorAPI.getByEmail(loggedUser.email);
        const docData = res.data?.data || res.data;
        if (!docData || !docData.id) throw new Error('Doctor data not found');
        setDoctor({
          id: docData.id,
          firstName: docData.firstName,
          lastName: docData.lastName,
          email: docData.email,
          phoneNumber: docData.phoneNumber,
          specialization: docData.specialization,
          consultationFee: docData.consultationFee,
        });
        setEditForm({
          firstName: docData.firstName,
          lastName: docData.lastName,
          email: docData.email,
          phoneNumber: docData.phoneNumber,
          specialization: docData.specialization,
          consultationFee: docData.consultationFee,
        });
        await loadDashboardData(docData.id);
      } catch (err) {
        console.error(err);
        toast.error('Could not load doctor data. Please login again.');
        navigate('/login');
      }
    };
    fetchDoctorData();
  }, [navigate]);

  const loadDashboardData = async (doctorId) => {
    setLoading(true);
    try {
      const appointmentsRes = await appointmentAPI.getByDoctor(doctorId);
      let allAppointments = appointmentsRes.data?.data || appointmentsRes.data || [];
      setAppointments(allAppointments);

      const patientMap = new Map();
      for (const apt of allAppointments) {
        if (apt.patient && !patientMap.has(apt.patient.id)) {
          patientMap.set(apt.patient.id, apt.patient);
        }
      }
      setPatients(Array.from(patientMap.values()));

      const prescriptionsRes = await prescriptionAPI.getByDoctor(doctorId);
      let allPrescriptions = prescriptionsRes.data?.data || prescriptionsRes.data || [];
      setPrescriptions(allPrescriptions);

      const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(allNotifs.slice(0, 5));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const manualRefresh = () => {
    if (doctor) loadDashboardData(doctor.id);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('doctorTheme', !darkMode ? 'dark' : 'light');
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const res = await appointmentAPI.updateStatus(id, newStatus);
      if (res.data.success) {
        toast.success(`Appointment ${newStatus}!`);
        if (doctor) loadDashboardData(doctor.id);
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update appointment status');
    }
  };

  const markNotificationRead = (id) => {
    const all = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(updated.slice(0, 5));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await doctorAPI.update(doctor.id, editForm);
      if (res.data.success) {
        toast.success('Profile updated!');
        setDoctor(prev => ({ ...prev, ...editForm, consultationFee: Number(editForm.consultationFee) }));
        setShowProfileModal(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  // ✅ CORRECTED PASSWORD CHANGE
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.put('http://localhost:8080/api/auth/change-password', {
        email: doctor.email,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError('');
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      console.error('Password change error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to change password';
      toast.error(errorMsg);
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionForm.patientId || !prescriptionForm.medicineName || !prescriptionForm.dosage) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!doctor || !doctor.id) {
      toast.error('Doctor profile not loaded. Refresh page.');
      return;
    }

    try {
      const payload = {
        patient: { id: parseInt(prescriptionForm.patientId) },
        doctor: { id: doctor.id },
        medicineName: prescriptionForm.medicineName.trim(),
        dosage: prescriptionForm.dosage.trim(),
        frequency: prescriptionForm.frequency?.trim() || '',
        duration: prescriptionForm.duration?.trim() || '',
        instructions: prescriptionForm.instructions?.trim() || '',
        startDate: prescriptionForm.startDate || new Date().toISOString().split('T')[0],
        endDate: prescriptionForm.endDate || null,
        isActive: true
      };
      const res = await prescriptionAPI.create(payload);
      if (res.data.success) {
        toast.success('Prescription added');
        setShowPrescriptionModal(false);
        setPrescriptionForm({
          patientId: '', patientName: '', medicineName: '', dosage: '',
          frequency: '', duration: '', instructions: '', startDate: '', endDate: ''
        });
        if (doctor) loadDashboardData(doctor.id);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to add prescription');
    }
  };

  const handleEditPrescription = (pres) => {
    setEditingPrescription(pres);
    setPrescriptionForm({
      patientId: pres.patient?.id || pres.patientId,
      patientName: pres.patient ? `${pres.patient.firstName} ${pres.patient.lastName}` : pres.patientName,
      medicineName: pres.medicineName,
      dosage: pres.dosage,
      frequency: pres.frequency,
      duration: pres.duration,
      instructions: pres.instructions,
      startDate: pres.startDate,
      endDate: pres.endDate,
    });
    setShowPrescriptionModal(true);
  };

  const handleUpdatePrescription = async (e) => {
    e.preventDefault();
    try {
      const res = await prescriptionAPI.update(editingPrescription.id, prescriptionForm);
      if (res.data.success) {
        toast.success('Prescription updated');
        setShowPrescriptionModal(false);
        setEditingPrescription(null);
        setPrescriptionForm({
          patientId: '', patientName: '', medicineName: '', dosage: '',
          frequency: '', duration: '', instructions: '', startDate: '', endDate: ''
        });
        if (doctor) loadDashboardData(doctor.id);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  const handleDeletePrescription = async (id) => {
    if (confirm('Delete this prescription?')) {
      try {
        await prescriptionAPI.delete(id);
        toast.success('Deleted');
        if (doctor) loadDashboardData(doctor.id);
      } catch (err) {
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  const viewMedicalRecords = (patient) => {
    setSelectedPatient(patient);
    setShowMedicalRecordsModal(true);
  };

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchPatientTerm.toLowerCase())
  );

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const consultationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Consultations',
      data: [12, 19, 15, 17, 14, 18],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.4,
    }],
  };
  const patientCategoryData = {
    labels: ['New', 'Follow-up', 'Chronic'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
      borderWidth: 0,
    }],
  };

  const bgColor = darkMode ? '#1a1a2e' : '#f0f2f5';
  const cardBg = darkMode ? 'rgba(30,30,46,0.95)' : 'rgba(255,255,255,0.95)';
  const textColor = darkMode ? '#f0f0f0' : '#1a1a2e';
  const subTextColor = darkMode ? '#aaa' : '#666';
  const borderColor = darkMode ? '#2d2d44' : '#e0e0e0';

  const styles = {
    app: { display: 'flex', minHeight: '100vh', background: bgColor },
    sidebar: { width: sidebarOpen ? 260 : 80, background: darkMode ? '#1e1e2e' : 'white', transition: 'width 0.3s', position: 'fixed', height: '100vh', overflowX: 'hidden', zIndex: 30, boxShadow: '2px 0 10px rgba(0,0,0,0.1)' },
    main: { flex: 1, marginLeft: sidebarOpen ? 260 : 80, transition: 'margin-left 0.3s', padding: 24 },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24, background: cardBg, borderRadius: 20, padding: '12px 24px', backdropFilter: 'blur(12px)', border: `1px solid ${borderColor}` },
    card: { background: cardBg, borderRadius: 20, padding: 20, marginBottom: 24, backdropFilter: 'blur(12px)', border: `1px solid ${borderColor}`, transition: 'transform 0.2s, box-shadow 0.2s' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', borderBottom: `1px solid ${borderColor}`, fontWeight: 600, color: textColor },
    td: { padding: '12px', borderBottom: `1px solid ${borderColor}`, color: textColor },
    button: { background: '#3B82F6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 40, cursor: 'pointer', fontWeight: 500, marginRight: 8 },
    refreshBtn: { background: '#10B981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 40, cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { background: darkMode ? '#1e1e2e' : 'white', borderRadius: 24, padding: 24, width: '90%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', animation: 'fadeInUp 0.2s ease' },
    input: { width: '100%', padding: 8, borderRadius: 12, border: `1px solid ${borderColor}`, background: darkMode ? '#2d2d44' : 'white', color: textColor, marginBottom: 12 },
    label: { display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 },
    flexBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    notificationPanel: { position: 'absolute', right: 0, top: 45, width: 340, background: cardBg, backdropFilter: 'blur(16px)', borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 100, overflow: 'hidden', border: `1px solid ${borderColor}`, maxHeight: 400, display: 'flex', flexDirection: 'column' },
    notificationHeader: { padding: '12px 16px', borderBottom: `1px solid ${borderColor}`, fontWeight: 600, fontSize: '14px', background: cardBg },
    notificationList: { overflowY: 'auto', maxHeight: 350 },
    notificationItem: { padding: '12px 16px', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', transition: 'background 0.2s', display: 'flex', flexDirection: 'column', gap: 4 },
    notificationMessage: { fontSize: '13px', color: textColor, lineHeight: 1.4, wordBreak: 'break-word' },
    notificationTime: { fontSize: '10px', color: subTextColor },
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
      .dark .skeleton{background:linear-gradient(90deg,#2d2d44 25%,#3a3a50 50%,#2d2d44 75%)}
      .pulse{animation:pulse 2s infinite}
      @keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaChartLine size={20} /> },
    { id: 'appointments', name: 'Appointments', icon: <FaCalendarAlt size={20} /> },
    { id: 'patients', name: 'Patients', icon: <FaUserMd size={20} /> },
    { id: 'prescriptions', name: 'Prescriptions', icon: <FaPills size={20} /> },
    { id: 'analytics', name: 'Analytics', icon: <FaChartLine size={20} /> },
  ];

  const renderDashboard = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 20, marginBottom: 24 }}>
        {[
          { label: 'Total Patients', value: patients.length, icon: <FaUsers size={40} color="#4A90E2" /> },
          { label: 'Appointments Today', value: appointments.filter(a => a.appointmentDate === new Date().toISOString().split('T')[0]).length, icon: <FaCalendarCheck size={40} color="#28C76F" /> },
        ].map((item, idx) => (
          <motion.div key={idx} style={{ ...styles.card, textAlign: 'center', padding: 16 }} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <div style={{ marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{loading ? <div className="skeleton" style={{ width: 60, height: 28, borderRadius: 8, margin: '0 auto' }} /> : <AnimatedCounter value={item.value} />}</div>
            <div style={{ fontSize: 12, color: subTextColor }}>{item.label}</div>
          </motion.div>
        ))}
      </div>
      <div style={styles.card}>
        <h3 style={{ margin: '0 0 16px 0', color: textColor }}>📋 Recent Appointments</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Date</th><th style={styles.th}>Time</th><th style={styles.th}>Status</th></tr></thead>
            <tbody>
              {appointments.slice(0, 5).map(apt => (
                <tr key={apt.id}>
                  <td style={styles.td}>{apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName}</td>
                  <td style={styles.td}>{apt.appointmentDate}</td>
                  <td style={styles.td}>{apt.appointmentTime}</td>
                  <td style={styles.td}>{apt.status}</td>
                </tr>
              ))}
              {appointments.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No appointments</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div style={styles.card}>
      <div style={styles.flexBetween}><h3 style={{ margin: 0, color: textColor }}>📅 My Appointments</h3><button onClick={manualRefresh} style={styles.refreshBtn}><FaSyncAlt /> Refresh</button></div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Date</th><th style={styles.th}>Time</th><th style={styles.th}>Type</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {appointments.map(apt => {
              const showButtons = apt.status === 'SCHEDULED' || apt.status === 'PENDING';
              return (
                <tr key={apt.id}>
                  <td style={styles.td}>{apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName}</td>
                  <td style={styles.td}>{apt.appointmentDate}</td>
                  <td style={styles.td}>{apt.appointmentTime}</td>
                  <td style={styles.td}>{apt.remarks || 'Consultation'}</td>
                  <td style={styles.td}><span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 12, background: apt.status === 'CONFIRMED' ? '#d1fae5' : apt.status === 'CANCELLED' ? '#fee2e2' : '#fed7aa', color: apt.status === 'CONFIRMED' ? '#065f46' : apt.status === 'CANCELLED' ? '#991b1b' : '#92400e' }}>{apt.status}</span></td>
                  <td style={styles.td}>{showButtons && <><button onClick={() => updateAppointmentStatus(apt.id, 'CONFIRMED')} style={styles.button}>Confirm</button><button onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')} style={{ ...styles.button, background: '#EA5455' }}>Cancel</button></>}</td>
                </tr>
              );
            })}
            {appointments.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>No appointments found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div style={styles.card}>
      <div style={styles.flexBetween}>
        <h3 style={{ margin: 0, color: textColor }}>👥 My Patients</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <FaSearch color={subTextColor} />
          <input type="text" placeholder="Search patients..." value={searchPatientTerm} onChange={e => setSearchPatientTerm(e.target.value)} style={{ padding: '6px 10px', borderRadius: 20, border: `1px solid ${borderColor}`, background: darkMode ? '#2d2d44' : 'white', color: textColor }} />
          <button onClick={manualRefresh} style={styles.refreshBtn}><FaSyncAlt /> Refresh</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
        {filteredPatients.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: subTextColor }}>No patients yet</div> : filteredPatients.map(p => (
          <motion.div key={p.id} style={{ background: darkMode ? '#2d2d44' : '#f8f9fa', borderRadius: 16, padding: 16, cursor: 'pointer' }} whileHover={{ scale: 1.02 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <FaUserCircle size={48} color="#4A90E2" />
              <div><div style={{ fontWeight: 500 }}>{p.firstName} {p.lastName}</div><div style={{ fontSize: 12, color: subTextColor }}>{p.email}</div></div>
            </div>
            <div style={{ fontSize: 13, marginBottom: 8 }}><FaPhone size={12} /> {p.phoneNumber}</div>
            <div style={{ fontSize: 13 }}><strong>Last appointment:</strong> {appointments.filter(a => a.patient?.id === p.id).sort((a,b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0]?.appointmentDate || 'None'}</div>
            <button onClick={() => viewMedicalRecords(p)} style={{ marginTop: 12, background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}><FaEye /> View Medical Records</button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderPrescriptions = () => (
    <div style={styles.card}>
      <div style={styles.flexBetween}>
        <h3 style={{ margin: 0, color: textColor }}>💊 My Prescriptions</h3>
        <button onClick={() => { setEditingPrescription(null); setPrescriptionForm({ patientId: '', patientName: '', medicineName: '', dosage: '', frequency: '', duration: '', instructions: '', startDate: '', endDate: '' }); setShowPrescriptionModal(true); }} style={styles.button}><FaPlus /> New</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Patient</th><th style={styles.th}>Medicine</th><th style={styles.th}>Dosage</th><th style={styles.th}>Instructions</th><th style={styles.th}>Start Date</th><th style={styles.th}>End Date</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : p.patientName}</td>
                <td style={styles.td}>{p.medicineName}</td>
                <td style={styles.td}>{p.dosage}</td>
                <td style={styles.td}>{p.instructions || '-'}</td>
                <td style={styles.td}>{p.startDate || '-'}</td>
                <td style={styles.td}>{p.endDate || '-'}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEditPrescription(p)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', marginRight: 8 }}>✏️</button>
                  <button onClick={() => handleDeletePrescription(p.id)} style={{ background: 'none', border: 'none', color: '#EA5455', cursor: 'pointer' }}>🗑️</button>
                </td>
              </tr>
            ))}
            {prescriptions.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>No prescriptions</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 24 }}>
      <div style={styles.card}><h3>📊 Patient Categories</h3><Doughnut data={patientCategoryData} options={{ cutout: '60%' }} /></div>
      <div style={styles.card}><h3>📈 Monthly Consultations</h3><Line data={consultationData} options={{ responsive: true }} /></div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'appointments': return renderAppointments();
      case 'patients': return renderPatients();
      case 'prescriptions': return renderPrescriptions();
      case 'analytics': return renderAnalytics();
      default: return renderDashboard();
    }
  };

  if (!doctor) return <div style={{ textAlign: 'center', padding: 50, color: textColor }}>Loading doctor profile...</div>;

  const patientPrescriptions = prescriptions.filter(p => p.patient?.id === selectedPatient?.id);

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', borderBottom: `1px solid ${borderColor}` }}>
          {sidebarOpen && <h2 style={{ color: '#3B82F6', margin: 0 }}>🏥 CarePlus</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: textColor }}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>
        <div style={{ padding: '16px 0' }}>
          {menuItems.map(item => (
            <div key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', margin: '4px 12px', borderRadius: 14, cursor: 'pointer', background: activeTab === item.id ? (darkMode ? '#3B82F630' : '#3B82F610') : 'transparent', color: activeTab === item.id ? '#3B82F6' : textColor }}>
              {item.icon}
              {sidebarOpen && <span>{item.name}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: 20, borderTop: `1px solid ${borderColor}`, marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <FaUserCircle size={40} color="#3B82F6" />
              {sidebarOpen && <div><div style={{ fontWeight: 500, color: textColor }}>Dr. {doctor.firstName} {doctor.lastName}</div><div style={{ fontSize: 12, color: subTextColor }}>{doctor.specialization}</div></div>}
            </div>
            {sidebarOpen && <button onClick={() => setShowProfileModal(true)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', fontSize: 16 }}><FaEdit /></button>}
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0, color: textColor }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: textColor }}>{darkMode ? '☀️' : '🌙'}</button>
            <div style={{ position: 'relative' }}>
              <motion.button onClick={() => setShowNotifications(!showNotifications)} animate={unreadNotifCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}} transition={{ duration: 0.5 }} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: textColor, position: 'relative' }}>
                <FaBell />
                {unreadNotifCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadNotifCount}</span>}
              </motion.button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} style={styles.notificationPanel}>
                    <div style={styles.notificationHeader}>Notifications {unreadNotifCount > 0 ? `(${unreadNotifCount} unread)` : ''}</div>
                    <div style={styles.notificationList}>
                      {notifications.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: subTextColor }}>No notifications</div> : notifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{ ...styles.notificationItem, background: n.read ? 'transparent' : 'rgba(59,130,246,0.05)', opacity: n.read ? 0.7 : 1 }}>
                          <div style={styles.notificationMessage}>{n.message}</div>
                          <div style={styles.notificationTime}>{n.time || 'Just now'}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowMessages(!showMessages)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: textColor }}>✉️</button>
              {showMessages && <div style={{ position: 'absolute', right: 0, top: 40, width: 280, background: cardBg, borderRadius: 16, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 20 }}><h4 style={{ margin: '0 0 8px 0', color: textColor }}>Messages</h4><p style={{ color: subTextColor }}>No messages</p></div>}
            </div>
            <FaUserCircle size={40} color="#3B82F6" />
          </div>
        </div>
        {loading ? <div><div className="skeleton" style={{ height: 100, borderRadius: 20, marginBottom: 24 }}></div><div className="skeleton" style={{ height: 300, borderRadius: 20 }}></div></div> : renderContent()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: 16, color: textColor }}>Start Video Consultation</h3>
              <button onClick={() => alert('Connecting...')} style={styles.button}>Join Call</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowProfileModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.flexBetween}><h3 style={{ margin: 0, color: textColor }}>Edit Profile</h3><button onClick={() => setShowProfileModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: textColor }}><FaTimes /></button></div>
              <form onSubmit={handleProfileUpdate}>
                <div><label style={styles.label}>First Name</label><input type="text" value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Last Name</label><input type="text" value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Phone</label><input type="tel" value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} style={styles.input} /></div>
                <div><label style={styles.label}>Specialization</label><input type="text" value={editForm.specialization} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Consultation Fee (₹)</label><input type="number" value={editForm.consultationFee} onChange={e => setEditForm({ ...editForm, consultationFee: e.target.value })} required style={styles.input} /></div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" onClick={() => setShowProfileModal(false)} style={{ padding: '6px 16px', borderRadius: 40, border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 40, cursor: 'pointer' }}><FaSave /> Save</button>
                </div>
              </form>
              <div style={{ marginTop: 16, textAlign: 'center', borderTop: `1px solid ${borderColor}`, paddingTop: 12 }}><button onClick={() => setShowPasswordModal(true)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>Change Password</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={styles.modal} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: 16, color: textColor }}>🔐 Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <div><label style={styles.label}>Current Password</label><input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>New Password</label><input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Confirm Password</label><input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required style={styles.input} /></div>
                {passwordError && <div style={{ color: '#ef4444', marginBottom: 12 }}>{passwordError}</div>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowPasswordModal(false)} style={{ padding: '6px 16px', borderRadius: 40, border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 40, cursor: 'pointer' }}>Update</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPrescriptionModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowPrescriptionModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.flexBetween}><h3 style={{ margin: 0, color: textColor }}>{editingPrescription ? 'Edit Prescription' : 'New Prescription'}</h3><button onClick={() => setShowPrescriptionModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: textColor }}><FaTimes /></button></div>
              <form onSubmit={editingPrescription ? handleUpdatePrescription : handleAddPrescription}>
                <div><label style={styles.label}>Patient *</label><select value={prescriptionForm.patientId} onChange={e => { const patientId = parseInt(e.target.value); const patient = patients.find(p => p.id === patientId); setPrescriptionForm({ ...prescriptionForm, patientId, patientName: patient ? `${patient.firstName} ${patient.lastName}` : '' }); }} required style={styles.input}><option value="">Select patient</option>{patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}</select></div>
                <div><label style={styles.label}>Medicine Name *</label><input type="text" value={prescriptionForm.medicineName} onChange={e => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Dosage *</label><input type="text" value={prescriptionForm.dosage} onChange={e => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })} required style={styles.input} /></div>
                <div><label style={styles.label}>Frequency</label><input type="text" value={prescriptionForm.frequency} onChange={e => setPrescriptionForm({ ...prescriptionForm, frequency: e.target.value })} style={styles.input} /></div>
                <div><label style={styles.label}>Duration</label><input type="text" value={prescriptionForm.duration} onChange={e => setPrescriptionForm({ ...prescriptionForm, duration: e.target.value })} style={styles.input} /></div>
                <div><label style={styles.label}>Instructions</label><textarea rows="2" value={prescriptionForm.instructions} onChange={e => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })} style={{ ...styles.input, resize: 'vertical' }} /></div>
                <div><label style={styles.label}>Start Date</label><input type="date" value={prescriptionForm.startDate} onChange={e => setPrescriptionForm({ ...prescriptionForm, startDate: e.target.value })} style={styles.input} /></div>
                <div><label style={styles.label}>End Date</label><input type="date" value={prescriptionForm.endDate} onChange={e => setPrescriptionForm({ ...prescriptionForm, endDate: e.target.value })} style={styles.input} /></div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
                  <button type="button" onClick={() => setShowPrescriptionModal(false)} style={{ padding: '6px 16px', borderRadius: 40, border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 40, cursor: 'pointer' }}>Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMedicalRecordsModal && selectedPatient && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay} onClick={() => setShowMedicalRecordsModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={styles.modal} onClick={e => e.stopPropagation()}>
              <div style={styles.flexBetween}><h3 style={{ margin: 0, color: textColor }}>📋 Medical Records: {selectedPatient.firstName} {selectedPatient.lastName}</h3><button onClick={() => setShowMedicalRecordsModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: textColor }}><FaTimes /></button></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}><FaUserCircle size={64} color="#4A90E2" /><div><p><strong>Email:</strong> {selectedPatient.email}</p><p><strong>Phone:</strong> {selectedPatient.phoneNumber}</p></div></div>
              <h4 style={{ color: textColor }}>Prescriptions</h4>
              {patientPrescriptions.length === 0 ? <p style={{ color: subTextColor }}>No prescriptions found for this patient.</p> : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead><tr><th style={styles.th}>Medicine</th><th style={styles.th}>Dosage</th><th style={styles.th}>Instructions</th><th style={styles.th}>Start Date</th><th style={styles.th}>End Date</th></tr></thead>
                    <tbody>{patientPrescriptions.map(p => (<tr key={p.id}><td style={styles.td}>{p.medicineName}</td><td style={styles.td}>{p.dosage}</td><td style={styles.td}>{p.instructions || '-'}</td><td style={styles.td}>{p.startDate || '-'}</td><td style={styles.td}>{p.endDate || '-'}</td></tr>))}</tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: '#3B82F6', color: 'white', border: 'none', fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 40 }} onClick={() => setShowVideoModal(true)}>📞</motion.button>
    </div>
  );
};

export default DoctorDashboard;