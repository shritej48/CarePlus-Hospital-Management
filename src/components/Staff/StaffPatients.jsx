import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const StaffPatients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(allPatients);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            const updated = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(updated));
            loadPatients();
        }
    };

    const filteredPatients = patients.filter(p =>
        (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phoneNumber.includes(searchTerm)
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h1 style={{ margin: 0 }}>Patient Management</h1>
                <button onClick={() => navigate('/staff/add-patient')} style={{
                    background: 'linear-gradient(135deg, #4A90E2, #00BFA6)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FaPlus /> Add New Patient
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '10px' }}>
                <FaSearch style={{ color: '#6c757d', marginTop: '10px' }} />
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span style={{ padding: '10px', color: '#6c757d' }}>{filteredPatients.length} patients</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa' }}>
                            <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Phone</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No patients found</td></tr>
                        ) : (
                            filteredPatients.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                                    <td style={{ padding: '12px 15px' }}>{p.id}</td>
                                    <td style={{ padding: '12px 15px' }}><strong>{p.firstName} {p.lastName}</strong></td>
                                    <td style={{ padding: '12px 15px' }}>{p.phoneNumber}</td>
                                    <td style={{ padding: '12px 15px' }}>{p.email || '-'}</td>
                                    <td style={{ padding: '12px 15px' }}><span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', background: '#d1fae5', color: '#065f46' }}>Active</span></td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <button onClick={() => navigate(`/staff/patients/${p.id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}><FaEye /></button>
                                        <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffPatients;