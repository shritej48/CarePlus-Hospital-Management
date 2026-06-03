import React, { useState, useRef } from 'react';
import { FaUserMd, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaHeartbeat, FaStethoscope, FaSave, FaEdit, FaCamera, FaTimes, FaCheckCircle } from 'react-icons/fa';

const DoctorProfile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const fileInputRef = useRef(null);
    
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [formData, setFormData] = useState({
        firstName: user.firstName || 'Sarah',
        lastName: user.lastName || 'Johnson',
        email: user.email || 'dr.sarah.johnson@careplus.com',
        phone: '+91 98765 43210',
        alternatePhone: '+91 98765 43211',
        specialization: 'Cardiologist',
        subSpecialization: 'Interventional Cardiology',
        experience: '12+ years',
        registrationNumber: 'MC-12345-67890',
        qualification: 'MD in Cardiology, FACC',
        education: [
            'MD in Cardiology - Harvard Medical School (2012)',
            'Fellowship in Interventional Cardiology - Stanford University (2015)',
            'Bachelor of Medicine - John Hopkins University (2008)'
        ],
        consultationFee: '₹500',
        followUpFee: '₹300',
        languages: ['English', 'Hindi', 'Spanish'],
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTime: '9:00 AM - 5:00 PM',
        bio: 'Experienced cardiologist with over 12 years of expertise in treating complex heart conditions. Dedicated to providing compassionate care and improving patient outcomes through evidence-based medicine.',
        awards: [
            'Best Cardiologist Award 2023',
            'Excellence in Patient Care 2022',
            'Research Excellence Award 2021'
        ],
        clinicAddress: '123 Healthcare Street, Medical District, City - 400001',
        clinicName: 'CarePlus Heart Institute',
        socialLinks: {
            linkedin: 'linkedin.com/in/dr-sarah-johnson',
            twitter: 'twitter.com/drsarah',
            researchGate: 'researchgate.net/profile/dr-sarah-johnson'
        }
    });

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would save to backend
        alert('Profile updated successfully!');
    };

    return (
        <div className="doctor-profile-premium">
            {/* Header Banner */}
            <div className="profile-banner">
                <div className="banner-overlay"></div>
            </div>

            {/* Profile Content */}
            <div className="profile-content-wrapper">
                {/* Profile Image Section */}
                <div className="profile-image-section">
                    <div className="profile-image-container">
                        {profileImage ? (
                            <img src={profileImage} alt="Doctor" className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">
                                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                            </div>
                        )}
                        {isEditing && (
                            <button 
                                className="upload-image-btn"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaCamera />
                            </button>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    {!isEditing && (
                        <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                            <FaEdit /> Edit Profile
                        </button>
                    )}
                </div>

                {/* Main Profile Info */}
                <div className="profile-info-main">
                    <div className="doctor-name-title">
                        <h1>Dr. {formData.firstName} {formData.lastName}</h1>
                        <div className="doctor-badges">
                            <span className="badge-specialty">
                                <FaStethoscope /> {formData.specialization}
                            </span>
                            <span className="badge-experience">
                                <FaCalendarAlt /> {formData.experience}
                            </span>
                            <span className="badge-verified">
                                <FaCheckCircle /> Verified
                            </span>
                        </div>
                    </div>

                    <div className="doctor-stats-grid">
                        <div className="stat-item">
                            <div className="stat-value">{formData.experience}</div>
                            <div className="stat-label">Experience</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">5,000+</div>
                            <div className="stat-label">Patients Treated</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">98%</div>
                            <div className="stat-label">Satisfaction Rate</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{formData.consultationFee}</div>
                            <div className="stat-label">Consultation Fee</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Details Grid */}
            <div className="profile-details-grid">
                {/* Left Column - Personal Info */}
                <div className="profile-card">
                    <div className="card-header">
                        <h3><FaUserMd /> Personal Information</h3>
                        {isEditing && <button className="btn-save" onClick={handleSave}><FaSave /> Save</button>}
                    </div>
                    <div className="card-body">
                        <div className="info-row">
                            <label>Full Name</label>
                            {isEditing ? (
                                <div className="edit-field-group">
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" />
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" />
                                </div>
                            ) : (
                                <p>Dr. {formData.firstName} {formData.lastName}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label><FaEnvelope /> Email</label>
                            {isEditing ? (
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.email}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label><FaPhone /> Phone</label>
                            {isEditing ? (
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.phone}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Alternate Phone</label>
                            {isEditing ? (
                                <input type="tel" name="alternatePhone" value={formData.alternatePhone} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.alternatePhone}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label><FaGraduationCap /> Qualification</label>
                            {isEditing ? (
                                <textarea name="qualification" value={formData.qualification} onChange={handleInputChange} rows="2" />
                            ) : (
                                <p>{formData.qualification}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Registration Number</label>
                            {isEditing ? (
                                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.registrationNumber}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Professional Info */}
                <div className="profile-card">
                    <div className="card-header">
                        <h3><FaHeartbeat /> Professional Information</h3>
                    </div>
                    <div className="card-body">
                        <div className="info-row">
                            <label>Specialization</label>
                            {isEditing ? (
                                <select name="specialization" value={formData.specialization} onChange={handleInputChange}>
                                    <option>Cardiologist</option>
                                    <option>Neurologist</option>
                                    <option>Pediatrician</option>
                                    <option>Orthopedic</option>
                                    <option>Dermatologist</option>
                                </select>
                            ) : (
                                <p>{formData.specialization}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Sub-Specialization</label>
                            {isEditing ? (
                                <input type="text" name="subSpecialization" value={formData.subSpecialization} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.subSpecialization}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Consultation Fee</label>
                            {isEditing ? (
                                <input type="text" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.consultationFee}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Follow-up Fee</label>
                            {isEditing ? (
                                <input type="text" name="followUpFee" value={formData.followUpFee} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.followUpFee}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label>Clinic Name</label>
                            {isEditing ? (
                                <input type="text" name="clinicName" value={formData.clinicName} onChange={handleInputChange} />
                            ) : (
                                <p>{formData.clinicName}</p>
                            )}
                        </div>

                        <div className="info-row">
                            <label><FaMapMarkerAlt /> Clinic Address</label>
                            {isEditing ? (
                                <textarea name="clinicAddress" value={formData.clinicAddress} onChange={handleInputChange} rows="2" />
                            ) : (
                                <p>{formData.clinicAddress}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Education & Awards Section */}
            <div className="profile-details-grid">
                <div className="profile-card">
                    <div className="card-header">
                        <h3><FaGraduationCap /> Education</h3>
                    </div>
                    <div className="card-body">
                        {formData.education.map((edu, index) => (
                            <div key={index} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <p>{edu}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="profile-card">
                    <div className="card-header">
                        <h3>Awards & Recognition</h3>
                    </div>
                    <div className="card-body">
                        {formData.awards.map((award, index) => (
                            <div key={index} className="award-item">
                                <div className="award-icon">🏆</div>
                                <div className="award-content">
                                    <p>{award}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            <div className="profile-card full-width">
                <div className="card-header">
                    <h3>About Dr. {formData.lastName}</h3>
                </div>
                <div className="card-body">
                    {isEditing ? (
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0' }} />
                    ) : (
                        <p className="doctor-bio">{formData.bio}</p>
                    )}
                </div>
            </div>

            {/* Schedule Section */}
            <div className="profile-card full-width">
                <div className="card-header">
                    <h3><FaCalendarAlt /> Working Schedule</h3>
                </div>
                <div className="card-body">
                    <div className="schedule-grid">
                        <div className="schedule-days">
                            <label>Available Days</label>
                            <div className="days-badges">
                                {formData.availableDays.map(day => (
                                    <span key={day} className="day-badge">{day}</span>
                                ))}
                            </div>
                        </div>
                        <div className="schedule-time">
                            <label>Available Time</label>
                            <p className="time-text">{formData.availableTime}</p>
                        </div>
                        <div className="schedule-languages">
                            <label>Languages Spoken</label>
                            <div className="languages-badges">
                                {formData.languages.map(lang => (
                                    <span key={lang} className="language-badge">{lang}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;