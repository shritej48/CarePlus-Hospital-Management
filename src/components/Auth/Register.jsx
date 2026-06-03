// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaCalendar, FaVenusMars, FaShieldAlt } from 'react-icons/fa';
import { authAPI, patientAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState({});

    // Helper: Indian mobile number validation (10 digits, starts with 6/7/8/9)
    const isValidIndianMobile = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    };

    // Helper: maximum date for date picker (today)
    const getMaxDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        
        // Phone number validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!isValidIndianMobile(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Enter a valid 10-digit Indian mobile number (starts with 6,7,8,9)';
        }
        
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        // Date of birth validation (cannot be future)
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        } else {
            const dob = new Date(formData.dateOfBirth);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dob >= today) {
                newErrors.dateOfBirth = 'Date of birth cannot be a future date';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            // 1. Register user
            const registerData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: 'PATIENT'
            };
            const registerResponse = await authAPI.register(registerData);
            if (registerResponse.data.success) {
                const userData = registerResponse.data.data;
                
                // 2. Create patient profile
                try {
                    await patientAPI.createPatientProfile({
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phoneNumber: formData.phoneNumber,
                        gender: formData.gender,
                        dateOfBirth: formData.dateOfBirth,
                        userId: userData.id
                    });
                } catch (profileErr) {
                    console.warn('Patient profile creation failed, but user exists:', profileErr);
                    // Continue anyway – patient can be created later
                }
                
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(registerResponse.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to backend. Please make sure Spring Boot is running on port 8080');
            } else {
                toast.error('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Animation variants (same as before – keep your existing)
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };
    const inputGroupVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        hover: { scale: 1.01 }
    };
    const fieldVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 } })
    };
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop';

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{
            position: 'relative',
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.65), rgba(0,0,0,0.4))',
                zIndex: 0
            }} />
            <motion.div
                style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            fontSize: `${Math.random() * 60 + 30}px`,
                            opacity: 0.1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            color: 'white'
                        }}
                        animate={{
                            y: [0, -70, 0],
                            x: [0, 40, 0],
                            rotate: [0, 20, -20, 0],
                        }}
                        transition={{
                            duration: Math.random() * 25 + 15,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        {['🏥', '💊', '🩺', '❤️', '🧬', '🔬', '⚕️', '🩻', '🩺', '💉'][i % 10]}
                    </motion.div>
                ))}
            </motion.div>

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <Row className="justify-content-center">
                    <Col md={8} lg={7}>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <Card className="border-0 rounded-4 shadow-lg overflow-hidden" style={{
                                backdropFilter: 'blur(16px)',
                                background: 'rgba(255,255,255,0.92)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}>
                                <motion.div
                                    className="p-4 text-white text-center"
                                    style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="fw-bold mb-0">Create Patient Account</h2>
                                    <p className="opacity-75 mt-2">Join CarePlus Healthcare</p>
                                </motion.div>
                                <Card.Body className="p-5">
                                    <Form onSubmit={handleSubmit}>
                                        <Row className="g-3">
                                            {[
                                                { md: 6, name: 'firstName', label: 'First Name', icon: <FaUser />, type: 'text', placeholder: 'John' },
                                                { md: 6, name: 'lastName', label: 'Last Name', icon: <FaUser />, type: 'text', placeholder: 'Doe' },
                                                { md: 6, name: 'email', label: 'Email', icon: <FaEnvelope />, type: 'email', placeholder: 'patient@example.com' },
                                                { md: 6, name: 'phoneNumber', label: 'Phone', icon: <FaPhone />, type: 'tel', placeholder: '9876543210' },
                                                { md: 6, name: 'gender', label: 'Gender', icon: <FaVenusMars />, type: 'select', options: ['Male', 'Female', 'Other'] },
                                                { md: 6, name: 'dateOfBirth', label: 'Date of Birth', icon: <FaCalendar />, type: 'date' },
                                                { md: 6, name: 'password', label: 'Password', icon: <FaLock />, type: 'password', placeholder: '••••••' },
                                                { md: 6, name: 'confirmPassword', label: 'Confirm Password', icon: <FaLock />, type: 'password', placeholder: '••••••' },
                                            ].map((field, idx) => (
                                                <Col md={field.md} key={field.name}>
                                                    <motion.div custom={idx} variants={fieldVariants} initial="hidden" animate="visible">
                                                        <Form.Group>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <motion.div
                                                                className="input-group"
                                                                variants={inputGroupVariants}
                                                                whileHover="hover"
                                                                whileFocus="focus"
                                                            >
                                                                <span className="input-group-text bg-light border-end-0">{field.icon}</span>
                                                                {field.type === 'select' ? (
                                                                    <Form.Select
                                                                        value={formData[field.name]}
                                                                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                                                        className="border-start-0"
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                                                    </Form.Select>
                                                                ) : (
                                                                    <Form.Control
                                                                        type={field.type}
                                                                        placeholder={field.placeholder}
                                                                        value={formData[field.name]}
                                                                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                                                                        isInvalid={!!errors[field.name]}
                                                                        required={field.name !== 'gender' && field.name !== 'dateOfBirth'}
                                                                        className="border-start-0"
                                                                        // Prevent future date selection for dateOfBirth
                                                                        max={field.name === 'dateOfBirth' ? getMaxDate() : undefined}
                                                                    />
                                                                )}
                                                            </motion.div>
                                                            {errors[field.name] && (
                                                                <Form.Text className="text-danger">{errors[field.name]}</Form.Text>
                                                            )}
                                                        </Form.Group>
                                                    </motion.div>
                                                </Col>
                                            ))}
                                        </Row>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                variant="success"
                                                className="w-100 py-2 mt-4 rounded-pill fw-semibold"
                                                disabled={loading}
                                                style={{ background: 'linear-gradient(135deg, #28C76F, #20B2AA)', border: 'none' }}
                                            >
                                                {loading ? <><Spinner size="sm" className="me-2" /> Creating account...</> : 'Register as Patient  →'}
                                            </Button>
                                        </motion.div>
                                    </Form>
                                    <div className="text-center mt-4">
                                        <p className="text-muted">Already have an account? <Link to="/login" className="text-decoration-none fw-medium">Sign in here</Link></p>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;