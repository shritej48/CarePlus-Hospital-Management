import React, { useState } from 'react';

const DoctorPrescriptions = () => {
    const [prescriptions] = useState([
        { id: 1, patient: 'John Doe', medicine: 'Lisinopril', dosage: '10mg', date: '2024-04-10' },
        { id: 2, patient: 'Jane Smith', medicine: 'Sumatriptan', dosage: '50mg', date: '2024-04-09' },
    ]);

    return (
        <div className="premium-dashboard">
            <h1>Prescriptions</h1>
            <button className="floating-add-btn">+ Write Prescription</button>
            <div className="stats-grid-premium">
                {prescriptions.map(pres => (
                    <div key={pres.id} className="stat-card-premium">
                        <h3>{pres.patient}</h3>
                        <p>Medicine: {pres.medicine}</p>
                        <p>Dosage: {pres.dosage}</p>
                        <p>Date: {pres.date}</p>
                        <button className="view-btn">Print</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorPrescriptions;