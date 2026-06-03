import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaFilter, FaStar, FaStarHalfAlt, FaRegStar,
  FaStethoscope, FaCalendarAlt, FaClock, FaRupeeSign,
  FaUserMd, FaCheckCircle, FaTimes, FaArrowLeft,
  FaVideo, FaMapMarkerAlt, FaHeartbeat, FaAward
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    symptoms: '',
    type: 'Consultation'
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    let allDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');
    
    if (allDoctors.length === 0) {
      const sampleDoctors = [
        { id: 1, firstName: 'Sarah', lastName: 'Johnson', specialization: 'Cardiologist', experience: 15, consultationFee: 500, availability: 'Mon, Wed, Fri', rating: 4.8, patients: 1200, education: 'MD, FACC', languages: ['English', 'Hindi'] },
        { id: 2, firstName: 'Michael', lastName: 'Chen', specialization: 'Neurologist', experience: 12, consultationFee: 600, availability: 'Tue, Thu, Sat', rating: 4.9, patients: 980, education: 'MD, PhD', languages: ['English', 'Mandarin'] },
        { id: 3, firstName: 'Emily', lastName: 'Davis', specialization: 'Pediatrician', experience: 10, consultationFee: 400, availability: 'Mon, Tue, Thu', rating: 4.7, patients: 1500, education: 'MD', languages: ['English', 'Spanish'] },
        { id: 4, firstName: 'Robert', lastName: 'Wilson', specialization: 'Orthopedic', experience: 8, consultationFee: 450, availability: 'Wed, Fri, Sat', rating: 4.6, patients: 850, education: 'MS Ortho', languages: ['English'] },
        { id: 5, firstName: 'Priya', lastName: 'Sharma', specialization: 'Gynecologist', experience: 14, consultationFee: 550, availability: 'Mon, Thu, Sat', rating: 4.9, patients: 2100, education: 'MD, FICS', languages: ['English', 'Hindi'] },
        { id: 6, firstName: 'Rajesh', lastName: 'Kumar', specialization: 'Dermatologist', experience: 9, consultationFee: 480, availability: 'Tue, Wed, Fri', rating: 4.7, patients: 1100, education: 'MD', languages: ['English', 'Hindi'] }
      ];
      localStorage.setItem('doctors', JSON.stringify(sampleDoctors));
      allDoctors = sampleDoctors;
    }
    
    setDoctors(allDoctors);
    setFilteredDoctors(allDoctors);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = doctors;
    
    if (searchTerm) {
      filtered = filtered.filter(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(d => d.specialization === selectedSpecialization);
    }
    
    if (selectedExperience !== 'all') {
      if (selectedExperience === '0-5') filtered = filtered.filter(d => d.experience < 5);
      else if (selectedExperience === '5-10') filtered = filtered.filter(d => d.experience >= 5 && d.experience < 10);
      else if (selectedExperience === '10-15') filtered = filtered.filter(d => d.experience >= 10 && d.experience < 15);
      else if (selectedExperience === '15+') filtered = filtered.filter(d => d.experience >= 15);
    }
    
    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialization, selectedExperience, doctors]);

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];
  const experienceOptions = [
    { value: 'all', label: 'All Experience' },
    { value: '0-5', label: '0-5 Years' },
    { value: '5-10', label: '5-10 Years' },
    { value: '10-15', label: '10-15 Years' },
    { value: '15+', label: '15+ Years' }
  ];

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select date and time');
      return;
    }
    
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const newAppointment = {
      id: Date.now(),
      patientName: `${user.firstName} ${user.lastName}`,
      patientEmail: user.email,
      doctorId: selectedDoctor.id,
      doctorName: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
      date: bookingData.date,
      time: bookingData.time,
      symptoms: bookingData.symptoms,
      type: bookingData.type,
      status: 'Scheduled',
      paymentStatus: 'Pending',
      fee: selectedDoctor.consultationFee,
      createdAt: new Date().toISOString()
    };
    
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      message: `Appointment booked with Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName} on ${bookingData.date} at ${bookingData.time}`,
      time: 'Just now',
      read: false,
      type: 'appointment'
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    toast.success('Appointment booked successfully!');
    setShowBookingModal(false);
    setBookingData({ date: '', time: '', symptoms: '', type: 'Consultation' });
    setSelectedDoctor(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} style={{ color: '#FFD700' }} />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" style={{ color: '#FFD700' }} />);
    while (stars.length < 5) stars.push(<FaRegStar key={stars.length} style={{ color: '#FFD700' }} />);
    return stars;
  };

  const styles = {
    container: { padding: '24px', background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#666' },
    backLink: { color: '#4A90E2', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' },
    filterBar: { background: 'white', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '12px' },
    searchInput: { border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '14px' },
    filterGroup: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
    filterSelect: { padding: '10px 16px', borderRadius: '25px', border: '1px solid #ddd', background: 'white', fontSize: '13px', cursor: 'pointer' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
    statCard: { background: 'white', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    statIcon: { width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' },
    statNumber: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
    statLabel: { fontSize: '12px', color: '#666' },
    doctorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' },
    doctorCard: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', transition: 'transform 0.3s', cursor: 'pointer' },
    cardHeader: { background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '20px', color: 'white', position: 'relative' },
    doctorAvatar: { width: '70px', height: '70px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '32px', color: '#667eea' },
    doctorName: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' },
    doctorSpecialty: { fontSize: '13px', opacity: 0.9 },
    ratingContainer: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' },
    ratingStars: { display: 'flex', gap: '2px' },
    ratingValue: { fontSize: '13px', fontWeight: '500' },
    cardBody: { padding: '20px' },
    infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#666' },
    infoLabel: { display: 'flex', alignItems: 'center', gap: '6px' },
    infoValue: { fontWeight: '500', color: '#1a1a2e' },
    languages: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' },
    languageBadge: { background: '#e8f0fe', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', color: '#4A90E2' },
    fee: { fontSize: '18px', fontWeight: '700', color: '#28C76F', marginTop: '8px' },
    bookBtn: { width: '100%', padding: '12px', background: '#4A90E2', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '16px', transition: 'background 0.3s' },
    emptyState: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', color: '#999' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '24px', width: '90%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e' },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' },
    formGroup: { marginBottom: '18px' },
    formLabel: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '13px' },
    formInput: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px' },
    formSelect: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px', background: 'white' },
    formTextarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px', resize: 'vertical' },
    doctorInfoPreview: { background: '#f8f9fa', padding: '15px', borderRadius: '12px', marginBottom: '20px' },
    submitBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading doctors...</div>;
  }

  const totalDoctors = doctors.length;
  const avgExperience = Math.round(doctors.reduce((sum, d) => sum + d.experience, 0) / totalDoctors);
  const topRated = doctors.filter(d => d.rating >= 4.8).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/patient/dashboard" style={styles.backLink}><FaArrowLeft /> Back to Dashboard</Link>
        <h1 style={styles.title}>Find a Doctor</h1>
        <p style={styles.subtitle}>Browse our team of expert doctors and book an appointment</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#e8f0fe', color: '#4A90E2' }}><FaUserMd /></div>
          <div><div style={styles.statNumber}>{totalDoctors}</div><div style={styles.statLabel}>Expert Doctors</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#e6f7f5', color: '#28C76F' }}><FaAward /></div>
          <div><div style={styles.statNumber}>{avgExperience}+</div><div style={styles.statLabel}>Avg Experience (yrs)</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#fff3e6', color: '#FF9F43' }}><FaStar /></div>
          <div><div style={styles.statNumber}>{topRated}</div><div style={styles.statLabel}>Top Rated Doctors</div></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <FaSearch style={{ color: '#999' }} />
          <input type="text" placeholder="Search by name or specialization..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.filterGroup}>
          <select style={styles.filterSelect} value={selectedSpecialization} onChange={(e) => setSelectedSpecialization(e.target.value)}>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec === 'all' ? 'All Specializations' : spec}</option>
            ))}
          </select>
          <select style={styles.filterSelect} value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
            {experienceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div style={styles.doctorsGrid}>
        {filteredDoctors.length === 0 ? (
          <div style={styles.emptyState}>
            <FaUserMd style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <p>No doctors found matching your criteria</p>
          </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} style={styles.doctorCard} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={styles.cardHeader}>
                <div style={styles.doctorAvatar}>👨‍⚕️</div>
                <div style={styles.doctorName}>Dr. {doctor.firstName} {doctor.lastName}</div>
                <div style={styles.doctorSpecialty}>{doctor.specialization}</div>
                <div style={styles.ratingContainer}>
                  <div style={styles.ratingStars}>{renderStars(doctor.rating)}</div>
                  <span style={styles.ratingValue}>{doctor.rating}</span>
                </div>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}><FaHeartbeat /> Experience</span>
                  <span style={styles.infoValue}>{doctor.experience} years</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}><FaUserMd /> Patients Treated</span>
                  <span style={styles.infoValue}>{doctor.patients}+</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}><FaCalendarAlt /> Available</span>
                  <span style={styles.infoValue}>{doctor.availability}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Education</span>
                  <span style={styles.infoValue}>{doctor.education}</span>
                </div>
                {doctor.languages && (
                  <div style={styles.languages}>
                    {doctor.languages.map(lang => <span key={lang} style={styles.languageBadge}>{lang}</span>)}
                  </div>
                )}
                <div style={styles.fee}>₹{doctor.consultationFee} per consultation</div>
                <button style={styles.bookBtn} onClick={() => handleBookNow(doctor)}>Book Appointment →</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div style={styles.modalOverlay} onClick={() => setShowBookingModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Book Appointment</h3>
              <button style={styles.closeBtn} onClick={() => setShowBookingModal(false)}><FaTimes /></button>
            </div>
            <div style={styles.doctorInfoPreview}>
              <div><strong>Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</strong></div>
              <div>{selectedDoctor.specialization} • {selectedDoctor.experience} years exp</div>
              <div>Fee: ₹{selectedDoctor.consultationFee}</div>
            </div>
            <form onSubmit={handleConfirmBooking}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Date *</label>
                <input type="date" name="date" style={styles.formInput} value={bookingData.date} onChange={handleBookingChange} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Time *</label>
                <select name="time" style={styles.formSelect} value={bookingData.time} onChange={handleBookingChange} required>
                  <option value="">Select Time</option>
                  <option>09:00 AM</option><option>09:30 AM</option><option>10:00 AM</option>
                  <option>10:30 AM</option><option>11:00 AM</option><option>11:30 AM</option>
                  <option>02:00 PM</option><option>02:30 PM</option><option>03:00 PM</option>
                  <option>03:30 PM</option><option>04:00 PM</option><option>04:30 PM</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Appointment Type</label>
                <select name="type" style={styles.formSelect} value={bookingData.type} onChange={handleBookingChange}>
                  <option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Checkup</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Symptoms (Optional)</label>
                <textarea name="symptoms" style={styles.formTextarea} rows="3" value={bookingData.symptoms} onChange={handleBookingChange} placeholder="Describe your symptoms..."></textarea>
              </div>
              <button type="submit" style={styles.submitBtn}>Confirm Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDoctors;