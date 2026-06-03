import React, { useState } from 'react';
import toast from 'react-hot-toast';

const BillingList = () => {
    const [invoices, setInvoices] = useState([
        { id: 1, patientName: 'John Doe', amount: 150, date: '2024-04-10', status: 'Paid' },
        { id: 2, patientName: 'Jane Smith', amount: 200, date: '2024-04-12', status: 'Pending' },
    ]);

    const processPayment = (id) => {
        setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
        toast.success('Payment processed successfully');
    };

    return (
        <div className="dashboard-content">
            <h1>Billing Management</h1>
            
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Invoice ID</th><th>Patient Name</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.patientName}</td>
                                <td>₹{inv.amount}</td>
                                <td>{inv.date}</td>
                                <td><span style={{padding: '5px 10px', borderRadius: '5px', background: inv.status === 'Paid' ? '#d1fae5' : '#fed7aa'}}>{inv.status}</span></td>
                                <td>
                                    {inv.status === 'Pending' && (
                                        <button className="action-btn edit-btn" onClick={() => processPayment(inv.id)}>Pay Now</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingList;