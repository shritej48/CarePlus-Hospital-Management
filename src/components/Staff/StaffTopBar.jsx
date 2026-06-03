import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StaffTopBar = ({ setSidebarOpen }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            // Search logic
        }
    };

    return (
        <div className="staff-topbar">
            <button className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
                <FaBars />
            </button>
            
            <div className="topbar-search">
                <FaSearch />
                <input type="text" placeholder="Search patients..." value={searchQuery} onChange={handleSearch} />
            </div>
            
            <div className="topbar-actions">
                <div className="notification-icon">
                    <FaBell />
                    <span className="notification-badge">3</span>
                </div>
                <div className="staff-profile">
                    <FaUserCircle size={24} />
                </div>
            </div>
        </div>
    );
};

export default StaffTopBar;