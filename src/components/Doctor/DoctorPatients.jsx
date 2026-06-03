import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DoctorPatients = () => {
    const [patients] = useState([
        { id: 1, name: 'John Doe', age: 35, lastVisit: '2024-04-10', status: 'Active' },
        { id: 2, name: 'Jane Smith', age: 28, lastVisit: '2024-04-09', status: 'Active' },
        { id: 3, name: 'Robert Brown', age: 45, lastVisit: '2024-04-08', status: 'Follow-up' },
    ]);

    return (
        <div className="premium-dashboard">
            <h1>My Patients</h1>
            <div className="stats-grid-premium">
                {patients.map(patient => (
                    <div key={patient.id} className="stat-card-premium">
                        <h3>{patient.name}</h3>
                        <p>Age: {patient.age} years</p>
                        <p>Last Visit: {patient.lastVisit}</p>
                        <p>Status: {patient.status}</p>
                        <Link to={`/doctor/patients/${patient.id}`} className="view-btn">View Details</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorPatients;