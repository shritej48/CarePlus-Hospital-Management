import React, { useState, useEffect } from 'react';

const StaffDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Load data
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        setPatients(allPatients);
        setAppointments(allAppointments);
        setLoading(false);
    }, []);

    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Staff Dashboard...</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Welcome Section */}
            <div style={{ marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>Staff Dashboard</h1>
                <p style={{ color: '#666' }}>Welcome back, {user.firstName || 'Staff'}! Here's your hospital overview.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#e8f0fe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{patients.length}</div>
                    <div style={{ color: '#666' }}>Total Patients</div>
                </div>
                <div style={{ background: '#e6f7f5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{todayAppointments.length}</div>
                    <div style={{ color: '#666' }}>Today's Appointments</div>
                </div>
                <div style={{ background: '#fff3e6', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>5</div>
                    <div style={{ color: '#666' }}>Active Doctors</div>
                </div>
                <div style={{ background: '#fee8e8', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>₹48,500</div>
                    <div style={{ color: '#666' }}>Revenue</div>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button onClick={() => window.location.href = '/staff/add-patient'} style={{ background: '#4A90E2', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    ➕ Add Patient
                </button>
                <button onClick={() => window.location.href = '/staff/appointments'} style={{ background: '#00BFA6', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    📅 Book Appointment
                </button>
                <button onClick={() => window.location.href = '/staff/patients'} style={{ background: '#FFB74D', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    👥 Manage Patients
                </button>
                <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} style={{ background: '#dc3545', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    🚪 Logout
                </button>
            </div>

            {/* Recent Patients */}
            <h3>Recently Registered Patients</h3>
            {patients.length === 0 ? (
                <p>No patients yet. Click "Add Patient" to register.</p>
            ) : (
                <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                             </tr>
                        </thead>
                        <tbody>
                            {patients.slice(0, 5).map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px' }}>{p.firstName} {p.lastName}</td>
                                    <td style={{ padding: '12px' }}>{p.phoneNumber}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>Active</span>
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

export default StaffDashboard;