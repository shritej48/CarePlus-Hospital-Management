import React, { useState, useEffect } from 'react';

const StaffPatientsList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(allPatients);
    }, []);

    const handleDelete = (id) => {
        if (confirm('Delete this patient?')) {
            const updated = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(updated));
            setPatients(updated);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Patient Management</h1>
            <button onClick={() => window.location.href = '/staff/add-patient'} style={{ background: '#4A90E2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
                + Add New Patient
            </button>
            
            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Phone</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{p.id}</td>
                                <td style={{ padding: '10px' }}>{p.firstName} {p.lastName}</td>
                                <td style={{ padding: '10px' }}>{p.phoneNumber}</td>
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => handleDelete(p.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StaffPatientsList;