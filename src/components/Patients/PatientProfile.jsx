import React, { useState, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaTint, FaEdit, FaSave, FaCamera, FaCheckCircle, FaTimes, FaHospital, FaHeartbeat, FaSyringe, FaFileMedical } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientProfile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const fileInputRef = useRef(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        firstName: user.firstName || 'Om',
        lastName: user.lastName || 'Mirajkar',
        email: user.email || 'shrirajmaraj951@gmail.com',
        phone: user.phone || '',
        alternatePhone: '',
        dateOfBirth: '1995-06-15',
        gender: 'Male',
        bloodGroup: 'O+',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergencyContact: '',
        emergencyPhone: '',
        allergies: 'None',
        medicalConditions: 'None'
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [activeTab, setActiveTab] = useState('profile');
    
    const [medicalStats] = useState({
        totalVisits: 12,
        lastVisit: '2024-04-10',
        nextAppointment: '2024-04-25',
        prescriptions: 5,
        reports: 3
    });
    
    const [recentActivities] = useState([
        { id: 1, type: 'appointment', title: 'Appointment with Dr. Sarah Johnson', date: '2024-04-10', status: 'Completed' },
        { id: 2, type: 'prescription', title: 'New prescription added', date: '2024-04-05', status: 'Active' },
        { id: 3, type: 'report', title: 'Blood test report uploaded', date: '2024-04-01', status: 'Ready' },
    ]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                toast.success('Profile picture updated!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = () => {
        // Update user in localStorage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => u.email === user.email ? { ...u, ...formData } : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        toast.success('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="patient-profile-premium">
            {/* Profile Banner */}
            <div className="profile-banner">
                <div className="banner-overlay"></div>
            </div>

            {/* Profile Content */}
            <div className="profile-content-wrapper">
                {/* Profile Image Section */}
                <div className="profile-image-section">
                    <div className="profile-image-container">
                        {profileImage ? (
                            <img src={profileImage} alt="Patient" className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">
                                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                            </div>
                        )}
                        <button 
                            className="upload-image-btn"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaCamera />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <h3>{formData.firstName} {formData.lastName}</h3>
                    <p className="patient-id">Patient ID: #{user.id || 'P-1001'}</p>
                    <div className="verification-badge">
                        <FaCheckCircle /> Verified Account
                    </div>
                </div>

                {/* Main Profile Info */}
                <div className="profile-info-main">
                    <div className="profile-header-actions">
                        <div className="header-title">
                            <h1>My Profile</h1>
                            <p>Manage your personal information and health records</p>
                        </div>
                        {!isEditing && (
                            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                <FaEdit /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Medical Stats Cards */}
                    <div className="medical-stats-grid">
                        <div className="medical-stat-card">
                            <div className="stat-icon">🏥</div>
                            <div className="stat-info">
                                <h4>Total Visits</h4>
                                <p>{medicalStats.totalVisits}</p>
                            </div>
                        </div>
                        <div className="medical-stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-info">
                                <h4>Last Visit</h4>
                                <p>{medicalStats.lastVisit}</p>
                            </div>
                        </div>
                        <div className="medical-stat-card">
                            <div className="stat-icon">📋</div>
                            <div className="stat-info">
                                <h4>Prescriptions</h4>
                                <p>{medicalStats.prescriptions}</p>
                            </div>
                        </div>
                        <div className="medical-stat-card">
                            <div className="stat-icon">📄</div>
                            <div className="stat-info">
                                <h4>Reports</h4>
                                <p>{medicalStats.reports}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="profile-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FaUser /> Personal Info
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    🔒 Security
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                    onClick={() => setActiveTab('activity')}
                >
                    📋 Activity Log
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
                    onClick={() => setActiveTab('medical')}
                >
                    <FaHeartbeat /> Medical Info
                </button>
            </div>

            {/* Tab Content */}
            <div className="profile-tab-content">
                {/* Personal Information Tab */}
                {activeTab === 'profile' && (
                    <div className="profile-card">
                        <div className="card-header">
                            <h3><FaUser /> Personal Information</h3>
                            {isEditing && (
                                <div className="action-buttons">
                                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                                        <FaTimes /> Cancel
                                    </button>
                                    <button className="btn-save" onClick={handleUpdateProfile}>
                                        <FaSave /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>First Name</label>
                                    {isEditing ? (
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                    ) : (
                                        <p>{formData.firstName}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label>Last Name</label>
                                    {isEditing ? (
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                    ) : (
                                        <p>{formData.lastName}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label><FaEnvelope /> Email</label>
                                    {isEditing ? (
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                                    ) : (
                                        <p>{formData.email}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label><FaPhone /> Phone Number</label>
                                    {isEditing ? (
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone number" />
                                    ) : (
                                        <p>{formData.phone || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label>Alternate Phone</label>
                                    {isEditing ? (
                                        <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} placeholder="Emergency contact number" />
                                    ) : (
                                        <p>{formData.alternatePhone || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label><FaCalendarAlt /> Date of Birth</label>
                                    {isEditing ? (
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} />
                                    ) : (
                                        <p>{formData.dateOfBirth || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label><FaVenusMars /> Gender</label>
                                    {isEditing ? (
                                        <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    ) : (
                                        <p>{formData.gender || 'Not provided'}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label><FaTint /> Blood Group</label>
                                    {isEditing ? (
                                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}>
                                            <option>A+</option>
                                            <option>A-</option>
                                            <option>B+</option>
                                            <option>B-</option>
                                            <option>O+</option>
                                            <option>O-</option>
                                            <option>AB+</option>
                                            <option>AB-</option>
                                        </select>
                                    ) : (
                                        <p>{formData.bloodGroup || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className="form-section">
                                <h4><FaMapMarkerAlt /> Address</h4>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Street Address</label>
                                        {isEditing ? (
                                            <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" placeholder="Enter your address" />
                                        ) : (
                                            <p>{formData.address || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div className="form-field">
                                        <label>City</label>
                                        {isEditing ? (
                                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city" />
                                        ) : (
                                            <p>{formData.city || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div className="form-field">
                                        <label>State</label>
                                        {isEditing ? (
                                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state" />
                                        ) : (
                                            <p>{formData.state || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div className="form-field">
                                        <label>Pincode</label>
                                        {isEditing ? (
                                            <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Enter pincode" />
                                        ) : (
                                            <p>{formData.pincode || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Emergency Contact</h4>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Contact Person</label>
                                        {isEditing ? (
                                            <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Name of emergency contact" />
                                        ) : (
                                            <p>{formData.emergencyContact || 'Not provided'}</p>
                                        )}
                                    </div>
                                    <div className="form-field">
                                        <label>Emergency Phone</label>
                                        {isEditing ? (
                                            <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} placeholder="Emergency contact number" />
                                        ) : (
                                            <p>{formData.emergencyPhone || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab - Change Password */}
                {activeTab === 'security' && (
                    <div className="profile-card">
                        <div className="card-header">
                            <h3>🔒 Change Password</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Current Password</label>
                                    <input 
                                        type="password" 
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <button className="btn-primary" onClick={handleChangePassword}>
                                Change Password
                            </button>
                        </div>
                    </div>
                )}

                {/* Activity Log Tab */}
                {activeTab === 'activity' && (
                    <div className="profile-card">
                        <div className="card-header">
                            <h3>📋 Recent Activity</h3>
                        </div>
                        <div className="card-body">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className={`activity-icon ${activity.type}`}>
                                        {activity.type === 'appointment' && '📅'}
                                        {activity.type === 'prescription' && '💊'}
                                        {activity.type === 'report' && '📄'}
                                    </div>
                                    <div className="activity-details">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.date}</p>
                                    </div>
                                    <div className="activity-status">
                                        <span className={`status-badge ${activity.status.toLowerCase()}`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Medical Information Tab */}
                {activeTab === 'medical' && (
                    <div className="profile-card">
                        <div className="card-header">
                            <h3><FaHeartbeat /> Medical Information</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Allergies</label>
                                    {isEditing ? (
                                        <textarea name="allergies" value={formData.allergies} onChange={handleInputChange} rows="2" placeholder="List any allergies" />
                                    ) : (
                                        <p>{formData.allergies || 'None reported'}</p>
                                    )}
                                </div>
                                <div className="form-field">
                                    <label>Medical Conditions</label>
                                    {isEditing ? (
                                        <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} rows="2" placeholder="List any medical conditions" />
                                    ) : (
                                        <p>{formData.medicalConditions || 'None reported'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientProfile;