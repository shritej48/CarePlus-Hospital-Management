import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaUsers, FaCalendarAlt, FaFileMedical, 
    FaPrescription, FaMoneyBillWave, FaBell, FaUserCircle, 
    FaSignOutAlt, FaStethoscope, FaHospitalUser, FaChartLine,
    FaUserPlus, FaNotesMedical, FaAmbulance
} from 'react-icons/fa';

const StaffSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        { path: '/staff/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
        { path: '/staff/patients', icon: <FaUsers />, label: 'Patients Management', badge: 'CRUD' },
        { path: '/staff/add-patient', icon: <FaUserPlus />, label: 'Add New Patient' },
        { path: '/staff/appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
        { path: '/staff/medical-records', icon: <FaFileMedical />, label: 'Medical Records' },
        { path: '/staff/prescriptions', icon: <FaPrescription />, label: 'Prescriptions' },
        { path: '/staff/billing', icon: <FaMoneyBillWave />, label: 'Billing' },
        { path: '/staff/doctors', icon: <FaStethoscope />, label: 'Doctor Schedule' },
        { path: '/staff/reports', icon: <FaChartLine />, label: 'Reports' },
        { path: '/staff/notifications', icon: <FaBell />, label: 'Notifications' },
        { path: '/staff/profile', icon: <FaUserCircle />, label: 'Profile' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className={`staff-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-icon">
                    <FaHospitalUser />
                </div>
                <div className="logo-text">
                    <h3>Care<span>Plus</span></h3>
                    <p>Staff Portal</p>
                </div>
            </div>

            <div className="staff-info">
                <div className="staff-avatar">
                    {user.firstName?.[0] || 'S'}
                </div>
                <div className="staff-details">
                    <h4>{user.firstName || 'Staff'} {user.lastName || 'User'}</h4>
                    <p>Hospital Staff • ID: {user.id || 'STF001'}</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                        {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                    </Link>
                ))}
                
                <div className="sidebar-divider"></div>
                
                <button onClick={handleLogout} className="sidebar-link logout">
                    <FaSignOutAlt /> Logout
                </button>
            </nav>

            <div className="sidebar-footer">
                <div className="hospital-info">
                    <FaHospitalUser />
                    <div>
                        <p>CarePlus Hospital</p>
                        <span>Mumbai, India</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffSidebar;