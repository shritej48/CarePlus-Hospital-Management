// src/components/Patients/PatientAppointments.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaCalendarAlt, FaClock, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaSpinner, FaEye, FaCalendarCheck } from 'react-icons/fa';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'PATIENT') {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await appointmentAPI.getByPatient(user.id);
      const myAppointments = response.data?.data || response.data || [];
      setAppointments(myAppointments);
      applyFilters(myAppointments, activeFilter, searchTerm);
      calculateStats(myAppointments);
    } catch (err) {
      console.error('Failed to load appointments', err);
      toast.error('Failed to load appointments');
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = apps.filter(apt => apt.appointmentDate >= today && apt.status !== 'CANCELLED').length;
    const completed = apps.filter(apt => apt.status === 'COMPLETED').length;
    const cancelled = apps.filter(apt => apt.status === 'CANCELLED').length;
    setStats({
      total: apps.length,
      upcoming,
      completed,
      cancelled
    });
  };

  const applyFilters = (apps, filter, search) => {
    let filtered = [...apps];
    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status?.toLowerCase() === filter.toLowerCase());
    }
    // Search filter (by doctor name or type)
    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(apt => {
        const doctorName = apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctorName || '';
        const remarks = apt.remarks || '';
        return doctorName.toLowerCase().includes(term) || remarks.toLowerCase().includes(term);
      });
    }
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    setFilteredAppointments(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(appointments, filter, searchTerm);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(appointments, activeFilter, term);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      CONFIRMED: { bg: '#d1fae5', color: '#065f46', icon: <FaCheckCircle />, text: 'Confirmed' },
      COMPLETED: { bg: '#e9ecef', color: '#495057', icon: <FaCheckCircle />, text: 'Completed' },
      CANCELLED: { bg: '#fee2e2', color: '#991b1b', icon: <FaTimesCircle />, text: 'Cancelled' },
      SCHEDULED: { bg: '#dbeafe', color: '#1e40af', icon: <FaCalendarCheck />, text: 'Scheduled' },
      PENDING: { bg: '#fed7aa', color: '#92400e', icon: <FaSpinner />, text: 'Pending' }
    };
    return statusMap[status] || statusMap.SCHEDULED;
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === 'PAID') {
      return { bg: '#d1fae5', color: '#065f46', text: 'Paid' };
    }
    return { bg: '#fee2e2', color: '#991b1b', text: 'Pending' };
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4A90E2', textDecoration: 'none', marginBottom: '16px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
    subtitle: { color: '#666', fontSize: '14px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' },
    statCard: { background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center' },
    statValue: { fontSize: '32px', fontWeight: '700', color: '#1a1a2e' },
    statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' },
    filterGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    filterBtn: { padding: '8px 20px', borderRadius: '40px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' },
    activeFilter: { background: '#4A90E2', color: 'white' },
    inactiveFilter: { background: '#f0f2f5', color: '#555' },
    searchBox: { display: 'flex', alignItems: 'center', background: 'white', borderRadius: '40px', padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e0e0e0' },
    searchInput: { border: 'none', outline: 'none', padding: '8px', fontSize: '14px', width: '250px' },
    tableWrapper: { overflowX: 'auto', background: 'white', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px', borderBottom: '1px solid #e0e0e0', fontWeight: '600', color: '#333' },
    td: { padding: '16px', borderBottom: '1px solid #f0f0f0', color: '#555' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#999' },
    actionBtn: { background: 'none', border: 'none', color: '#4A90E2', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading appointments...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/patient/dashboard" style={styles.backLink}>
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 style={styles.title}>My Appointments</h1>
        <p style={styles.subtitle}>View and manage all your appointments</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.upcoming}</div>
          <div style={styles.statLabel}>Upcoming</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.cancelled}</div>
          <div style={styles.statLabel}>Cancelled</div>
        </div>
      </div>

      <div style={styles.toolbar}>
        <div style={styles.filterGroup}>
          {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map(filter => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === filter ? styles.activeFilter : styles.inactiveFilter)
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div style={styles.searchBox}>
          <FaSearch color="#999" />
          <input
            type="text"
            placeholder="Search by doctor or type..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Doctor</th>
              <th style={styles.th}>Date & Time</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Fee</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map(apt => {
                const status = getStatusBadge(apt.status);
                const payment = getPaymentBadge(apt.paymentStatus);
                const doctorName = apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : apt.doctorName || '—';
                const patientName = apt.patient ? `${apt.patient.firstName} ${apt.patient.lastName}` : apt.patientName || '—';
                return (
                  <tr key={apt.id}>
                    <td style={styles.td}>
                      <div><strong>{doctorName}</strong></div>
                      <div style={{ fontSize: '12px', color: '#999' }}>ID: {apt.doctor?.id || apt.doctorId}</div>
                    </td>
                    <td style={styles.td}>
                      <div><FaCalendarAlt size={12} style={{ marginRight: '6px' }} /> {apt.appointmentDate}</div>
                      <div style={{ marginTop: '4px' }}><FaClock size={12} style={{ marginRight: '6px' }} /> {apt.appointmentTime}</div>
                    </td>
                    <td style={styles.td}>{apt.remarks || 'Consultation'}</td>
                    <td style={styles.td}><FaRupeeSign size={12} style={{ marginRight: '4px' }} />{apt.doctor?.consultationFee || apt.fee || 500}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: payment.bg, color: payment.color }}>
                        {payment.text}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.actionBtn} onClick={() => alert(`View details for appointment ${apt.id}`)}>
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientAppointments;