import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.role || 'PATIENT';

    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Patient Menu Items
    const patientMenu = [
        { path: '/patient/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/patient/doctors', name: 'Doctors', icon: '👨‍⚕️' },
        { path: '/patient/appointments', name: 'Appointments', icon: '📅' },
        { path: '/patient/medical-records', name: 'Medical Records', icon: '📋' },
        { path: '/patient/billing', name: 'Billing', icon: '💰' },
        { path: '/patient/profile', name: 'Profile', icon: '👤' },
    ];

    // Doctor Menu Items
    const doctorMenu = [
        { path: '/doctor/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/doctor/appointments', name: 'Appointments', icon: '📅' },
        { path: '/doctor/patients', name: 'My Patients', icon: '👥' },
        { path: '/doctor/profile', name: 'Profile', icon: '👤' },
    ];

    // Admin Menu Items
    const adminMenu = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/admin/users', name: 'Users', icon: '👥' },
        { path: '/admin/reports', name: 'Reports', icon: '📈' },
        { path: '/admin/settings', name: 'Settings', icon: '⚙️' },
    ];

    // Select menu based on role
    let menuItems = patientMenu;
    if (userRole === 'DOCTOR') menuItems = doctorMenu;
    if (userRole === 'ADMIN') menuItems = adminMenu;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <h2>🏥 CarePlus Hospital</h2>
                <p>Welcome, Dr. {user.firstName || user.email || 'User'}! ({userRole})</p>
            </div>
            
            <div className="navbar-menu">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </div>
            
            <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
            </button>
        </nav>
    );
};

export default Navbar;