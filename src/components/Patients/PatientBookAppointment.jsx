import React, { useState, useEffect } from 'react';

const PatientBookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const loggedUser = userStr ? JSON.parse(userStr) : null;
    if (!loggedUser || loggedUser.role !== 'PATIENT') {
      setMessage('Please login as a patient to book appointments.');
      return;
    }
    setUser(loggedUser);
    const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    setDoctors(storedDoctors);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return setMessage('Login required.');
    if (!selectedDoctorId || !appointmentDate || !appointmentTime)
      return setMessage('Please select doctor, date and time.');

    const doctor = doctors.find(d => d.id === parseInt(selectedDoctorId));
    if (!doctor) return setMessage('Doctor not found.');

    setLoading(true);
    // Create the appointment object
    const newAppointment = {
      id: Date.now(),
      patientId: user.id,
      patientName: `${user.firstName} ${user.lastName}`,
      doctorId: doctor.id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      date: appointmentDate,
      time: appointmentTime,
      symptoms: symptoms,
      status: 'pending',
      createdAt: new Date().toISOString(),
      type: 'Consultation',
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('appointments') || '[]');
    existing.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(existing));

    setMessage('✅ Appointment booked successfully!');
    setSelectedDoctorId('');
    setAppointmentDate('');
    setAppointmentTime('');
    setSymptoms('');
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const styles = {
    container: { maxWidth: '600px', margin: '40px auto', padding: '30px', background: 'white', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
    title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#1a1a2e' },
    subtitle: { color: '#666', marginBottom: '24px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' },
    select: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' },
    input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' },
    textarea: { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', resize: 'vertical' },
    button: { width: '100%', padding: '14px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    message: { marginTop: '16px', padding: '12px', borderRadius: '12px', textAlign: 'center' },
    success: { background: '#d1fae5', color: '#065f46' },
    error: { background: '#fee2e2', color: '#991b1b' },
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.message, ...styles.error }}>Please login as a patient to book appointments.</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Book an Appointment</h2>
      <p style={styles.subtitle}>Choose a doctor and your preferred date/time</p>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Doctor *</label>
          <select style={styles.select} value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} required>
            <option value="">-- Choose a doctor --</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>Dr. {doc.firstName} {doc.lastName} - {doc.specialization}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Date *</label>
          <input type="date" style={styles.input} value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Time *</label>
          <select style={styles.select} value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required>
            <option value="">Select Time</option>
            <option>09:00 AM</option><option>09:30 AM</option><option>10:00 AM</option>
            <option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option>
            <option>02:00 PM</option><option>02:30 PM</option><option>03:00 PM</option>
            <option>03:30 PM</option><option>04:00 PM</option><option>04:30 PM</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Symptoms (optional)</label>
          <textarea rows="3" style={styles.textarea} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe your symptoms..."></textarea>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Booking...' : 'Confirm Appointment'}</button>
        {message && <div style={{ ...styles.message, ...(message.includes('✅') ? styles.success : styles.error) }}>{message}</div>}
      </form>
    </div>
  );
};

export default PatientBookAppointment;