import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMoneyBillWave, FaCreditCard, FaFileInvoice, FaDownload, 
  FaSearch, FaFilter, FaCalendarAlt, FaUserMd, FaRupeeSign,
  FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaPrint,
  FaQrcode, FaWallet, FaShieldAlt, FaReceipt, FaHistory,
  FaArrowLeft, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Helper for user‑specific storage keys (must match PatientDashboard)
const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;
const getCurrentUser = () => JSON.parse(localStorage.getItem('user') || '{}');

const PatientBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', expiry: '', cvv: '', upiId: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    loadBillingData(userData.id);
  }, []);

  const loadBillingData = (userId) => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const appointmentsKey = getStorageKey('appointments', userId);
    const appointments = JSON.parse(localStorage.getItem(appointmentsKey) || '[]');
    
    const invoiceList = appointments.map(apt => ({
      id: apt.id,
      invoiceNumber: `INV-${apt.id}`,
      doctorName: apt.doctorName,
      doctorSpecialty: apt.type || 'Consultation',
      date: apt.date,
      amount: Number(apt.fee) || 500,
      status: apt.paymentStatus === 'Paid' ? 'Paid' : (apt.status === 'Cancelled' ? 'Cancelled' : 'Pending'),
      paymentMethod: apt.paymentMethod || null,
      paymentDate: apt.paymentDate || null,
      appointmentId: apt.id
    }));
    
    invoiceList.sort((a, b) => new Date(b.date) - new Date(a.date));
    setInvoices(invoiceList);
    setFilteredInvoices(invoiceList);
    setLoading(false);
  };

  useEffect(() => {
    let filtered = invoices;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredInvoices(filtered);
  }, [filterStatus, searchTerm, invoices]);

  const totalPending = invoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPaid = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalInvoices = invoices.length;

  // Generate beautifully styled HTML invoice
  const generateStyledInvoiceHTML = (invoice) => {
    const statusColor = invoice.status === 'Paid' ? '#28C76F' : (invoice.status === 'Pending' ? '#FF9F43' : '#EA5455');
    const statusText = invoice.status === 'Paid' ? '✓ PAID' : (invoice.status === 'Pending' ? '⏳ PENDING' : '✗ CANCELLED');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CarePlus Invoice - ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .invoice-container {
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      background: white;
      border-radius: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
    }
    .invoice-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 40px 30px;
      color: white;
      text-align: center;
    }
    .hospital-name {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .hospital-tagline {
      font-size: 14px;
      opacity: 0.9;
    }
    .invoice-title {
      background: rgba(255,255,255,0.2);
      display: inline-block;
      padding: 6px 20px;
      border-radius: 40px;
      font-size: 14px;
      font-weight: 500;
      margin-top: 20px;
    }
    .invoice-body {
      padding: 40px;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 40px;
      font-weight: 700;
      font-size: 14px;
      background: ${statusColor}15;
      color: ${statusColor};
      border: 1px solid ${statusColor}30;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e9ecef;
    }
    .info-label {
      font-weight: 600;
      color: #495057;
      font-size: 14px;
    }
    .info-value {
      color: #1a1a2e;
      font-weight: 500;
    }
    .amount-box {
      background: #f8f9fa;
      border-radius: 24px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .amount-label {
      font-size: 14px;
      color: #6c757d;
      letter-spacing: 1px;
    }
    .amount-value {
      font-size: 48px;
      font-weight: 800;
      color: #EA5455;
      margin-top: 8px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    .items-table th {
      text-align: left;
      padding: 12px 0;
      border-bottom: 2px solid #e9ecef;
      color: #6c757d;
      font-weight: 600;
      font-size: 13px;
    }
    .items-table td {
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
      color: #1a1a2e;
    }
    .total-row {
      background: #f8f9fa;
      font-weight: 700;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
      font-size: 12px;
      color: #6c757d;
    }
    .print-btn {
      background: #4A90E2;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 40px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 20px;
      width: 100%;
      font-size: 14px;
    }
    .print-btn:hover { background: #357abd; }
    @media print {
      body { background: white; padding: 0; }
      .print-btn { display: none; }
      .invoice-container { box-shadow: none; }
    }
  </style>
</head>
<body>
<div class="invoice-container">
  <div class="invoice-header">
    <div class="hospital-name">🏥 CAREPLUS HOSPITAL</div>
    <div class="hospital-tagline">Excellence in Healthcare</div>
    <div class="invoice-title">TAX INVOICE</div>
  </div>
  <div class="invoice-body">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
      <div>
        <div style="font-size: 12px; color: #6c757d;">INVOICE NUMBER</div>
        <div style="font-weight: 700; font-size: 18px;">${invoice.invoiceNumber}</div>
      </div>
      <div class="status-badge">${statusText}</div>
    </div>

    <div class="info-row">
      <span class="info-label">Date of Issue</span>
      <span class="info-value">${invoice.date}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Patient Name</span>
      <span class="info-value">${user.firstName || ''} ${user.lastName || ''}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Doctor</span>
      <span class="info-value">${invoice.doctorName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Specialty</span>
      <span class="info-value">${invoice.doctorSpecialty}</span>
    </div>

    <table class="items-table">
      <thead>
        <tr><th>Description</th><th>Qty</th><th>Amount (₹)</th></tr>
      </thead>
      <tbody>
        <tr><td>Consultation Fee - ${invoice.doctorSpecialty}</td><td>1</td><td>${invoice.amount}</td></tr>
        <tr class="total-row"><td colspan="2" style="font-weight: 700;">Total</td><td style="font-weight: 700;">₹${invoice.amount}</td></tr>
      </tbody>
    </table>

    <div class="amount-box">
      <div class="amount-label">TOTAL AMOUNT</div>
      <div class="amount-value">₹${invoice.amount}</div>
    </div>

    <div class="footer">
      <p>Thank you for choosing CarePlus Hospital</p>
      <p style="margin-top: 8px;">This is a computer generated invoice • No signature required</p>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
</div>
</body>
</html>`;
  };

  const handleDownloadInvoice = (invoice) => {
    const htmlContent = generateStyledInvoiceHTML(invoice);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded (HTML) – open in browser to print');
  };

  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentStep(1);
    setPaymentMethod('card');
    setPaymentDetails({ cardNumber: '', expiry: '', cvv: '', upiId: '' });
    setShowPaymentModal(true);
  };

  const nextStep = () => {
    if (paymentStep === 1 && !paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    if (paymentStep === 2) {
      if (paymentMethod === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
          toast.error('Please fill all card details');
          return;
        }
        if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
          toast.error('Invalid card number');
          return;
        }
      } else if (paymentMethod === 'upi') {
        if (!paymentDetails.upiId || !paymentDetails.upiId.includes('@')) {
          toast.error('Enter a valid UPI ID (example@bank)');
          return;
        }
      }
    }
    setPaymentStep(prev => prev + 1);
  };

  const prevStep = () => setPaymentStep(prev => prev - 1);

  const processPayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!selectedInvoice || !user.id) {
      setProcessing(false);
      return;
    }
    
    const appointmentsKey = getStorageKey('appointments', user.id);
    const appointments = JSON.parse(localStorage.getItem(appointmentsKey) || '[]');
    
    const updatedAppointments = appointments.map(apt => 
      apt.id === selectedInvoice.appointmentId 
        ? { 
            ...apt, 
            paymentStatus: 'Paid', 
            paymentMethod: paymentMethod,
            paymentDate: new Date().toISOString(),
            status: apt.status === 'Scheduled' ? 'Completed' : apt.status
          } 
        : apt
    );
    localStorage.setItem(appointmentsKey, JSON.stringify(updatedAppointments));
    
    const updatedInvoices = invoices.map(inv =>
      inv.id === selectedInvoice.id
        ? { ...inv, status: 'Paid', paymentMethod: paymentMethod, paymentDate: new Date().toISOString() }
        : inv
    );
    setInvoices(updatedInvoices);
    
    const notifKey = getStorageKey('notifications', user.id);
    const notifications = JSON.parse(localStorage.getItem(notifKey) || '[]');
    notifications.unshift({
      id: Date.now(),
      message: `Payment of ₹${selectedInvoice.amount} for ${selectedInvoice.doctorName} was successful.`,
      time: 'Just now',
      read: false,
      type: 'payment',
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(notifKey, JSON.stringify(notifications));
    
    toast.success(`Payment of ₹${selectedInvoice.amount} completed successfully!`);
    setProcessing(false);
    setShowPaymentModal(false);
    setSelectedInvoice(null);
    setPaymentStep(1);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return { bg: '#d1fae5', color: '#065f46', icon: <FaCheckCircle />, text: 'Paid' };
      case 'Pending': return { bg: '#fed7aa', color: '#92400e', icon: <FaClock />, text: 'Pending' };
      case 'Cancelled': return { bg: '#fee2e2', color: '#991b1b', icon: <FaTimesCircle />, text: 'Cancelled' };
      default: return { bg: '#e9ecef', color: '#495057', icon: <FaClock />, text: status };
    }
  };

  const styles = {
    container: { padding: '24px', background: '#f0f2f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' },
    subtitle: { fontSize: '14px', color: '#666' },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' },
    statCard: { background: 'white', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    statIcon: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
    statNumber: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
    statLabel: { fontSize: '13px', color: '#666' },
    filterBar: { background: 'white', borderRadius: '20px', padding: '16px 20px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '12px' },
    searchInput: { border: 'none', background: 'transparent', flex: 1, outline: 'none' },
    filterGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    filterBtn: { padding: '8px 20px', borderRadius: '25px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s' },
    activeFilter: { background: '#4A90E2', color: 'white', borderColor: '#4A90E2' },
    tableContainer: { background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px', background: '#f8f9fa', color: '#495057', fontWeight: '600', fontSize: '13px' },
    td: { padding: '16px', borderBottom: '1px solid #e9ecef', verticalAlign: 'middle' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    actionBtn: { background: 'none', border: 'none', cursor: 'pointer', margin: '0 4px', padding: '6px', borderRadius: '8px', transition: 'all 0.3s', fontSize: '14px' },
    viewBtn: { color: '#4A90E2' },
    payBtn: { background: '#28C76F', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', border: 'none', cursor: 'pointer' },
    emptyState: { textAlign: 'center', padding: '60px', color: '#999' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '24px', width: '90%', maxWidth: '500px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '20px', fontWeight: '700' },
    stepIndicator: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' },
    stepDot: { width: '32px', height: '32px', borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: '#6c757d' },
    activeStepDot: { background: '#4A90E2', color: 'white' },
    paymentMethodGroup: { display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
    methodBtn: { flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '12px', background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s' },
    activeMethod: { borderColor: '#4A90E2', background: '#e8f0fe', color: '#4A90E2' },
    inputGroup: { marginBottom: '16px' },
    inputLabel: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#495057' },
    inputField: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '14px' },
    modalButtons: { display: 'flex', gap: '12px', marginTop: '20px' },
    modalBtn: { flex: 1, padding: '12px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' },
    backBtn: { background: '#e9ecef', color: '#495057' },
    nextBtn: { background: '#4A90E2', color: 'white' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading billing data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Billing & Payments</h1>
        <p style={styles.subtitle}>View and pay your medical bills online</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#e8f0fe', color: '#4A90E2' }}><FaFileInvoice /></div>
          <div><div style={styles.statNumber}>{totalInvoices}</div><div style={styles.statLabel}>Total Invoices</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#fee8e8', color: '#EA5455' }}><FaMoneyBillWave /></div>
          <div><div style={styles.statNumber}>₹{totalPending}</div><div style={styles.statLabel}>Pending Amount</div></div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: '#e6f7f5', color: '#28C76F' }}><FaCheckCircle /></div>
          <div><div style={styles.statNumber}>₹{totalPaid}</div><div style={styles.statLabel}>Total Paid</div></div>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <FaSearch style={{ color: '#999' }} />
          <input type="text" placeholder="Search by doctor or invoice..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div style={styles.filterGroup}>
          <button style={{ ...styles.filterBtn, ...(filterStatus === 'all' ? styles.activeFilter : {}) }} onClick={() => setFilterStatus('all')}>All</button>
          <button style={{ ...styles.filterBtn, ...(filterStatus === 'pending' ? styles.activeFilter : {}) }} onClick={() => setFilterStatus('pending')}>Pending</button>
          <button style={{ ...styles.filterBtn, ...(filterStatus === 'paid' ? styles.activeFilter : {}) }} onClick={() => setFilterStatus('paid')}>Paid</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr><th style={styles.th}>Invoice #</th><th style={styles.th}>Doctor</th><th style={styles.th}>Date</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>No invoices found</td>
                </tr>
              ) : (
                filteredInvoices.map(inv => {
                  const status = getStatusBadge(inv.status);
                  return (
                    <tr key={inv.id}>
                      <td style={styles.td}>{inv.invoiceNumber}</td>
                      <td style={styles.td}>
                        <div><strong>{inv.doctorName}</strong></div>
                        <div style={{ fontSize: '11px', color: '#999' }}>{inv.doctorSpecialty}</div>
                      </td>
                      <td style={styles.td}>{inv.date}</td>
                      <td style={styles.td}>₹{inv.amount}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                          {status.icon} {status.text}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={{ ...styles.actionBtn, ...styles.viewBtn }} onClick={() => handleDownloadInvoice(inv)} title="Download Invoice"><FaDownload /></button>
                        {inv.status === 'Pending' && (
                          <button style={styles.payBtn} onClick={() => handlePayment(inv)}>Pay Now</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-step Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div style={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Complete Payment</h3>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }} onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>

            <div style={styles.stepIndicator}>
              <div style={{ ...styles.stepDot, ...(paymentStep >= 1 ? styles.activeStepDot : {}) }}>1</div>
              <div style={{ ...styles.stepDot, ...(paymentStep >= 2 ? styles.activeStepDot : {}) }}>2</div>
              <div style={{ ...styles.stepDot, ...(paymentStep >= 3 ? styles.activeStepDot : {}) }}>3</div>
            </div>

            {paymentStep === 1 && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Invoice:</span><strong>{selectedInvoice.invoiceNumber}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Amount:</span><strong style={{ color: '#EA5455', fontSize: '18px' }}>₹{selectedInvoice.amount}</strong>
                  </div>
                </div>
                <div style={styles.paymentMethodGroup}>
                  <button style={{ ...styles.methodBtn, ...(paymentMethod === 'card' ? styles.activeMethod : {}) }} onClick={() => setPaymentMethod('card')}><FaCreditCard /> Card</button>
                  <button style={{ ...styles.methodBtn, ...(paymentMethod === 'upi' ? styles.activeMethod : {}) }} onClick={() => setPaymentMethod('upi')}><FaQrcode /> UPI</button>
                  <button style={{ ...styles.methodBtn, ...(paymentMethod === 'wallet' ? styles.activeMethod : {}) }} onClick={() => setPaymentMethod('wallet')}><FaWallet /> Wallet</button>
                </div>
                <div style={styles.modalButtons}>
                  <button style={{ ...styles.modalBtn, ...styles.backBtn }} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                  <button style={{ ...styles.modalBtn, ...styles.nextBtn }} onClick={nextStep}>Next <FaArrowRight /></button>
                </div>
              </>
            )}

            {paymentStep === 2 && (
              <>
                <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '12px' }}>
                  <div>Paying <strong>₹{selectedInvoice.amount}</strong> via {paymentMethod.toUpperCase()}</div>
                </div>
                {paymentMethod === 'card' && (
                  <>
                    <div style={styles.inputGroup}><label style={styles.inputLabel}>Card Number</label><input type="text" style={styles.inputField} placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} /></div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}><label style={styles.inputLabel}>Expiry (MM/YY)</label><input type="text" style={styles.inputField} placeholder="MM/YY" value={paymentDetails.expiry} onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})} /></div>
                      <div style={{ flex: 1 }}><label style={styles.inputLabel}>CVV</label><input type="password" style={styles.inputField} placeholder="123" value={paymentDetails.cvv} onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})} /></div>
                    </div>
                  </>
                )}
                {paymentMethod === 'upi' && (
                  <div style={styles.inputGroup}><label style={styles.inputLabel}>UPI ID</label><input type="text" style={styles.inputField} placeholder="username@bank" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} /></div>
                )}
                {paymentMethod === 'wallet' && (
                  <div style={styles.inputGroup}><label style={styles.inputLabel}>Wallet Number</label><input type="text" style={styles.inputField} placeholder="Enter mobile number" /></div>
                )}
                <div style={styles.modalButtons}>
                  <button style={{ ...styles.modalBtn, ...styles.backBtn }} onClick={prevStep}><FaArrowLeft /> Back</button>
                  <button style={{ ...styles.modalBtn, ...styles.nextBtn }} onClick={nextStep}>Next <FaArrowRight /></button>
                </div>
              </>
            )}

            {paymentStep === 3 && (
              <>
                <div style={{ background: '#e8f0fe', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}><FaShieldAlt size={40} color="#4A90E2" /></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>Invoice:</span><strong>{selectedInvoice.invoiceNumber}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>Doctor:</span><strong>{selectedInvoice.doctorName}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}><span>Payment Method:</span><strong>{paymentMethod.toUpperCase()}</strong></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', borderTop: '1px solid #ccc', paddingTop: '12px' }}><span>Total Amount:</span><span style={{ color: '#EA5455' }}>₹{selectedInvoice.amount}</span></div>
                </div>
                <div style={styles.modalButtons}>
                  <button style={{ ...styles.modalBtn, ...styles.backBtn }} onClick={prevStep} disabled={processing}><FaArrowLeft /> Back</button>
                  <button style={{ ...styles.modalBtn, ...styles.nextBtn, background: 'linear-gradient(135deg, #667eea, #764ba2)' }} onClick={processPayment} disabled={processing}>
                    {processing ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : `Confirm & Pay ₹${selectedInvoice.amount}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientBilling;