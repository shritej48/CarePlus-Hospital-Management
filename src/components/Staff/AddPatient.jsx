import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

const AddPatient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '',
        medicalHistory: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const existingPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        const newPatient = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        
        existingPatients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(existingPatients));
        
        alert(`Patient ${formData.firstName} ${formData.lastName} registered successfully!`);
        navigate('/staff/patients');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '20px' }}>Register New Patient</h1>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '25px', borderRadius: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>First Name *</label><input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Last Name *</label><input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Phone Number *</label><input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Date of Birth</label><input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Gender</label><select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}><option>Male</option><option>Female</option><option>Other</option></select></div>
                    <div><label style={{ display: 'block', marginBottom: '5px' }}>Blood Group</label><select value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
                </div>
                <div style={{ marginBottom: '15px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Address</label><textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', marginBottom: '5px' }}>Medical History</label><textarea value={formData.medicalHistory} onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})} rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} /></div>
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => navigate('/staff/patients')} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><FaTimes /> Cancel</button>
                    <button type="submit" style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4A90E2, #00BFA6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><FaSave /> Register Patient</button>
                </div>
            </form>
        </div>
    );
};

export default AddPatient;