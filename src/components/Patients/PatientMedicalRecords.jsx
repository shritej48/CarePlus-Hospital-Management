import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaPrescription, FaUserMd, FaCalendarAlt, FaPills, FaEye } from 'react-icons/fa';
import { prescriptionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PatientMedicalRecords = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'PATIENT') {
      navigate('/login');
      return;
    }

    // Get patientId – fallback to user.id if patientId not stored separately
    const patientId = localStorage.getItem('patientId') || user.id;
    if (!patientId) {
      toast.error('Patient profile not found');
      setLoading(false);
      return;
    }

    try {
      const response = await prescriptionAPI.getByPatient(patientId);
      const data = response.data?.data || response.data || [];
      setPrescriptions(data);
    } catch (err) {
      console.error('Failed to load prescriptions', err);
      toast.error('Could not load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    backLink: { display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#4A90E2', textDecoration: 'none', marginBottom: '16px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
    subtitle: { color: '#666', fontSize: '14px' },
    card: { background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: '24px' },
    prescriptionItem: { borderBottom: '1px solid #f0f0f0', padding: '16px 0', cursor: 'pointer' },
    prescriptionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
    medicineName: { fontWeight: '600', fontSize: '16px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '8px' },
    doctorName: { fontSize: '13px', color: '#666' },
    dosage: { background: '#e8f0fe', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#4A90E2' },
    detailsPanel: { marginTop: '12px', padding: '16px', background: '#f8f9fa', borderRadius: '12px' },
    detailRow: { display: 'flex', marginBottom: '8px', fontSize: '13px' },
    detailLabel: { width: '100px', fontWeight: '500', color: '#555' },
    detailValue: { flex: 1, color: '#333' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#999' },
    loadingState: { textAlign: 'center', padding: '50px' }
  };

  if (loading) {
    return <div style={styles.loadingState}>Loading medical records...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/patient/dashboard" style={styles.backLink}>
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1 style={styles.title}>Medical Records</h1>
        <p style={styles.subtitle}>Your prescriptions and medical history</p>
      </div>

      <div style={styles.card}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPrescription /> Prescriptions
        </h3>

        {prescriptions.length === 0 ? (
          <div style={styles.emptyState}>
            <FaPills size={48} color="#ccc" style={{ marginBottom: '12px' }} />
            <p>No prescriptions found</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>Prescriptions will appear here once issued by a doctor.</p>
          </div>
        ) : (
          prescriptions.map((pres) => (
            <div key={pres.id} style={styles.prescriptionItem} onClick={() => toggleDetails(pres.id)}>
              <div style={styles.prescriptionHeader}>
                <div>
                  <div style={styles.medicineName}>
                    <FaPills style={{ color: '#4A90E2' }} />
                    {pres.medicineName}
                  </div>
                  <div style={styles.doctorName}>
                    Dr. {pres.doctor?.firstName} {pres.doctor?.lastName} · {pres.dosage}
                  </div>
                </div>
                <div style={styles.dosage}>
                  <FaEye style={{ marginRight: '4px' }} /> {expandedId === pres.id ? 'Hide' : 'View Details'}
                </div>
              </div>

              {expandedId === pres.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={styles.detailsPanel}
                >
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Frequency:</div>
                    <div style={styles.detailValue}>{pres.frequency || '—'}</div>
                  </div>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Duration:</div>
                    <div style={styles.detailValue}>{pres.duration || '—'}</div>
                  </div>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Instructions:</div>
                    <div style={styles.detailValue}>{pres.instructions || '—'}</div>
                  </div>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Start Date:</div>
                    <div style={styles.detailValue}>{pres.startDate || '—'}</div>
                  </div>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>End Date:</div>
                    <div style={styles.detailValue}>{pres.endDate || '—'}</div>
                  </div>
                  <div style={styles.detailRow}>
                    <div style={styles.detailLabel}>Status:</div>
                    <div style={styles.detailValue}>
                      {pres.isActive ? (
                        <span style={{ color: '#28C76F' }}>Active</span>
                      ) : (
                        <span style={{ color: '#EA5455' }}>Expired</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;