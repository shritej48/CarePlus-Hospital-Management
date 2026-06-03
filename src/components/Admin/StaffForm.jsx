import React, { useState, useEffect } from 'react';

const StaffForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    position: '',
    department: '',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        position: initialData.position || '',
        department: initialData.department || '',
        password: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
      <h3>{isEditing ? 'Edit Staff' : 'Add New Staff'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))', gap: '12px' }}>
          <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="phoneNumber" placeholder="Phone *" value={formData.phoneNumber} onChange={handleChange} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="position" placeholder="Position (e.g., Nurse, Receptionist) *" value={formData.position} onChange={handleChange} required style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input name="password" type="text" placeholder="Password (auto if empty)" value={formData.password} onChange={handleChange} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="submit" style={{ background: '#28C76F', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>{isEditing ? 'Update' : 'Add'}</button>
          <button type="button" onClick={onCancel} style={{ background: '#e9ecef', padding: '8px 20px', border: 'none', borderRadius: '40px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default StaffForm;