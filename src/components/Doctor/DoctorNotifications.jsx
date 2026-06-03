import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBell, FaEnvelope, FaPhone, FaUserCircle, FaCalendarAlt, FaPrescription, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const DoctorNotifications = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'DOCTOR') {
      navigate('/login');
      return;
    }

    // Get doctor details from doctors list
    const doctorsList = JSON.parse(localStorage.getItem('doctors') || '[]');
    const docInfo = doctorsList.find(d => d.id === user.id) || {};
    setDoctor({
      id: user.id,
      firstName: user.firstName || docInfo.firstName || 'Doctor',
      lastName: user.lastName || docInfo.lastName || '',
      email: user.email || docInfo.email || '',
      phoneNumber: docInfo.phoneNumber || user.phoneNumber || 'N/A',
      specialization: docInfo.specialization || 'General Physician',
    });

    // Load notifications for this doctor
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const myNotifs = allNotifs.filter(n => 
      n.doctorId === user.id || 
      (n.message && (n.message.includes(doctor?.firstName) || n.type === 'appointment'))
    ).sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));
    setNotifications(myNotifs);
    setLoading(false);
  }, [navigate]);

  const markAllAsRead = () => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = allNotifs.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneAsRead = (id) => {
    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = allNotifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4A90E2', textDecoration: 'none', marginBottom: '16px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
    profileCard: { background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' },
    profileInfo: { flex: 1 },
    profileName: { fontSize: '20px', fontWeight: '600', marginBottom: '4px' },
    profileDetail: { display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '14px', marginTop: '8px' },
    notifCard: { background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    notifHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
    notifTitle: { fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' },
    markAllBtn: { background: '#4A90E2', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '40px', cursor: 'pointer', fontSize: '13px' },
    notifList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    notifItem: { padding: '16px', borderRadius: '16px', border: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s', background: (read) => read ? 'white' : '#f0f7ff' },
    notifIcon: { fontSize: '24px', minWidth: '40px', textAlign: 'center' },
    notifContent: { flex: 1 },
    notifMessage: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
    notifTime: { fontSize: '12px', color: '#999' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#999' }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/doctor/dashboard" style={styles.backLink}>
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 style={styles.title}>Notifications & Profile</h1>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {doctor?.firstName?.charAt(0)}{doctor?.lastName?.charAt(0)}
        </div>
        <div style={styles.profileInfo}>
          <div style={styles.profileName}>Dr. {doctor?.firstName} {doctor?.lastName}</div>
          <div style={styles.profileDetail}><FaEnvelope /> {doctor?.email}</div>
          <div style={styles.profileDetail}><FaPhone /> {doctor?.phoneNumber}</div>
          <div style={styles.profileDetail}><FaUserCircle /> {doctor?.specialization}</div>
        </div>
      </div>

      {/* Notifications Section */}
      <div style={styles.notifCard}>
        <div style={styles.notifHeader}>
          <div style={styles.notifTitle}>
            <FaBell /> Notifications {unreadCount > 0 ? `(${unreadCount} unread)` : ''}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} style={styles.markAllBtn}>Mark all as read</button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>No notifications yet</div>
        ) : (
          <div style={styles.notifList}>
            {notifications.map(notif => {
              let icon = <FaBell />;
              if (notif.type === 'appointment') icon = <FaCalendarAlt />;
              if (notif.type === 'prescription') icon = <FaPrescription />;
              if (notif.type === 'appointment_update') icon = notif.message.includes('confirmed') ? <FaCheckCircle /> : <FaTimesCircle />;
              return (
                <motion.div
                  key={notif.id}
                  whileHover={{ scale: 1.01 }}
                  style={{ ...styles.notifItem, background: notif.read ? 'white' : '#f0f7ff' }}
                  onClick={() => markOneAsRead(notif.id)}
                >
                  <div style={styles.notifIcon}>{icon}</div>
                  <div style={styles.notifContent}>
                    <div style={styles.notifMessage}>{notif.message}</div>
                    <div style={styles.notifTime}>{notif.time || 'Just now'}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNotifications;