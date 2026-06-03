import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBell, FaCheckCircle, FaCalendarAlt, 
  FaFileMedical, FaCreditCard, FaUserMd, FaTrashAlt,
  FaCheckDouble, FaClock, FaArrowLeft
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Helper to clean "undefined undefined" from messages
  const cleanMessage = (msg) => {
    if (!msg) return "Notification";
    let cleaned = msg.replace(/undefined undefined/g, "Doctor");
    cleaned = cleaned.replace(/undefined/g, "");
    cleaned = cleaned.replace(/\s+/g, " ").trim();
    return cleaned || "Notification";
  };

  // Get user‑specific storage key
  const getNotificationKey = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;
      if (!userId) {
        console.warn('No user ID found, using fallback key');
        return 'notifications';
      }
      return `notifications_${userId}`;
    } catch (err) {
      console.error('Error reading user from localStorage', err);
      return 'notifications';
    }
  };

  const loadNotifications = () => {
    try {
      const key = getNotificationKey();
      let allNotifications = JSON.parse(localStorage.getItem(key) || '[]');

      // 1️⃣ Remove notifications older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      allNotifications = allNotifications.filter(notif => {
        let notifDate;
        if (notif.createdAt) {
          notifDate = new Date(notif.createdAt);
        } else if (typeof notif.id === 'number' && notif.id > 1000000000000) {
          notifDate = new Date(notif.id);
        } else {
          notifDate = new Date(); // keep if date unknown
        }
        return notifDate >= sevenDaysAgo;
      });

      // 2️⃣ Clean messages (remove "undefined undefined")
      allNotifications = allNotifications.map(notif => ({
        ...notif,
        message: cleanMessage(notif.message)
      }));

      // 3️⃣ Sort newest first
      allNotifications.sort((a, b) => 
        new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      );

      // Save cleaned list back (persist fix)
      localStorage.setItem(key, JSON.stringify(allNotifications));

      setNotifications(allNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      toast.error('Could not load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAsRead = (id) => {
    try {
      const key = getNotificationKey();
      const updated = notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
      localStorage.setItem(key, JSON.stringify(updated));
      setNotifications(updated);
      toast.success('Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = () => {
    try {
      const key = getNotificationKey();
      const updated = notifications.map(notif => ({ ...notif, read: true }));
      localStorage.setItem(key, JSON.stringify(updated));
      setNotifications(updated);
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      const key = getNotificationKey();
      const updated = notifications.filter(notif => notif.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      setNotifications(updated);
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment': return <FaCalendarAlt style={{ color: '#4A90E2' }} />;
      case 'payment': return <FaCreditCard style={{ color: '#28C76F' }} />;
      case 'report': return <FaFileMedical style={{ color: '#FF9F43' }} />;
      case 'doctor': return <FaUserMd style={{ color: '#667eea' }} />;
      default: return <FaBell style={{ color: '#4A90E2' }} />;
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const styles = {
    container: { padding: '24px', background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '12px' },
    backLink: { color: '#4A90E2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' },
    filterBar: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
    filterBtn: { padding: '8px 20px', borderRadius: '25px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' },
    activeFilter: { background: '#4A90E2', color: 'white', borderColor: '#4A90E2' },
    markAllBtn: { background: 'none', border: '1px solid #4A90E2', color: '#4A90E2', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' },
    statsCard: { background: 'white', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    statNumber: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
    statLabel: { fontSize: '13px', color: '#666' },
    notificationsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    notificationCard: { background: 'white', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '15px', transition: 'all 0.3s', cursor: 'pointer', border: '1px solid transparent' },
    unreadCard: { background: '#e8f0fe', borderLeft: '3px solid #4A90E2' },
    notificationIcon: { fontSize: '24px', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' },
    notificationContent: { flex: 1 },
    notificationMessage: { fontWeight: '500', marginBottom: '6px', color: '#1a1a2e' },
    notificationTime: { fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' },
    notificationActions: { display: 'flex', gap: '8px' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'background 0.3s' },
    readBtn: { color: '#28C76F' },
    deleteBtn: { color: '#EA5455' },
    emptyState: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', color: '#999' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading notifications...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <Link to="/patient/dashboard" style={styles.backLink}>
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1 style={styles.title}><FaBell /> Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button style={styles.markAllBtn} onClick={markAllAsRead}>
            <FaCheckDouble /> Mark All as Read
          </button>
        )}
      </div>

      <div style={styles.statsCard}>
        <div>
          <div style={styles.statNumber}>{notifications.length}</div>
          <div style={styles.statLabel}>Total Notifications</div>
        </div>
        <div>
          <div style={styles.statNumber}>{unreadCount}</div>
          <div style={styles.statLabel}>Unread</div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <button style={{ ...styles.filterBtn, ...(filter === 'all' ? styles.activeFilter : {}) }} onClick={() => setFilter('all')}>All</button>
        <button style={{ ...styles.filterBtn, ...(filter === 'unread' ? styles.activeFilter : {}) }} onClick={() => setFilter('unread')}>Unread</button>
      </div>

      <div style={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <div style={styles.emptyState}>
            <FaBell style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <p>No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div key={notif.id} style={{ ...styles.notificationCard, ...(!notif.read ? styles.unreadCard : {}) }} onClick={() => markAsRead(notif.id)}>
              <div style={styles.notificationIcon}>
                {getNotificationIcon(notif.type)}
              </div>
              <div style={styles.notificationContent}>
                <div style={styles.notificationMessage}>{notif.message}</div>
                <div style={styles.notificationTime}>
                  <FaClock size={10} /> {notif.time || new Date(notif.createdAt || notif.id).toLocaleString()}
                </div>
              </div>
              <div style={styles.notificationActions}>
                {!notif.read && (
                  <button style={{ ...styles.actionBtn, ...styles.readBtn }} onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }} title="Mark as read">
                    <FaCheckCircle />
                  </button>
                )}
                <button style={{ ...styles.actionBtn, ...styles.deleteBtn }} onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }} title="Delete">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientNotifications;