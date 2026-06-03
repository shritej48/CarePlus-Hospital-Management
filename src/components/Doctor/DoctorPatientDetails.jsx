import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaCalendar, FaVenusMars, FaTint, FaPhone, FaEnvelope, FaFileMedical, FaPrescription, FaHistory } from 'react-icons/fa';

const DoctorPatientDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('history');
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        // Mock patient data - In real app, fetch from API
        setPatient({
            id: id,
            name: 'John Doe',
            age: 35,
            gender: 'Male',
            bloodGroup: 'O+',
            phone: '+91 98765 43210',
            email: 'john.doe@example.com',
            address: '123 Main Street, New York',
            medicalHistory: [
                { date: '2024-01-15', diagnosis: 'Hypertension', doctor: 'Dr. Sarah Johnson', notes: 'Patient has high blood pressure. Prescribed medication.' },
                { date: '2024-02-20', diagnosis: 'Migraine', doctor: 'Dr. Sarah Johnson', notes: 'Severe headaches. Recommended rest and medication.' },
            ],
            prescriptions: [
                { id: 1, date: '2024-03-10', medicine: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take with food' },
                { id: 2, date: '2024-02-20', medicine: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '10 days', instructions: 'Take at onset of migraine' },
            ],
            reports: [
                { id: 1, name: 'Blood Test Report', date: '2024-03-10', type: 'Lab Report', size: '2.5 MB' },
                { id: 2, name: 'Chest X-Ray', date: '2024-02-15', type: 'Scan', size: '4.2 MB' },
            ]
        });
    }, [id]);

    if (!patient) {
        return <div className="premium-dashboard"><p>Loading patient details...</p></div>;
    }

    return (
        <div className="premium-dashboard">
            {/* Patient Profile Card */}
            <div className="patient-profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-large">
                        {patient.name.charAt(0)}
                    </div>
                    <div className="profile-info">
                        <h1>{patient.name}</h1>
                        <p>Patient ID: #{patient.id}</p>
                    </div>
                </div>
                <div className="profile-details-grid">
                    <div className="detail-item">
                        <FaCalendar />
                        <span><strong>Age:</strong> {patient.age} years</span>
                    </div>
                    <div className="detail-item">
                        <FaVenusMars />
                        <span><strong>Gender:</strong> {patient.gender}</span>
                    </div>
                    <div className="detail-item">
                        <FaTint />
                        <span><strong>Blood Group:</strong> {patient.bloodGroup}</span>
                    </div>
                    <div className="detail-item">
                        <FaPhone />
                        <span><strong>Phone:</strong> {patient.phone}</span>
                    </div>
                    <div className="detail-item">
                        <FaEnvelope />
                        <span><strong>Email:</strong> {patient.email}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="patient-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <FaHistory /> Medical History
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('prescriptions')}
                >
                    <FaPrescription /> Prescriptions
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <FaFileMedical /> Reports
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'history' && (
                    <div className="medical-history">
                        {patient.medicalHistory.map((record, index) => (
                            <div key={index} className="history-card">
                                <div className="history-date">{record.date}</div>
                                <div className="history-details">
                                    <h4>{record.diagnosis}</h4>
                                    <p><strong>Doctor:</strong> {record.doctor}</p>
                                    <p><strong>Notes:</strong> {record.notes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div className="prescriptions-list">
                        <button className="btn-primary">+ Write New Prescription</button>
                        {patient.prescriptions.map(pres => (
                            <div key={pres.id} className="prescription-card">
                                <div className="prescription-header">
                                    <span className="prescription-date">{pres.date}</span>
                                    <button className="btn-print">Print</button>
                                </div>
                                <div className="prescription-details">
                                    <p><strong>Medicine:</strong> {pres.medicine}</p>
                                    <p><strong>Dosage:</strong> {pres.dosage}</p>
                                    <p><strong>Frequency:</strong> {pres.frequency}</p>
                                    <p><strong>Duration:</strong> {pres.duration}</p>
                                    <p><strong>Instructions:</strong> {pres.instructions}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="reports-list">
                        <button className="btn-primary">+ Upload Report</button>
                        {patient.reports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-icon">📄</div>
                                <div className="report-details">
                                    <h4>{report.name}</h4>
                                    <p>{report.type} • {report.date} • {report.size}</p>
                                </div>
                                <div className="report-actions">
                                    <button className="btn-view">View</button>
                                    <button className="btn-download">Download</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorPatientDetails;