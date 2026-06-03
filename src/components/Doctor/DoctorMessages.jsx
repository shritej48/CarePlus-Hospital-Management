import React, { useState } from 'react';

const DoctorMessages = () => {
    const [messages] = useState([
        { id: 1, from: 'John Doe', message: 'When is my next appointment?', time: '10:30 AM', unread: true },
        { id: 2, from: 'Jane Smith', message: 'I need a prescription refill', time: '09:15 AM', unread: false },
    ]);

    return (
        <div className="premium-dashboard">
            <h1>Messages</h1>
            <div className="stats-grid-premium">
                {messages.map(msg => (
                    <div key={msg.id} className={`stat-card-premium ${msg.unread ? 'unread' : ''}`}>
                        <h3>{msg.from}</h3>
                        <p>{msg.message}</p>
                        <small>{msg.time}</small>
                        <button className="view-btn">Reply</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DoctorMessages;