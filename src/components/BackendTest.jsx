import React, { useState } from 'react';
import { Card, Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const BackendTest = () => {
    const [testing, setTesting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const testConnection = async () => {
        setTesting(true);
        setResult(null);
        setError(null);
        
        try {
            const response = await authAPI.test();
            setResult({
                status: '✅ Connected',
                data: response.data,
                message: 'Backend is running successfully!'
            });
            toast.success('Backend connected!');
        } catch (err) {
            setError({
                status: '❌ Disconnected',
                message: err.code === 'ERR_NETWORK' 
                    ? 'Cannot connect to backend. Make sure Spring Boot is running on port 8080'
                    : err.message,
            });
            toast.error('Backend connection failed');
        } finally {
            setTesting(false);
        }
    };

    const testRegister = async () => {
        setTesting(true);
        try {
            const testUser = {
                firstName: 'Test',
                lastName: 'User',
                email: `test${Date.now()}@backend.com`,
                password: '123456',
                phoneNumber: '9876543210',
                role: 'PATIENT'
            };
            
            const response = await authAPI.register(testUser);
            setResult({
                status: '✅ Registration Successful',
                data: response.data,
                message: `User ${testUser.email} saved to MySQL database!`
            });
            toast.success('Registration test passed! Check your MySQL database.');
        } catch (err) {
            setError({
                status: '❌ Registration Failed',
                message: err.response?.data?.message || err.message,
            });
            toast.error('Registration test failed');
        } finally {
            setTesting(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">🔌 Backend Connection Test</h2>
            
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex gap-3 mb-4 justify-content-center">
                                <Button 
                                    variant="primary" 
                                    onClick={testConnection}
                                    disabled={testing}
                                >
                                    {testing ? <Spinner size="sm" /> : 'Test Connection'}
                                </Button>
                                <Button 
                                    variant="success" 
                                    onClick={testRegister}
                                    disabled={testing}
                                >
                                    Test Register (Save to MySQL)
                                </Button>
                            </div>
                            
                            {result && (
                                <Alert variant="success" className="mt-3">
                                    <Alert.Heading>{result.status}</Alert.Heading>
                                    <p>{result.message}</p>
                                    <hr />
                                    <pre className="mb-0 small">
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                </Alert>
                            )}
                            
                            {error && (
                                <Alert variant="danger" className="mt-3">
                                    <Alert.Heading>{error.status}</Alert.Heading>
                                    <p>{error.message}</p>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BackendTest;