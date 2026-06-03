import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState([
        { icon: '👥', title: 'Total Patients', value: 0 },
        { icon: '👨‍⚕️', title: 'Total Doctors', value: 0 },
        { icon: '📅', title: 'Total Appointments', value: 0 },
        { icon: '📆', title: "Today's Appointments", value: 0 },
        { icon: '💰', title: 'Total Revenue', value: 0 },
        { icon: '⏳', title: 'Pending Payments', value: 0 },
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStats([
                { icon: '👥', title: 'Total Patients', value: 156 },
                { icon: '👨‍⚕️', title: 'Total Doctors', value: 24 },
                { icon: '📅', title: 'Total Appointments', value: 342 },
                { icon: '📆', title: "Today's Appointments", value: 12 },
                { icon: '💰', title: 'Total Revenue', value: '₹45,280' },
                { icon: '⏳', title: 'Pending Payments', value: 8 },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-content">
            <h1>Dashboard Overview</h1>
            
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '10px', marginTop: '20px'}}>
                <h3>Welcome to Hospital Management System</h3>
                <p style={{marginTop: '10px', color: '#666'}}>
                    Manage patients, doctors, appointments, and billing all in one place.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;