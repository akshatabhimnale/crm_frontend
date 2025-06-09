import React from 'react';
import Sidebar from '../components/Sidebar';
import './DashboardLayout.css'; // optional styles

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
