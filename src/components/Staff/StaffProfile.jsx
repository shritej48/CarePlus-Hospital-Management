import React from 'react';
const StaffProfile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return <div style={{ padding: '20px' }}><h1>Staff Profile</h1><p>Name: {user.firstName} {user.lastName}</p><p>Email: {user.email}</p></div>;
};
export default StaffProfile;