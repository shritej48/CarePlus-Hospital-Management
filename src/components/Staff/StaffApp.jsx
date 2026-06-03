import React, { useState, useEffect } from 'react';

const StaffApp = () => {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });
    const [appointmentData, setAppointmentData] = useState({
        patientId: '',
        patientName: '',
        date: '',
        time: '',
        reason: '',
        type: 'Consultation',
        fee: 500
    });
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        loadPatients();
        loadAppointments();
        calculateRevenue();
    }, []);

    const loadPatients = () => {
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(allPatients);
    };

    const loadAppointments = () => {
        const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        setAppointments(allAppointments);
    };

    const calculateRevenue = () => {
        const allAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const paidAppointments = allAppointments.filter(apt => apt.paymentStatus === 'Paid');
        const revenue = paidAppointments.reduce((sum, apt) => sum + (apt.fee || 0), 0);
        setTotalRevenue(revenue);
        return revenue;
    };

    const handleAddPatient = (e) => {
        e.preventDefault();
        const newPatient = {
            id: Date.now(),
            ...formData,
            status: 'Active',
            createdAt: new Date().toISOString()
        };
        const updatedPatients = [...patients, newPatient];
        localStorage.setItem('patients', JSON.stringify(updatedPatients));
        setPatients(updatedPatients);
        setShowAddForm(false);
        setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
        alert('Patient added successfully!');
    };

    const handleDeletePatient = (id) => {
        if (confirm('Are you sure you want to delete this patient?')) {
            const updated = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(updated));
            setPatients(updated);
            alert('Patient deleted successfully!');
        }
    };

    const handleAddAppointment = (e) => {
        e.preventDefault();
        if (!appointmentData.patientId || !appointmentData.date || !appointmentData.time) {
            alert('Please select patient, date and time');
            return;
        }
        
        const newAppointment = {
            id: Date.now(),
            ...appointmentData,
            status: 'Scheduled',
            paymentStatus: 'Pending',
            createdAt: new Date().toISOString()
        };
        const updatedAppointments = [...appointments, newAppointment];
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        setAppointments(updatedAppointments);
        setShowAppointmentForm(false);
        setAppointmentData({
            patientId: '',
            patientName: '',
            date: '',
            time: '',
            reason: '',
            type: 'Consultation',
            fee: 500
        });
        alert('Appointment booked successfully!');
    };

    const updateAppointmentStatus = (id, newStatus) => {
        const updated = appointments.map(apt => {
            if (apt.id === id) {
                return { ...apt, status: newStatus };
            }
            return apt;
        });
        
        localStorage.setItem('appointments', JSON.stringify(updated));
        setAppointments(updated);
        alert(`Appointment ${newStatus}`);
    };

    const processPayment = (id) => {
        const appointment = appointments.find(a => a.id === id);
        if (!appointment) return;
        
        const updated = appointments.map(apt => {
            if (apt.id === id) {
                return { ...apt, paymentStatus: 'Paid', status: 'Completed' };
            }
            return apt;
        });
        
        localStorage.setItem('appointments', JSON.stringify(updated));
        setAppointments(updated);
        
        const newRevenue = calculateRevenue();
        setTotalRevenue(newRevenue);
        
        alert(`Payment of ₹${appointment.fee} processed successfully! Total Revenue: ₹${newRevenue}`);
    };

    const handleDeleteAppointment = (id) => {
        if (confirm('Are you sure you want to delete this appointment?')) {
            const updated = appointments.filter(apt => apt.id !== id);
            localStorage.setItem('appointments', JSON.stringify(updated));
            setAppointments(updated);
            calculateRevenue();
            alert('Appointment deleted successfully!');
        }
    };

    const todayAppointments = appointments.filter(apt => apt.date === today);
    const upcomingAppointments = appointments.filter(apt => apt.date > today);

    // Dashboard View
    if (currentPage === 'dashboard') {
        return (
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ color: '#333', borderBottom: '2px solid #4A90E2', paddingBottom: '10px' }}>Staff Dashboard</h1>
                <p style={{ color: '#666', marginBottom: '30px' }}>Welcome, {user.firstName || 'Staff'}!</p>

                {/* Stats Cards */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, background: '#e8f0fe', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{patients.length}</div>
                        <div style={{ color: '#666' }}>Total Patients</div>
                    </div>
                    <div style={{ flex: 1, background: '#e6f7f5', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{todayAppointments.length}</div>
                        <div style={{ color: '#666' }}>Today's Appointments</div>
                    </div>
                    <div style={{ flex: 1, background: '#fff3e6', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{upcomingAppointments.length}</div>
                        <div style={{ color: '#666' }}>Upcoming Appointments</div>
                    </div>
                    <div style={{ flex: 1, background: '#fee8e8', padding: '20px', borderRadius: '10px', textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString()}</div>
                        <div style={{ color: '#666' }}>Total Revenue</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <button onClick={() => setShowAddForm(true)} style={{ background: '#4A90E2', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>➕ Add Patient</button>
                        <button onClick={() => setShowAppointmentForm(true)} style={{ background: '#28a745', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>📅 Book Appointment</button>
                        <button onClick={() => setCurrentPage('patients')} style={{ background: '#00BFA6', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>👥 View All Patients</button>
                        <button onClick={() => setCurrentPage('appointments')} style={{ background: '#FFB74D', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>📋 View All Appointments</button>
                        <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} style={{ background: '#dc3545', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🚪 Logout</button>
                    </div>
                </div>

                {/* Add Patient Form */}
                {showAddForm && (
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                        <h3>Add New Patient</h3>
                        <form onSubmit={handleAddPatient}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                <div><label>First Name *</label><input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Last Name *</label><input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Phone Number *</label><input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            </div>
                            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Save</button>
                            <button type="button" onClick={() => setShowAddForm(false)} style={{ background: '#666', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </form>
                    </div>
                )}

                {/* Book Appointment Form */}
                {showAppointmentForm && (
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                        <h3>Book New Appointment</h3>
                        <form onSubmit={handleAddAppointment}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Select Patient *</label>
                                <select required value={appointmentData.patientId} onChange={(e) => {
                                    const patientId = e.target.value;
                                    const patient = patients.find(p => p.id == patientId);
                                    setAppointmentData({
                                        ...appointmentData,
                                        patientId: patientId,
                                        patientName: patient ? `${patient.firstName} ${patient.lastName}` : ''
                                    });
                                }} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <option value="">-- Select Patient --</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.phoneNumber}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                <div><label>Date *</label><input type="date" required min={today} value={appointmentData.date} onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Time *</label><select required value={appointmentData.time} onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <option value="">Select Time</option>
                                    <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                                    <option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option>
                                </select></div>
                            </div>
                            <div style={{ marginBottom: '15px' }}><label>Reason / Symptoms</label><textarea value={appointmentData.reason} onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})} rows="3" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label>Consultation Fee (₹)</label><input type="number" value={appointmentData.fee} onChange={(e) => setAppointmentData({...appointmentData, fee: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Book Appointment</button>
                            <button type="button" onClick={() => setShowAppointmentForm(false)} style={{ background: '#666', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>Cancel</button>
                        </form>
                    </div>
                )}

                {/* Today's Appointments Table */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                    <h3>Today's Appointments</h3>
                    {todayAppointments.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No appointments scheduled for today.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Patient</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Time</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Fee</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Payment</th>
                                    <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayAppointments.map(apt => (
                                    <tr key={apt.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{apt.patientName}</td>
                                        <td style={{ padding: '10px' }}>{apt.time}</td>
                                        <td style={{ padding: '10px' }}>₹{apt.fee}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ background: apt.status === 'Completed' ? '#d1fae5' : apt.status === 'Confirmed' ? '#dbeafe' : '#fed7aa', padding: '4px 8px', borderRadius: '20px' }}>
                                                {apt.status || 'Scheduled'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ background: apt.paymentStatus === 'Paid' ? '#d1fae5' : '#fed7aa', padding: '4px 8px', borderRadius: '20px' }}>
                                                {apt.paymentStatus === 'Paid' ? '✅ Paid' : '⏳ Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            {apt.status !== 'Cancelled' && apt.paymentStatus !== 'Paid' && (
                                                <>
                                                    {apt.status === 'Scheduled' && (
                                                        <button onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')} style={{ background: '#4A90E2', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>Confirm</button>
                                                    )}
                                                    {apt.status === 'Confirmed' && (
                                                        <button onClick={() => processPayment(apt.id)} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' }}>💳 Pay Now (Add ₹{apt.fee} to Revenue)</button>
                                                    )}
                                                    {apt.status !== 'Completed' && apt.status !== 'Paid' && apt.status !== 'Confirmed' && (
                                                        <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                                                    )}
                                                </>
                                            )}
                                            {apt.paymentStatus === 'Paid' && (
                                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Payment Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Recent Patients Table */}
                <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h3>Recent Patients</h3>
                    {patients.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No patients found.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.slice(0, 5).map(p => (
                                    <tr key={p.id}>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.id}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.firstName} {p.lastName}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{p.phoneNumber}</td>
                                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                            <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 12px', borderRadius: '20px' }}>Active</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }

    // Patients List View
    if (currentPage === 'patients') {
        return (
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Patient Management</h1>
                    <button onClick={() => setShowAddForm(true)} style={{ background: '#4A90E2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Add New Patient</button>
                </div>
                
                {showAddForm && (
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3>Add New Patient</h3>
                        <form onSubmit={handleAddPatient}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                <div><label>First Name *</label><input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Last Name *</label><input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Phone Number *</label><input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            </div>
                            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Save</button>
                            <button type="button" onClick={() => setShowAddForm(false)} style={{ background: '#666', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                        </form>
                    </div>
                )}
                
                {patients.length === 0 ? (
                    <p>No patients found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '10px', overflow: 'hidden' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa' }}>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px' }}>{p.id}</td>
                                        <td style={{ padding: '12px' }}>{p.firstName} {p.lastName}</td>
                                        <td style={{ padding: '12px' }}>{p.phoneNumber}</td>
                                        <td style={{ padding: '12px' }}>{p.email || '-'}</td>
                                        <td style={{ padding: '12px' }}>
                                            <button onClick={() => handleDeletePatient(p.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => setCurrentPage('dashboard')} style={{ background: '#4A90E2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back to Dashboard</button>
                </div>
            </div>
        );
    }

    // Appointments List View
    if (currentPage === 'appointments') {
        return (
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Appointment Management</h1>
                    <button onClick={() => setShowAppointmentForm(true)} style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Book New Appointment</button>
                </div>

                {showAppointmentForm && (
                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                        <h3>Book New Appointment</h3>
                        <form onSubmit={handleAddAppointment}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Select Patient *</label>
                                <select required value={appointmentData.patientId} onChange={(e) => {
                                    const patientId = e.target.value;
                                    const patient = patients.find(p => p.id == patientId);
                                    setAppointmentData({...appointmentData, patientId: patientId, patientName: patient ? `${patient.firstName} ${patient.lastName}` : ''});
                                }} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <option value="">-- Select Patient --</option>
                                    {patients.map(p => (<option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.phoneNumber}</option>))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' }}>
                                <div><label>Date *</label><input type="date" required min={today} value={appointmentData.date} onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                                <div><label>Time *</label><select required value={appointmentData.time} onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                    <option value="">Select Time</option><option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                                    <option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option>
                                </select></div>
                            </div>
                            <div style={{ marginBottom: '15px' }}><label>Reason / Symptoms</label><textarea value={appointmentData.reason} onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})} rows="3" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            <div style={{ marginBottom: '15px' }}><label>Consultation Fee (₹)</label><input type="number" value={appointmentData.fee} onChange={(e) => setAppointmentData({...appointmentData, fee: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} /></div>
                            <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Book Appointment</button>
                            <button type="button" onClick={() => setShowAppointmentForm(false)} style={{ background: '#666', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>Cancel</button>
                        </form>
                    </div>
                )}

                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => setCurrentPage('dashboard')} style={{ background: '#4A90E2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back to Dashboard</button>
                </div>
            </div>
        );
    }

    return null;
};

export default StaffApp;