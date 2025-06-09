import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaCalendarAlt, FaTarget, FaArrowLeft } from 'react-icons/fa';
import './StatusComponents.css';

const Completed = ({ onClose, data = [] }) => {
  const [completedCampaigns, setCompletedCampaigns] = useState([]);

  useEffect(() => {
    // Filter campaigns with "Completed" status
    const completed = data.filter(campaign => 
      campaign.Status && campaign.Status.toLowerCase().includes('completed')
    );
    setCompletedCampaigns(completed);
  }, [data]);

  const totalCompleted = completedCampaigns.length;
  const totalLeadsDelivered = completedCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Lead Sent"]) || 0), 0
  );
  const totalLeadsBooked = completedCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Leads Booked"]) || 0), 0
  );
  const completionRate = totalLeadsBooked > 0 ? 
    Math.round((totalLeadsDelivered / totalLeadsBooked) * 100) : 0;

  return (
    <div className="status-component-container">
      <div className="status-header">
        <div className="status-title">
          <FaCheckCircle className="status-icon completed-icon" />
          <h2>Completed Campaigns</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-status-btn">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="status-metrics">
        <div className="metric-card">
          <h3>{totalCompleted}</h3>
          <p>Total Completed</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsDelivered.toLocaleString()}</h3>
          <p>Leads Delivered</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsBooked.toLocaleString()}</h3>
          <p>Leads Booked</p>
        </div>
        <div className="metric-card">
          <h3>{completionRate}%</h3>
          <p>Success Rate</p>
        </div>
      </div>

      <div className="campaigns-list">
        <h3>Completed Campaigns</h3>
        {completedCampaigns.length === 0 ? (
          <div className="empty-state">
            <FaCheckCircle className="empty-icon" />
            <p>No completed campaigns found</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {completedCampaigns.map((campaign, index) => (
              <div key={index} className="campaign-card completed-card">
                <div className="campaign-header">
                  <h4>{campaign.ITL}</h4>
                  <span className="status-badge completed">Completed</span>
                </div>
                <div className="campaign-details">
                  <p><strong>Tactic:</strong> {campaign.Tactic}</p>
                  <p><strong>Duration:</strong> {campaign["Start Date"]} - {campaign.Deadline}</p>
                  <p><strong>Leads Sent:</strong> {campaign["Lead Sent"]}</p>
                  <p><strong>Leads Booked:</strong> {campaign["Leads Booked"]}</p>
                  <p><strong>Success Rate:</strong> {
                    campaign["Leads Booked"] > 0 ? 
                    Math.round((campaign["Lead Sent"] / campaign["Leads Booked"]) * 100) : 0
                  }%</p>
                </div>
                <div className="campaign-footer">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill completed" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Completed;