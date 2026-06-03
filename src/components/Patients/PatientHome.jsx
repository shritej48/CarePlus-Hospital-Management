import React from 'react';
import { Link } from 'react-router-dom';

const PatientHome = () => {
    return (
        <div>
            <nav style={{background: 'white', padding: '15px 30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'fixed', width: '100%', top: 0, zIndex: 1000}}>
                <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2 style={{color: '#667eea'}}>🏥 CarePlus Hospital</h2>
                    <div style={{display: 'flex', gap: '30px'}}>
                        <a href="#home" style={{textDecoration: 'none', color: '#333'}}>Home</a>
                        <a href="#doctors" style={{textDecoration: 'none', color: '#333'}}>Doctors</a>
                        <a href="#services" style={{textDecoration: 'none', color: '#333'}}>Services</a>
                    </div>
                    <div>
                        <Link to="/login" style={{padding: '8px 20px', border: '1px solid #667eea', borderRadius: '5px', textDecoration: 'none', color: '#667eea', marginRight: '10px'}}>Login</Link>
                        <Link to="/register" style={{padding: '8px 20px', background: '#667eea', borderRadius: '5px', textDecoration: 'none', color: 'white'}}>Register</Link>
                    </div>
                </div>
            </nav>

            <section style={{padding: '100px 0 60px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center'}}>
                <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>
                    <h1 style={{fontSize: '48px', marginBottom: '20px'}}>Your Health, <span style={{color: '#ffd700'}}>Our Priority</span></h1>
                    <p style={{fontSize: '18px', marginBottom: '30px'}}>Providing quality healthcare services with compassion and excellence.</p>
                    <Link to="/register" style={{padding: '12px 30px', background: '#ffd700', color: '#333', borderRadius: '5px', textDecoration: 'none', display: 'inline-block'}}>Book Appointment</Link>
                </div>
            </section>

            <footer style={{background: '#1f2937', color: 'white', padding: '30px 0', textAlign: 'center'}}>
                <p>&copy; 2024 CarePlus Hospital. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PatientHome;