import React, { useState } from 'react';
import { FaSearch, FaBell, FaSun, FaMoon, FaChevronDown, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DoctorTopBar = ({ toggleDarkMode, darkMode, doctor, setSidebarOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const user = doctor || JSON.parse(localStorage.getItem('user') || '{}');

    const notifications = [
        { id: 1, message: 'New appointment booked by Rajesh Sharma', time: '5 min ago', read: false },
        { id: 2, message: 'Lab report uploaded for Priya Patel', time: '30 min ago', read: false },
        { id: 3, message: 'Prescription refill request for Amit Kumar', time: '1 hour ago', read: true },
        { id: 4, message: 'Appointment cancelled by Sneha Reddy', time: '2 hours ago', read: true },
        { id: 5, message: 'New patient registered: Vikram Singh', time: '3 hours ago', read: false },
    ];

    return (
        <div className="doctor-topbar">
            <div className="topbar-left">
                <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(true)}>
                    ☰
                </button>
                <div className="topbar-greeting">
                    <h4>नमस्ते, Dr. {user.firstName || 'Rajesh'}</h4>
                    <p>Have a great day!</p>
                </div>
            </div>

            <div className="topbar-search">
                <FaSearch className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search patients, appointments..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="topbar-actions">
                <div className="date-indicator">
                    <FaCalendarAlt />
                    <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>

                <button className="theme-toggle" onClick={toggleDarkMode}>
                    {darkMode ? <FaSun /> : <FaMoon />}
                </button>

                <div className="notification-dropdown">
                    <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                        <FaBell />
                        <span className="notification-count">7</span>
                    </button>
                    {showNotifications && (
                        <div className="dropdown-menu notification-menu">
                            <div className="dropdown-header">
                                <h4>Notifications</h4>
                                <Link to="/doctor/notifications">View All</Link>
                            </div>
                            {notifications.slice(0, 5).map(notif => (
                                <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                                    <p>{notif.message}</p>
                                    <span>{notif.time}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="profile-dropdown">
                    <button className="profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                        <div className="profile-avatar-small">
                            {user.firstName?.[0] || 'R'}
                        </div>
                        <span>Dr. {user.firstName || 'Rajesh'}</span>
                        <FaChevronDown />
                    </button>
                    {showProfileDropdown && (
                        <div className="dropdown-menu profile-menu">
                            <Link to="/doctor/profile">👤 My Profile</Link>
                            <Link to="/doctor/schedule">⏰ My Schedule</Link>
                            <Link to="/doctor/appointments">📅 Appointments</Link>
                            <hr />
                            <button onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}>🚪 Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorTopBar;