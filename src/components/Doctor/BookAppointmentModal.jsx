import React, { useState } from 'react';
import { FaTimes, FaCalendarCheck, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentAdded, patients }) => {
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        date: '',
        time: '',
        symptoms: '',
        type: 'Consultation',
        fee: 500
    });

    const handlePatientSelect = (e) => {
        const patientId = e.target.value;
        const patient = patients.find(p => p.id == patientId);
        if (patient) {
            setFormData({
                ...formData,
                patientId: patientId,
                patientName: `${patient.firstName} ${patient.lastName}`
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.patientId || !formData.date || !formData.time) {
            toast.error('Please select patient, date and time');
            return;
        }
        
        // Get existing appointments
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // Create new appointment
        const newAppointment = {
            id: Date.now(),
            ...formData,
            status: 'Scheduled',
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        existingAppointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(existingAppointments));
        
        // Add notification
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.push({
            id: Date.now(),
            message: `New appointment booked with ${formData.patientName}`,
            time: 'Just now',
            read: false,
            type: 'appointment'
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        toast.success('Appointment booked successfully!');
        onAppointmentAdded(newAppointment);
        onClose();
        setFormData({
            patientId: '',
            patientName: '',
            date: '',
            time: '',
            symptoms: '',
            type: 'Consultation',
            fee: 500
        });
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                width: '90%',
                maxWidth: '500px',
                padding: '25px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}><FaCalendarCheck /> Book Appointment</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Patient *</label>
                        <select
                            required
                            value={formData.patientId}
                            onChange={handlePatientSelect}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                        >
                            <option value="">-- Select Patient --</option>
                            {patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.firstName} {patient.lastName} - {patient.phoneNumber}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date *</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Time *</label>
                            <select
                                required
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            >
                                <option value="">Select Time</option>
                                <option>09:00 AM</option>
                                <option>10:00 AM</option>
                                <option>11:00 AM</option>
                                <option>02:00 PM</option>
                                <option>03:00 PM</option>
                                <option>04:00 PM</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Symptoms / Reason</label>
                        <textarea
                            value={formData.symptoms}
                            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                            rows="3"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Appointment Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            >
                                <option>Consultation</option>
                                <option>Follow-up</option>
                                <option>Emergency</option>
                                <option>Checkup</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Consultation Fee</label>
                            <input
                                type="number"
                                value={formData.fee}
                                onChange={(e) => setFormData({...formData, fee: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                    
                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #4A90E2, #00BFA6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <FaSave /> Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointmentModal;