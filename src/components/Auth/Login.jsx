import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const STATIC_ADMIN = {
        email: 'admin@careplus.com',
        password: 'admin123'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Static admin fallback
        if (formData.email === STATIC_ADMIN.email && formData.password === STATIC_ADMIN.password) {
            const adminUser = {
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                email: STATIC_ADMIN.email,
                role: 'ADMIN',
                phoneNumber: '9999999999'
            };
            localStorage.setItem('user', JSON.stringify(adminUser));
            localStorage.removeItem('patientId'); // admin has no patientId
            if (rememberMe) localStorage.setItem('rememberedEmail', formData.email);
            toast.success('Welcome Admin!');
            window.location.href = '/admin/dashboard';
            setLoading(false);
            return;
        }

        // Backend API login
        try {
            const response = await authAPI.login({
                email: formData.email,
                password: formData.password
            });
            if (response.data.success) {
                const responseData = response.data.data;
                const userData = responseData.user;
                const patientId = responseData.patientId;

                localStorage.setItem('user', JSON.stringify(userData));
                if (patientId) {
                    localStorage.setItem('patientId', patientId.toString());
                } else {
                    localStorage.removeItem('patientId');
                }
                if (rememberMe) localStorage.setItem('rememberedEmail', formData.email);
                toast.success(`Welcome ${userData.firstName}!`);

                // Redirect based on role
                if (userData.role === 'PATIENT') window.location.href = '/patient/dashboard';
                else if (userData.role === 'DOCTOR') window.location.href = '/doctor/dashboard';
                else if (userData.role === 'ADMIN') window.location.href = '/admin/dashboard';
                else window.location.href = '/dashboard';
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                toast.error('Cannot connect to backend. Please make sure Spring Boot is running on port 8080');
            } else {
                toast.error('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Animation variants (unchanged)
    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };
    const inputGroupVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        hover: { scale: 1.01 }
    };
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop';

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
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
                background: 'linear-gradient(135deg, rgba(0,0,0,0.55), rgba(0,0,0,0.3))',
                zIndex: 0
            }} />
            <motion.div
                style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            fontSize: `${Math.random() * 50 + 40}px`,
                            opacity: 0.08,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            color: 'white'
                        }}
                        animate={{
                            y: [0, -60, 0],
                            x: [0, 30, 0],
                            rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        {['🏥', '💊', '🩺', '❤️', '🧬', '🔬', '⚕️', '🩻'][i % 8]}
                    </motion.div>
                ))}
            </motion.div>

            <Container style={{ position: 'relative', zIndex: 1 }}>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                            <Card className="border-0 rounded-4 shadow-lg overflow-hidden" style={{
                                backdropFilter: 'blur(16px)',
                                background: 'rgba(255,255,255,0.92)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}>
                                <motion.div
                                    className="p-4 text-white text-center"
                                    style={{ background: 'linear-gradient(135deg, #1e3c72, #2a5298)' }}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="fw-bold mb-0">Welcome Back</h2>
                                    <p className="opacity-75 mt-2">Sign in to your account</p>
                                </motion.div>
                                <Card.Body className="p-5">
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Email Address</Form.Label>
                                            <motion.div
                                                className="input-group"
                                                variants={inputGroupVariants}
                                                whileHover="hover"
                                                whileFocus="focus"
                                            >
                                                <span className="input-group-text bg-light border-end-0"><FaEnvelope /></span>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    required
                                                    className="border-start-0"
                                                />
                                            </motion.div>
                                        </Form.Group>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Password</Form.Label>
                                            <motion.div
                                                className="input-group"
                                                variants={inputGroupVariants}
                                                whileHover="hover"
                                                whileFocus="focus"
                                            >
                                                <span className="input-group-text bg-light border-end-0"><FaLock /></span>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="••••••"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    required
                                                    className="border-start-0"
                                                />
                                            </motion.div>
                                        </Form.Group>
                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <Form.Check
                                                type="checkbox"
                                                label="Remember me"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                            />
                                            <Link to="/forgot-password" className="text-decoration-none small">Forgot password?</Link>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                type="submit"
                                                variant="success"
                                                className="w-100 py-2 rounded-pill fw-semibold"
                                                disabled={loading}
                                                style={{ background: 'linear-gradient(135deg, #28C76F, #20B2AA)', border: 'none' }}
                                            >
                                                {loading ? <><Spinner size="sm" className="me-2" /> Signing in...</> : 'Sign In  →'}
                                            </Button>
                                        </motion.div>
                                    </Form>
                                    <div className="text-center mt-4">
                                        <p className="text-muted">Don't have an account? <Link to="/register" className="text-decoration-none fw-medium">Create one</Link></p>
                                    </div>
                                    <motion.div
                                        className="text-center mt-3 small text-muted"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <FaShieldAlt className="me-1" /> Secure login powered by CarePlus
                                    </motion.div>
                                    <div className="text-center mt-3 small text-muted border-top pt-2">
                                        <strong>Admin demo:</strong> admin@careplus.com / admin123
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

export default Login;