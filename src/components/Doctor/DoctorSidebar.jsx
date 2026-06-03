import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaHome, FaCalendarAlt, FaUsers, FaFileMedical, FaPrescription, 
    FaClock, FaEnvelope, FaBell, FaUserCircle, FaSignOutAlt,
    FaChartLine, FaStethoscope, FaHospitalUser, FaWallet
} from 'react-icons/fa';

const DoctorSidebar = ({ sidebarOpen, setSidebarOpen, doctor }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = doctor || JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        { path: '/doctor/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
        { path: '/doctor/appointments', icon: <FaCalendarAlt />, label: 'Appointments', badge: 5 },
        { path: '/doctor/patients', icon: <FaUsers />, label: 'My Patients' },
        { path: '/doctor/medical-records', icon: <FaFileMedical />, label: 'Medical Records' },
        { path: '/doctor/prescriptions', icon: <FaPrescription />, label: 'Prescriptions' },
        { path: '/doctor/schedule', icon: <FaClock />, label: 'Schedule' },
        { path: '/doctor/messages', icon: <FaEnvelope />, label: 'Messages', badge: 3 },
        { path: '/doctor/notifications', icon: <FaBell />, label: 'Notifications', badge: 7 },
        { path: '/doctor/profile', icon: <FaUserCircle />, label: 'Profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (setSidebarOpen) setSidebarOpen(false);
    };

    return (
        <>
            <div className={`doctor-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <FaStethoscope />
                    </div>
                    <div className="logo-text">
                        <h3>Care<span>Plus</span></h3>
                        <p>Doctor Portal</p>
                    </div>
                </div>

                <div className="sidebar-doctor-info">
                    <div className="doctor-avatar-premium">
                        {user.firstName?.[0] || 'R'}
                    </div>
                    <div className="doctor-details">
                        <h4>Dr. {user.firstName || 'Rajesh'} {user.lastName || 'Kumar'}</h4>
                        <p>{user.specialization || 'Cardiologist'} • ID: {user.id || '1001'}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setSidebarOpen && setSidebarOpen(false)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                        </Link>
                    ))}
                    
                    <div className="sidebar-divider"></div>
                    
                    <button onClick={handleLogout} className="sidebar-link logout">
                        <span className="sidebar-icon"><FaSignOutAlt /></span>
                        <span className="sidebar-label">Logout</span>
                    </button>
                </nav>

                {/* Clinic Info Footer */}
                <div className="sidebar-footer">
                    <div className="clinic-info">
                        <FaHospitalUser />
                        <div>
                            <p>CarePlus Hospital</p>
                            <span>Mumbai, India</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorSidebar;