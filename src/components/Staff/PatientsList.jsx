import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaSearch, FaPlus, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientsList = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        const allPatients = JSON.parse(localStorage.getItem('patients') || '[]');
        setPatients(allPatients);
        setFilteredPatients(allPatients);
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = patients.filter(p => 
            p.firstName.toLowerCase().includes(term) ||
            p.lastName.toLowerCase().includes(term) ||
            p.phoneNumber.includes(term) ||
            (p.email && p.email.toLowerCase().includes(term))
        );
        setFilteredPatients(filtered);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            const updatedPatients = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(updatedPatients));
            loadPatients();
            toast.success('Patient deleted successfully');
        }
    };

    const handleExport = () => {
        const csv = patients.map(p => `${p.firstName},${p.lastName},${p.phoneNumber},${p.email},${p.lastVisit}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'patients.csv';
        a.click();
        toast.success('Patients exported successfully');
    };

    return (
        <div className="patients-list-container">
            <div className="page-header">
                <div>
                    <h1>Patient Management</h1>
                    <p>View, edit, and manage all patients</p>
                </div>
                <div className="header-actions">
                    <button onClick={() => navigate('/staff/add-patient')} className="btn-primary"><FaPlus /> Add Patient</button>
                    <button onClick={handleExport} className="btn-secondary"><FaDownload /> Export</button>
                </div>
            </div>

            <div className="search-bar">
                <FaSearch />
                <input type="text" placeholder="Search by name, phone or email..." value={searchTerm} onChange={handleSearch} />
                <span className="search-count">{filteredPatients.length} patients found</span>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Last Visit</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No patients found</td></tr>
                        ) : (
                            filteredPatients.map(patient => (
                                <tr key={patient.id}>
                                    <td>{patient.id}</td>
                                    <td><strong>{patient.firstName} {patient.lastName}</strong></td>
                                    <td>{patient.phoneNumber}</td>
                                    <td>{patient.email || '-'}</td>
                                    <td>{patient.lastVisit || 'N/A'}</td>
                                    <td><span className="status-badge active">Active</span></td>
                                    <td>
                                        <button onClick={() => navigate(`/staff/patients/${patient.id}`)} className="icon-btn" title="View"><FaEye /></button>
                                        <button onClick={() => navigate(`/staff/edit-patient/${patient.id}`)} className="icon-btn" title="Edit"><FaEdit /></button>
                                        <button onClick={() => handleDelete(patient.id)} className="icon-btn delete" title="Delete"><FaTrash /></button>
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

export default PatientsList;