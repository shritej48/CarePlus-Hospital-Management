import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phoneNumber: '', 
        specialization: '', qualification: '', experience: '', consultationFee: ''
    });

    useEffect(() => {
        setDoctors([
            { id: 1, firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@hospital.com', phoneNumber: '5551234567', specialization: 'Cardiologist', qualification: 'MD', experience: '12', consultationFee: '150' },
            { id: 2, firstName: 'Michael', lastName: 'Chen', email: 'michael@hospital.com', phoneNumber: '5551234568', specialization: 'Neurologist', qualification: 'MD, PhD', experience: '8', consultationFee: '120' },
        ]);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setDoctors([...doctors, { ...formData, id: doctors.length + 1 }]);
        toast.success('Doctor added successfully');
        setShowModal(false);
        setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', specialization: '', qualification: '', experience: '', consultationFee: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure?')) {
            setDoctors(doctors.filter(d => d.id !== id));
            toast.success('Doctor deleted successfully');
        }
    };

    return (
        <div className="dashboard-content">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Doctor Management</h1>
                <button onClick={() => setShowModal(true)} className="login-btn" style={{width: 'auto'}}>+ Add Doctor</button>
            </div>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Name</th><th>Specialization</th><th>Email</th><th>Phone</th><th>Fee</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.id}</td>
                                <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.phoneNumber}</td>
                                <td>₹{doctor.consultationFee}</td>
                                <td>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(doctor.id)}>Delete</button>
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
                            <h2>Add New Doctor</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input type="text" placeholder="First Name" className="form-control" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                                <input type="text" placeholder="Last Name" className="form-control" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                            </div>
                            <input type="email" placeholder="Email" className="form-control" style={{marginBottom: '10px', width: '100%'}} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                            <input type="text" placeholder="Phone Number" className="form-control" style={{marginBottom: '10px', width: '100%'}} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                            <input type="text" placeholder="Specialization" className="form-control" style={{marginBottom: '10px', width: '100%'}} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
                            <div className="form-row">
                                <input type="text" placeholder="Qualification" className="form-control" onChange={(e) => setFormData({...formData, qualification: e.target.value})} />
                                <input type="number" placeholder="Experience (years)" className="form-control" onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                            </div>
                            <input type="number" placeholder="Consultation Fee (₹)" className="form-control" style={{marginBottom: '10px', width: '100%'}} onChange={(e) => setFormData({...formData, consultationFee: e.target.value})} required />
                            <button type="submit" className="login-btn" style={{marginTop: '20px'}}>Add Doctor</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorList;