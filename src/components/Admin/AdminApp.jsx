import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { doctorAPI, patientAPI, appointmentAPI, authAPI } from '../../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const getStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const AnimatedCounter = ({ end, duration = 1.5, prefix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{prefix}{count}</span>;
};

// ---------- Database Viewer Component (FIXED) ----------
const DatabaseViewer = ({ darkMode }) => {
  const [activeTable, setActiveTable] = useState('doctors');
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tables = [
    { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️' },
    { id: 'patients', name: 'Patients', icon: '👤' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'billing', name: 'Billing', icon: '💰' },
  ];

  // Helper to get a readable value from any field (especially nested objects)
  const getDisplayValue = (value, key) => {
    if (value === null || value === undefined) return '-';
    
    // Handle nested patient object
    if (key === 'patient' && value.firstName) {
      return `${value.firstName} ${value.lastName}`;
    }
    // Handle nested doctor object
    if (key === 'doctor' && value.firstName) {
      return `Dr. ${value.firstName} ${value.lastName}`;
    }
    // Handle any other object (fallback)
    if (typeof value === 'object') {
      if (value.name) return value.name;
      if (value.firstName) return `${value.firstName} ${value.lastName || ''}`;
      return JSON.stringify(value).substring(0, 50);
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  useEffect(() => {
    loadTableData(activeTable);
  }, [activeTable]);

  const loadTableData = async (table) => {
    try {
      let raw = [];
      if (table === 'doctors') {
        const res = await doctorAPI.getAll();
        raw = res.data?.data || res.data || [];
      } else if (table === 'patients') {
        const res = await patientAPI.getAll();
        raw = res.data?.data || res.data || [];
      } else if (table === 'appointments') {
        const res = await appointmentAPI.getAll();
        raw = res.data?.data || res.data || [];
      } else {
        raw = JSON.parse(localStorage.getItem(table) || '[]');
      }
      if (table === 'users') {
        raw = raw.map(u => ({ ...u, password: '••••••' }));
      }
      setData(raw);
      setCurrentPage(1);
    } catch (err) {
      console.error(`Failed to load ${table}`, err);
      setData([]);
    }
  };

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    if (!filteredData.length) return;
    const headers = Object.keys(filteredData[0]);
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(h => {
          let val = row[h];
          if (val && typeof val === 'object') {
            if (val.firstName && val.lastName) val = `${val.firstName} ${val.lastName}`;
            else val = JSON.stringify(val);
          }
          return JSON.stringify(val || '');
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const glassStyle = {
    background: darkMode ? 'rgba(30,30,46,0.8)' : 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  };

  const styles = {
    container: { ...glassStyle, padding: '24px', marginBottom: '24px' },
    tabBar: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: `1px solid ${darkMode ? '#2d2d44' : '#e0e0e0'}`, paddingBottom: '12px' },
    tabButton: { padding: '8px 20px', borderRadius: '40px', border: 'none', cursor: 'pointer', background: darkMode ? '#2d2d44' : '#f8f9fa', transition: 'all 0.2s' },
    activeTab: { background: '#4A90E2', color: 'white' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' },
    searchInput: { padding: '10px 16px', borderRadius: '40px', border: '1px solid #ccc', background: darkMode ? '#2d2d44' : 'white', color: darkMode ? 'white' : '#333', width: '260px' },
    exportBtn: { background: '#28C76F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '40px', cursor: 'pointer', fontWeight: 500 },
    tableWrapper: { overflowX: 'auto', width: '100%', borderRadius: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { textAlign: 'left', padding: '12px 16px', borderBottom: `1px solid ${darkMode ? '#2d2d44' : '#e0e0e0'}`, fontWeight: 600, backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', whiteSpace: 'nowrap' },
    td: { padding: '12px 16px', borderBottom: `1px solid ${darkMode ? '#2d2d44' : '#e0e0e0'}`, whiteSpace: 'nowrap', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' },
    pageBtn: { padding: '6px 12px', borderRadius: '8px', border: '1px solid #ccc', background: darkMode ? '#2d2d44' : 'white', cursor: 'pointer' },
  };

  const getHeaders = () => {
    if (paginatedData.length === 0) return [];
    return Object.keys(paginatedData[0]);
  };

  const renderTableRows = () => {
    if (paginatedData.length === 0) return null;
    const headers = getHeaders();
    return paginatedData.map((row, idx) => (
      <tr key={idx} style={{ animation: `fadeInUp 0.2s ease-out ${idx * 0.03}s both` }}>
        {headers.map(header => (
          <td key={header} style={styles.td}>
            {getDisplayValue(row[header], header)}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginTop: 0 }}>🗄️ Database Viewer</h2>
      <div style={styles.tabBar}>
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => setActiveTable(table.id)}
            style={{ ...styles.tabButton, ...(activeTable === table.id ? styles.activeTab : {}) }}
          >
            {table.icon} {table.name}
          </button>
        ))}
      </div>
      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder={`Search in ${activeTable}...`}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          style={styles.searchInput}
        />
        <button onClick={exportToCSV} style={styles.exportBtn}>📎 Export CSV</button>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {getHeaders().map(header => (
                <th key={header} style={styles.th}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={getHeaders().length || 1} style={{ textAlign: 'center', padding: '40px' }}>
                  No records found
                </td>
              </tr>
            ) : renderTableRows()}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} style={styles.pageBtn}>Previous</button>
          <span style={{ padding: '6px 12px' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={styles.pageBtn}>Next</button>
        </div>
      )}
    </div>
  );
};

// ---------- Main AdminDashboard Component ----------
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('appointment');
  const [editingItem, setEditingItem] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New appointment booked by John Doe', time: '5 min ago', read: false },
    { id: 2, message: 'Dr. Sarah updated her availability', time: '1 hour ago', read: false },
    { id: 3, message: 'Payment received for invoice #INV-001', time: '2 hours ago', read: true },
  ]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    todayAppointments: 0,
  });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', consultationFee: '', experience: '',
    image: '',
    password: '',
    date: '', time: '', doctorId: '', patientId: '', symptoms: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Load all data from backend
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        doctorAPI.getAll(),
        patientAPI.getAll(),
        appointmentAPI.getAll(),
      ]);
      const doctorsList = doctorsRes.data?.data || doctorsRes.data || [];
      const patientsList = patientsRes.data?.data || patientsRes.data || [];
      const appointmentsList = appointmentsRes.data?.data || appointmentsRes.data || [];
      setDoctors(doctorsList);
      setPatients(patientsList);
      setAppointments(appointmentsList);
      updateStats(doctorsList, patientsList, appointmentsList);
    } catch (err) {
      console.error('Failed to load data', err);
      toast.error('Failed to load data from backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const updateStats = (docs, pats, apps) => {
    const today = new Date().toISOString().split('T')[0];
    const todayApps = (apps || []).filter(a => a.appointmentDate === today || a.date === today).length;
    setStats({
      totalDoctors: (docs || []).length,
      totalPatients: (pats || []).length,
      todayAppointments: todayApps,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const addDoctor = async (doctorData) => {
    let password = doctorData.password?.trim();
    if (!password) {
      password = Math.random().toString(36).slice(-8);
      alert(`✅ Auto-generated password for Dr. ${doctorData.firstName} ${doctorData.lastName}: ${password}`);
    }

    try {
      const registerResponse = await authAPI.register({
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        email: doctorData.email,
        password: password,
        phoneNumber: doctorData.phoneNumber,
        role: 'DOCTOR'
      });

      if (!registerResponse.data.success) {
        toast.error(registerResponse.data.message);
        return;
      }

      const userData = registerResponse.data.data;

      const newDoctor = {
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
        email: doctorData.email,
        phoneNumber: doctorData.phoneNumber,
        specialization: doctorData.specialization,
        consultationFee: Number(doctorData.consultationFee),
        experience: Number(doctorData.experience),
        image: doctorData.image || '',
        user: { id: userData.id }
      };

      const doctorResponse = await doctorAPI.create(newDoctor);
      if (doctorResponse.data.success) {
        const addedDoctor = doctorResponse.data.data || doctorResponse.data;
        setDoctors([...doctors, addedDoctor]);
        updateStats([...doctors, addedDoctor], patients, appointments);
        toast.success('Doctor added successfully!');
      } else {
        toast.error(doctorResponse.data.message || 'Failed to add doctor profile');
      }
    } catch (err) {
      console.error('Add doctor error:', err);
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  const updateDoctor = async (id, updatedData) => {
    try {
      const { password, ...doctorUpdate } = updatedData;
      const res = await doctorAPI.update(id, doctorUpdate);
      const updatedDoctor = res.data.data || res.data;
      setDoctors(doctors.map(d => d.id === id ? updatedDoctor : d));
      updateStats(doctors.map(d => d.id === id ? updatedDoctor : d), patients, appointments);
      toast.success('Doctor updated!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      setDoctors(doctors.filter(d => d.id !== id));
      updateStats(doctors.filter(d => d.id !== id), patients, appointments);
      toast.success('Doctor deleted');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const addAppointment = async (aptData) => {
    const newAppointment = {
      patient: { id: aptData.patientId },
      doctor: { id: aptData.doctorId },
      appointmentDate: aptData.date,
      appointmentTime: aptData.time,
      symptoms: aptData.symptoms,
      remarks: aptData.type,
    };
    try {
      const res = await appointmentAPI.create(newAppointment);
      const addedAppointment = res.data.data || res.data;
      setAppointments([...appointments, addedAppointment]);
      updateStats(doctors, patients, [...appointments, addedAppointment]);
      toast.success('Appointment created!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  const updateAppointment = async (id, updatedData) => {
    try {
      const res = await appointmentAPI.update(id, updatedData);
      const updatedAppointment = res.data.data || res.data;
      setAppointments(appointments.map(a => a.id === id ? updatedAppointment : a));
      updateStats(doctors, patients, appointments.map(a => a.id === id ? updatedAppointment : a));
      toast.success('Appointment updated');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(appointments.filter(a => a.id !== id));
      updateStats(doctors, patients, appointments.filter(a => a.id !== id));
      toast.success('Appointment cancelled');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'doctor') {
      if (item) {
        setFormData({ ...item, password: '', experience: item.experience || '', image: item.image || '' });
        setImagePreview(item.image || null);
      } else {
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', consultationFee: '', experience: '', image: '', password: '' });
        setImagePreview(null);
      }
    } else {
      setFormData(item || { doctorId: '', patientId: '', date: '', time: '', symptoms: '' });
    }
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'doctor') {
      if (editingItem) {
        updateDoctor(editingItem.id, formData);
      } else {
        addDoctor(formData);
      }
    } else {
      const doctor = doctors.find(d => d.id == formData.doctorId);
      const patient = patients.find(p => p.id == formData.patientId);
      const aptData = {
        doctorId: formData.doctorId,
        doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : '',
        patientId: formData.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms,
        type: formData.type,
      };
      if (editingItem) {
        updateAppointment(editingItem.id, aptData);
      } else {
        addAppointment(aptData);
      }
    }
    setShowModal(false);
    setEditingItem(null);
    setImagePreview(null);
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: [8500, 9200, 10800, 11200, 12800, 14500],
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const glassStyle = () => ({
    background: darkMode ? 'rgba(30,30,46,0.8)' : 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
  });

  const styles = {
    app: { display: 'flex', minHeight: '100vh', background: darkMode ? '#1a1a2e' : '#f0f4f8', transition: 'background 0.3s ease' },
    sidebar: {
      width: sidebarOpen ? '280px' : '80px',
      background: darkMode ? '#1e1e2e' : 'white',
      transition: 'width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      overflowX: 'hidden',
      position: 'fixed',
      height: '100vh',
      zIndex: 1000,
      boxShadow: darkMode ? '2px 0 20px rgba(0,0,0,0.3)' : '2px 0 20px rgba(0,0,0,0.05)',
    },
    main: {
      flex: 1,
      marginLeft: sidebarOpen ? '280px' : '80px',
      transition: 'margin-left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
      padding: '24px',
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '32px',
      ...glassStyle(),
      padding: '16px 24px',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    statCard: {
      ...glassStyle(),
      padding: '24px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    tableContainer: {
      ...glassStyle(),
      overflowX: 'auto',
      padding: '16px',
      marginBottom: '24px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#2d2d44' : '#e0e0e0'}`,
      fontWeight: 600,
    },
    td: {
      padding: '12px',
      borderBottom: `1px solid ${darkMode ? '#2d2d44' : '#e0e0e0'}`,
    },
    button: {
      background: '#4A90E2',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '40px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'transform 0.2s, background 0.2s',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    },
    modal: {
      ...glassStyle(),
      width: '90%',
      maxWidth: '650px',
      maxHeight: '90vh',
      overflowY: 'auto',
      padding: '28px',
      borderRadius: '32px',
      animation: 'fadeInUp 0.2s ease',
    },
    imagePreview: { width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', marginTop: '8px' },
    formRow: { display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' },
    formField: { flex: 1, minWidth: '200px' },
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      .dark-mode .skeleton {
        background: linear-gradient(90deg, #2d2d44 25%, #3a3a50 50%, #2d2d44 75%);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const renderStatsCards = () => (
    <div style={styles.statGrid}>
      {[
        { label: 'Total Doctors', value: stats.totalDoctors, icon: '👨‍⚕️' },
        { label: 'Total Patients', value: stats.totalPatients, icon: '👤' },
        { label: "Today's Appointments", value: stats.todayAppointments, icon: '📅' },
      ].map((item, idx) => (
        <div key={idx} style={styles.statCard} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>{item.icon}</div>
          <div style={{ fontSize: '28px', fontWeight: 700 }}>
            {loading ? <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '8px' }} /> : <AnimatedCounter end={item.value} duration={1.5} prefix={item.prefix || ''} />}
          </div>
          <div style={{ color: '#666', marginTop: '4px' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );

  const getTopDoctors = () => {
    const doctorAppointmentCount = {};
    (appointments || []).forEach(apt => {
      if (apt.doctor && apt.doctor.firstName) {
        const name = `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`;
        doctorAppointmentCount[name] = (doctorAppointmentCount[name] || 0) + 1;
      } else if (apt.doctorName) {
        doctorAppointmentCount[apt.doctorName] = (doctorAppointmentCount[apt.doctorName] || 0) + 1;
      }
    });
    return Object.entries(doctorAppointmentCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  const getRecentPatients = () => {
    const recent = [...(appointments || [])]
      .sort((a, b) => new Date(b.appointmentDate || b.date) - new Date(a.appointmentDate || a.date))
      .slice(0, 5)
      .map(apt => ({
        name: apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName,
        date: apt.appointmentDate || apt.date,
        doctor: apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctorName,
        status: apt.status
      }));
    return recent;
  };

  const topDoctors = getTopDoctors();
  const recentPatients = getRecentPatients();
  const pendingAppointments = (appointments || []).filter(apt => apt.status === 'SCHEDULED' || apt.status === 'PENDING').length;

  const renderDashboard = () => (
    <>
      {renderStatsCards()}
      <div style={styles.twoColumn}>
        <div style={styles.statCard}>
          <h3 style={{ marginTop: 0 }}>📈 Revenue Trend (Last 6 months)</h3>
          <Line data={revenueChartData} options={{ responsive: true }} />
        </div>
        <div style={styles.statCard}>
          <h3 style={{ marginTop: 0 }}>⚙️ System Overview</h3>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Total Appointments</span>
              <strong>{(appointments || []).length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Pending Appointments</span>
              <strong style={{ color: '#FF9F43' }}>{pendingAppointments}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span>Completed / Confirmed</span>
              <strong style={{ color: '#28C76F' }}>{(appointments || []).filter(apt => apt.status === 'COMPLETED' || apt.status === 'CONFIRMED').length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cancelled</span>
              <strong style={{ color: '#EA5455' }}>{(appointments || []).filter(apt => apt.status === 'CANCELLED').length}</strong>
            </div>
          </div>
        </div>
      </div>
      <div style={styles.twoColumn}>
        <div style={styles.statCard}>
          <h3 style={{ marginTop: 0 }}>🏆 Top Doctors (by appointments)</h3>
          {topDoctors.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>No data yet</p>
          ) : (
            <div style={{ marginTop: 16 }}>
              {topDoctors.map((doc, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>{idx+1}. {doc.name}</span>
                  <strong>{doc.count} appointments</strong>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={styles.statCard}>
          <h3 style={{ marginTop: 0 }}>🕒 Recent Patients</h3>
          {recentPatients.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>No patients yet</p>
          ) : (
            <div style={{ marginTop: 16 }}>
              {recentPatients.map((patient, idx) => {
                const statusColors = {
                  SCHEDULED: { bg: '#fed7aa', color: '#92400e' },
                  CONFIRMED: { bg: '#d1fae5', color: '#065f46' },
                  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
                  COMPLETED: { bg: '#e9ecef', color: '#495057' },
                };
                const status = statusColors[patient.status] || statusColors.SCHEDULED;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                      <strong>{patient.name}</strong>
                      <div style={{ fontSize: 12, color: '#666' }}>{patient.doctor} • {patient.date}</div>
                    </div>
                    <span style={{ background: status.bg, color: status.color, padding: '4px 12px', borderRadius: '20px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {patient.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {renderAppointmentsTable()}
    </>
  );

  const renderAppointmentsTable = () => (
    <div style={styles.tableContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>📅 Upcoming Appointments</h3>
        <button style={styles.button} onClick={() => openModal('appointment')}>+ New Appointment</button>
      </div>
      {loading ? <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} /> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(appointments || []).slice(0, 5).map((apt, idx) => (
              <tr key={apt.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={styles.td}>{apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctorName || '—'}</td>
                <td style={styles.td}>{apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName || '—'}</td>
                <td style={styles.td}>{apt.appointmentDate || apt.date}</td>
                <td style={styles.td}>{apt.appointmentTime || apt.time}</td>
                <td style={styles.td}><span style={{ background: apt.status === 'SCHEDULED' ? '#e3f2fd' : '#d1fae5', color: apt.status === 'SCHEDULED' ? '#1976d2' : '#065f46', padding: '4px 12px', borderRadius: '40px', fontSize: 12 }}>{apt.status}</span></td>
                <td style={styles.td}><button onClick={() => deleteAppointment(apt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455', fontSize: 16 }}>🗑️</button></td>
              </tr>
            ))}
            {(!appointments || appointments.length === 0) && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No appointments yet</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderDoctorsTable = () => (
    <div style={styles.tableContainer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>👨‍⚕️ Doctors List</h3>
        <button style={styles.button} onClick={() => openModal('doctor')}>+ Add Doctor</button>
      </div>
      {loading ? <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} /> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Photo</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Specialization</th>
              <th style={styles.th}>Experience</th>
              <th style={styles.th}>Fee (₹)</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(doctors || []).map((doc, idx) => (
              <tr key={doc.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={styles.td}>D{doc.id}</td>
                <td style={styles.td}>
                  {doc.image ? (
                    <img src={doc.image} alt={doc.firstName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                  )}
                </td>
                <td style={styles.td}>Dr. {doc.firstName} {doc.lastName}</td>
                <td style={styles.td}>{doc.specialization || '-'}</td>
                <td style={styles.td}>{doc.experience || 0} years</td>
                <td style={styles.td}>₹{doc.consultationFee || 0}</td>
                <td style={styles.td}>{doc.email}</td>
                <td style={styles.td}>
                  <button onClick={() => openModal('doctor', doc)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px', fontSize: 16 }}>✏️</button>
                  <button onClick={() => deleteDoctor(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EA5455', fontSize: 16 }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderPatientsTable = () => (
    <div style={styles.tableContainer}>
      <h3>👤 Patient Records</h3>
      {loading ? <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} /> : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {(patients || []).map((p, idx) => (
              <tr key={p.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                <td style={styles.td}>P{p.id}</td>
                <td style={styles.td}>{p.firstName} {p.lastName}</td>
                <td style={styles.td}>{p.phoneNumber}</td>
                <td style={styles.td}>{p.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderDatabaseViewer = () => <DatabaseViewer darkMode={darkMode} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'appointments': return renderAppointmentsTable();
      case 'doctors': return renderDoctorsTable();
      case 'patients': return renderPatientsTable();
      case 'database': return renderDatabaseViewer();
      default: return null;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && <h2 style={{ color: '#4A90E2', margin: 0 }}>🏥 CarePlus</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>{sidebarOpen ? '◀' : '▶'}</button>
        </div>
        <div style={{ padding: '16px 0' }}>
          {[
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'appointments', name: 'Appointments', icon: '📅' },
            { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️' },
            { id: 'patients', name: 'Patients', icon: '👤' },
            { id: 'database', name: 'Database', icon: '🗄️' },
          ].map((item) => (
            <div key={item.id} onClick={() => setActiveTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 24px', margin: '4px 12px', borderRadius: '14px', cursor: 'pointer', background: activeTab === item.id ? (darkMode ? '#4A90E230' : '#4A90E210') : 'transparent', color: activeTab === item.id ? '#4A90E2' : (darkMode ? '#ddd' : '#555') }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontWeight: 500 }}>{item.name}</span>}
            </div>
          ))}
        </div>
        <div style={{ padding: '20px', borderTop: '1px solid #ddd', marginTop: 'auto' }}>
          <div onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', cursor: 'pointer', color: '#dc3545' }}>
            <span>🚪</span> {sidebarOpen && <span>Logout</span>}
          </div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer' }}>{darkMode ? '☀️' : '🌙'}</button>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotificationPanel(!showNotificationPanel)}>
              <span style={{ fontSize: '22px' }}>🔔</span>
              {unreadCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-8px', background: '#EA5455', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
              {showNotificationPanel && (
                <div style={{ position: 'absolute', right: 0, top: '40px', width: '300px', background: darkMode ? '#2d2d44' : 'white', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 100, padding: '12px' }}>
                  <h4 style={{ margin: '0 0 10px' }}>Notifications</h4>
                  {notifications.map(n => (
                    <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{ padding: '8px', borderBottom: '1px solid #eee', opacity: n.read ? 0.6 : 1, cursor: 'pointer' }}>
                      <div style={{ fontSize: '13px' }}>{n.message}</div>
                      <div style={{ fontSize: '10px', color: '#999' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #4A90E2, #28C76F)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
          </div>
        </div>
        {renderContent()}
      </div>

      {/* Modal for adding/editing doctors and appointments */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{modalType === 'doctor' ? (editingItem ? '✏️ Edit Doctor' : '➕ Add New Doctor') : (editingItem ? '✏️ Edit Appointment' : '📅 New Appointment')}</h3>
            <form onSubmit={handleModalSubmit}>
              {modalType === 'doctor' ? (
                <>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>First Name *</label><input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                    <div style={styles.formField}><label>Last Name *</label><input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                    <div style={styles.formField}><label>Phone *</label><input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Specialization *</label><input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                    <div style={styles.formField}><label>Consultation Fee (₹) *</label><input type="number" value={formData.consultationFee} onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Experience (years) *</label><input type="number" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                    <div style={styles.formField}><label>Password</label><input type="text" placeholder="Leave empty to auto-generate" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Upload Photo</label><input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '8px', borderRadius: '12px', border: '1px solid #ccc' }} />{imagePreview && <img src={imagePreview} alt="Preview" style={styles.imagePreview} />}</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Select Doctor *</label>
                      <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }}>
                        <option value="">Select Doctor</option>
                        {(doctors || []).map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>)}
                      </select>
                    </div>
                    <div style={styles.formField}><label>Select Patient *</label>
                      <select value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }}>
                        <option value="">Select Patient</option>
                        {(patients || []).map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={styles.formRow}>
                    <div style={styles.formField}><label>Date *</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                    <div style={styles.formField}><label>Time *</label><input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} /></div>
                  </div>
                  <div style={styles.formField}><label>Symptoms</label><textarea rows="3" value={formData.symptoms} onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #ccc' }} placeholder="Describe symptoms..."></textarea></div>
                </>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 20px', borderRadius: '40px', border: 'none', background: '#e5e7eb', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ ...styles.button, background: '#28C76F' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;