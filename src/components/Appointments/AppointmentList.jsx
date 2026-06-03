import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([
        { id: 1, patientName: 'John Doe', doctorName: 'Dr. Sarah Johnson', date: '2024-04-15', time: '10:30 AM', status: 'Scheduled' },
        { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Michael Chen', date: '2024-04-15', time: '2:00 PM', status: 'Confirmed' },
    ]);

    const updateStatus = (id, newStatus) => {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
        toast.success(`Appointment ${newStatus}`);
    };

    return (
        <div className="dashboard-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Appointment Management</h1>
                <button className="login-btn" style={{width: 'auto'}}>+ Book Appointment</button>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(apt => (
                            <tr key={apt.id}>
                                <td>{apt.id}</td>
                                <td>{apt.patientName}</td>
                                <td>{apt.doctorName}</td>
                                <td>{apt.date}</td>
                                <td>{apt.time}</td>
                                <td><span style={{padding: '5px 10px', borderRadius: '5px', background: apt.status === 'Confirmed' ? '#d1fae5' : '#fed7aa'}}>{apt.status}</span></td>
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => updateStatus(apt.id, 'Confirmed')}>Confirm</button>
                                    <button className="action-btn delete-btn" onClick={() => updateStatus(apt.id, 'Cancelled')}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentList;