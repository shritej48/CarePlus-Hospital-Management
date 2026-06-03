import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phoneNumber: '', 
        dateOfBirth: '', gender: '', bloodGroup: '', address: ''
    });

    useEffect(() => {
        setPatients([
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@email.com', phoneNumber: '9876543210', bloodGroup: 'O+', gender: 'Male' },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@email.com', phoneNumber: '9876543211', bloodGroup: 'A+', gender: 'Female' },
        ]);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPatient) {
            setPatients(patients.map(p => p.id === editingPatient.id ? { ...formData, id: p.id } : p));
            toast.success('Patient updated successfully');
        } else {
            setPatients([...patients, { ...formData, id: patients.length + 1 }]);
            toast.success('Patient added successfully');
        }
        setShowModal(false);
        setEditingPatient(null);
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', dateOfBirth: '', gender: '', bloodGroup: '', address: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setPatients(patients.filter(p => p.id !== id));
            toast.success('Patient deleted successfully');
        }
    };

    return (
        <div className="dashboard-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Patient Management</h1>
                <button onClick={() => setShowModal(true)} className="login-btn" style={{width: 'auto'}}>+ Add Patient</button>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Blood Group</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.id}>
                                <td>{patient.id}</td>
                                <td>{patient.firstName} {patient.lastName}</td>
                                <td>{patient.email}</td>
                                <td>{patient.phoneNumber}</td>
                                <td>{patient.bloodGroup}</td>
                                <td>
                                    <button className="action-btn edit-btn" onClick={() => {
                                        setEditingPatient(patient);
                                        setFormData(patient);
                                        setShowModal(true);
                                    }}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(patient.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
                            <button className="close-btn" onClick={() => { setShowModal(false); setEditingPatient(null); }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input type="text" placeholder="First Name" className="form-control" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <input type="text" placeholder="Last Name" className="form-control" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                            </div>
                            <input type="email" placeholder="Email" className="form-control" style={{marginBottom: '10px', width: '100%'}} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            <input type="text" placeholder="Phone Number" className="form-control" style={{marginBottom: '10px', width: '100%'}} value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                            <div className="form-row">
                                <input type="date" placeholder="Date of Birth" className="form-control" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
                                <select className="form-control" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <input type="text" placeholder="Blood Group" className="form-control" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} />
                                <input type="text" placeholder="Address" className="form-control" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                            </div>
                            <button type="submit" className="login-btn" style={{marginTop: '20px'}}>{editingPatient ? 'Update' : 'Create'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientList;