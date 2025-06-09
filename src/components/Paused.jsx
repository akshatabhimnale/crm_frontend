import React, { useState, useEffect } from 'react';
import { FaPause, FaTimes, FaExclamationTriangle, FaPlay } from 'react-icons/fa';
import './StatusComponents.css';

const Paused = ({ onClose, data = [] }) => {
  const [pausedCampaigns, setPausedCampaigns] = useState([]);

  useEffect(() => {
    // Filter campaigns with "Paused" status
    const paused = data.filter(campaign => 
      campaign.Status && campaign.Status.toLowerCase().includes('paused')
    );
    setPausedCampaigns(paused);
  }, [data]);

  const totalPaused = pausedCampaigns.length;
  const totalLeadsDelivered = pausedCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Lead Sent"]) || 0), 0
  );
  const totalLeadsBooked = pausedCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Leads Booked"]) || 0), 0
  );
  const totalShortfall = pausedCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Shortfall"]) || 0), 0
  );

  const getProgressPercentage = (campaign) => {
    const sent = parseInt(campaign["Lead Sent"]) || 0;
    const booked = parseInt(campaign["Leads Booked"]) || 0;
    return booked > 0 ? Math.min((sent / booked) * 100, 100) : 0;
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 'N/A';
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? `${daysDiff} days` : 'Overdue';
  };

  return (
    <div className="status-component-container">
      <div className="status-header">
        <div className="status-title">
          <FaPause className="status-icon paused-icon" />
          <h2>Paused Campaigns</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-status-btn">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="status-metrics">
        <div className="metric-card">
          <h3>{totalPaused}</h3>
          <p>Paused Campaigns</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsDelivered.toLocaleString()}</h3>
          <p>Leads Delivered</p>
        </div>
        <div className="metric-card">
          <h3>{totalShortfall.toLocaleString()}</h3>
          <p>Total Shortfall</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsBooked > 0 ? Math.round((totalLeadsDelivered / totalLeadsBooked) * 100) : 0}%</h3>
          <p>Progress Made</p>
        </div>
      </div>

      <div className="campaigns-list">
        <h3>Paused Campaigns</h3>
        {pausedCampaigns.length === 0 ? (
          <div className="empty-state">
            <FaPause className="empty-icon" />
            <p>No paused campaigns found</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {pausedCampaigns.map((campaign, index) => (
              <div key={index} className="campaign-card paused-card">
                <div className="campaign-header">
                  <h4>{campaign.ITL}</h4>
                  <span className="status-badge paused">Paused</span>
                </div>
                <div className="campaign-details">
                  <p><strong>Tactic:</strong> {campaign.Tactic}</p>
                  <p><strong>Duration:</strong> {campaign["Start Date"]} - {campaign.Deadline}</p>
                  <p><strong>Progress:</strong> {campaign["Lead Sent"]} / {campaign["Leads Booked"]}</p>
                  <p><strong>Shortfall:</strong> {campaign["Shortfall"]}</p>
                  <p><strong>Days Left:</strong> {getDaysRemaining(campaign.Deadline)}</p>
                </div>
                <div className="campaign-footer">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill paused" 
                      style={{ width: `${getProgressPercentage(campaign)}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(getProgressPercentage(campaign))}% Complete
                  </span>
                </div>
                <div className="campaign-actions">
                  <div className="pause-reason">
                    <FaExclamationTriangle className="warning-icon" />
                    <span>Needs attention</span>
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

export default Paused;