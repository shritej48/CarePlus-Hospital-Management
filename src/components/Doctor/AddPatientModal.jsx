import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '',
        emergencyContact: '',
        medicalHistory: '',
        diagnosis: '',
        lastVisit: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get existing patients
        const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        
        // Create new patient
        const newPatient = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        existingPatients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(existingPatients));
        
        toast.success('Patient added successfully!');
        onPatientAdded(newPatient);
        onClose();
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            gender: 'Male',
            bloodGroup: 'O+',
            address: '',
            emergencyContact: '',
            medicalHistory: '',
            diagnosis: '',
            lastVisit: new Date().toISOString().split('T')[0]
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
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '25px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}><FaUserPlus /> Add New Patient</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                        <FaTimes />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date of Birth</label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Blood Group</label>
                            <select
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            >
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>B-</option>
                                <option>O+</option>
                                <option>O-</option>
                                <option>AB+</option>
                                <option>AB-</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                rows="2"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Emergency Contact</label>
                            <input
                                type="text"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Diagnosis</label>
                            <input
                                type="text"
                                value={formData.diagnosis}
                                onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Medical History</label>
                            <textarea
                                value={formData.medicalHistory}
                                onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                                rows="3"
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                        <button type="submit" style={{
                            flex: 1,
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
                            <FaSave /> Save Patient
                        </button>
                        <button type="button" onClick={onClose} style={{
                            padding: '12px 25px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;