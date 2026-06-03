import React, { useState } from 'react';

const StaffAddPatient = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const newPatient = {
            id: Date.now(),
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone,
            email: email,
            status: 'Active',
            createdAt: new Date().toISOString()
        };
        patients.push(newPatient);
        localStorage.setItem('patients', JSON.stringify(patients));
        alert('Patient added successfully!');
        window.location.href = '/staff/patients';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Add New Patient</h1>
            <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label>First Name:</label><br />
                    <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Last Name:</label><br />
                    <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Phone Number:</label><br />
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label><br />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                </div>
                <button type="submit" style={{ background: '#4A90E2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Patient</button>
                <button type="button" onClick={() => window.location.href = '/staff/dashboard'} style={{ marginLeft: '10px', padding: '10px 20px', background: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
            </form>
        </div>
    );
};

export default StaffAddPatient;