import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DoctorSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeSlots] = useState(['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']);

    return (
        <div className="premium-dashboard">
            <h1>My Schedule</h1>
            <div className="dashboard-two-column">
                <div className="chart-card">
                    <h3>Calendar</h3>
                    <Calendar onChange={setSelectedDate} value={selectedDate} />
                    <p>Selected: {selectedDate.toDateString()}</p>
                </div>
                <div className="chart-card">
                    <h3>Available Time Slots</h3>
                    <div className="stats-grid-premium">
                        {timeSlots.map((slot, index) => (
                            <div key={index} className="stat-card-premium">
                                <p>{slot}</p>
                                <button className="view-btn">Book</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedule;