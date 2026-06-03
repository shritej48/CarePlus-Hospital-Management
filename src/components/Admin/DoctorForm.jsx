import React, { useState, useEffect } from 'react';

const DoctorForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    password: '',               // ✅ password field
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        specialization: initialData.specialization || '',
        qualification: initialData.qualification || '',
        experience: initialData.experience || '',
        consultationFee: initialData.consultationFee || '',
        password: '',            // never pre-fill password when editing
        status: initialData.status || 'Active'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const styles = {
    container: {
      background: '#f8f9fa',
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    input: {
      padding: '10px 14px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box'
    },
    button: {
      padding: '10px 24px',
      borderRadius: '40px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    saveBtn: { background: '#28C76F', color: 'white' },
    cancelBtn: { background: '#e9ecef', color: '#495057' }
  };

  return (
    <div style={styles.container}>
      <h3 style={{ marginTop: 0, marginBottom: '16px' }}>
        {isEditing ? '✏️ Edit Doctor' : '➕ Add New Doctor'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.grid}>
          <input type="text" name="firstName" placeholder="First Name *" required value={formData.firstName} onChange={handleChange} style={styles.input} />
          <input type="text" name="lastName" placeholder="Last Name *" required value={formData.lastName} onChange={handleChange} style={styles.input} />
          <input type="email" name="email" placeholder="Email * (Login ID)" required value={formData.email} onChange={handleChange} style={styles.input} />
          <input type="tel" name="phoneNumber" placeholder="Phone Number *" required value={formData.phoneNumber} onChange={handleChange} style={styles.input} />
          <input type="text" name="specialization" placeholder="Specialization *" required value={formData.specialization} onChange={handleChange} style={styles.input} />
          <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} style={styles.input} />
          <input type="number" name="experience" placeholder="Experience (years)" value={formData.experience} onChange={handleChange} style={styles.input} />
          <input type="number" name="consultationFee" placeholder="Consultation Fee (₹)" value={formData.consultationFee} onChange={handleChange} style={styles.input} />
          {/* ✅ Password field - visible */}
          <input type="text" name="password" placeholder="Password (leave empty to auto-generate)" value={formData.password} onChange={handleChange} style={styles.input} />
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ ...styles.button, ...styles.saveBtn }}>
            {isEditing ? 'Update Doctor' : 'Add Doctor'}
          </button>
          <button type="button" onClick={onCancel} style={{ ...styles.button, ...styles.cancelBtn }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;