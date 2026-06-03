import React, { useState, useEffect } from 'react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const loggedUser = userStr ? JSON.parse(userStr) : null;
    if (!loggedUser || loggedUser.role !== 'DOCTOR') {
      setLoading(false);
      return;
    }
    setDoctor(loggedUser);

    // Load all appointments and filter by doctorId
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const myAppointments = allAppointments.filter(apt => apt.doctorId === loggedUser.id);
    setAppointments(myAppointments);
    setLoading(false);
  }, []);

  const updateStatus = (id, newStatus) => {
    const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updated = allAppointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt);
    localStorage.setItem('appointments', JSON.stringify(updated));
    // Refresh view
    setAppointments(updated.filter(apt => apt.doctorId === doctor?.id));
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '40px auto', padding: '24px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' },
    subtitle: { color: '#666', marginBottom: '24px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', background: '#f8f9fa', borderBottom: '1px solid #ddd', fontWeight: '600' },
    td: { padding: '12px', borderBottom: '1px solid #eee' },
    statusBadge: { padding: '4px 12px', borderRadius: '40px', fontSize: '12px', fontWeight: '500', display: 'inline-block' },
    button: { padding: '6px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', marginRight: '8px' },
    confirmBtn: { background: '#28C76F', color: 'white' },
    cancelBtn: { background: '#EA5455', color: 'white' },
    emptyState: { textAlign: 'center', padding: '40px', color: '#999' },
  };

  if (!doctor) {
    return <div style={styles.container}>Please login as a doctor to view appointments.</div>;
  }

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 My Appointments</h2>
      <p style={styles.subtitle}>Welcome, Dr. {doctor.firstName} {doctor.lastName}</p>
      {appointments.length === 0 ? (
        <div style={styles.emptyState}>No appointments yet.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Patient</th><th style={styles.th}>Date</th><th style={styles.th}>Time</th>
                <th style={styles.th}>Symptoms</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id}>
                  <td style={styles.td}>{apt.patientName}</td>
                  <td style={styles.td}>{apt.date}</td><td style={styles.td}>{apt.time}</td>
                  <td style={styles.td}>{apt.symptoms || '-'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      background: apt.status === 'confirmed' ? '#d1fae5' : (apt.status === 'cancelled' ? '#fee2e2' : '#fed7aa'),
                      color: apt.status === 'confirmed' ? '#065f46' : (apt.status === 'cancelled' ? '#991b1b' : '#92400e')
                    }}>{apt.status}</span>
                  </td>
                  <td style={styles.td}>
                    {apt.status === 'pending' && (
                      <>
                        <button style={{ ...styles.button, ...styles.confirmBtn }} onClick={() => updateStatus(apt.id, 'confirmed')}>Confirm</button>
                        <button style={{ ...styles.button, ...styles.cancelBtn }} onClick={() => updateStatus(apt.id, 'cancelled')}>Cancel</button>
                      </>
                    )}
                    {apt.status === 'confirmed' && <span>✅ Confirmed</span>}
                    {apt.status === 'cancelled' && <span>❌ Cancelled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;