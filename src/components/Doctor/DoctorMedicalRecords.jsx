import React, { useState } from 'react';

const DoctorMedicalRecords = () => {
    const [records] = useState([
        { id: 1, patient: 'John Doe', type: 'Lab Report', date: '2024-04-10', size: '2.5 MB' },
        { id: 2, patient: 'Jane Smith', type: 'X-Ray', date: '2024-04-09', size: '4.2 MB' },
    ]);

    return (
        <div className="premium-dashboard">
            <h1>Medical Records</h1>
            <button className="floating-add-btn">+ Upload Record</button>
            <div className="stats-grid-premium">
                {records.map(record => (
                    <div key={record.id} className="stat-card-premium">
                        <h3>{record.patient}</h3>
                        <p>Type: {record.type}</p>
                        <p>Date: {record.date}</p>
                        <p>Size: {record.size}</p>
                        <button className="view-btn">View</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorMedicalRecords;