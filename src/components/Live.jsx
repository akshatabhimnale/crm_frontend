import React, { useState, useEffect } from 'react';
import { FaPlay, FaTimes, FaClock, FaTargetry, FaChartLine } from 'react-icons/fa';
import './StatusComponents.css';

const Live = ({ onClose, data = [] }) => {
  const [liveCampaigns, setLiveCampaigns] = useState([]);

  useEffect(() => {
    // Filter campaigns with "Live" status
    const live = data.filter(campaign => 
      campaign.Status && campaign.Status.toLowerCase().includes('live')
    );
    setLiveCampaigns(live);
  }, [data]);

  const totalLive = liveCampaigns.length;
  const totalLeadsDelivered = liveCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Lead Sent"]) || 0), 0
  );
  const totalLeadsBooked = liveCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Leads Booked"]) || 0), 0
  );
  const avgPacing = liveCampaigns.length > 0 ? 
    liveCampaigns.reduce((sum, campaign) => 
      sum + (parseFloat(campaign.Pacing) || 0), 0
    ) / liveCampaigns.length : 0;

  const getProgressPercentage = (campaign) => {
    const sent = parseInt(campaign["Lead Sent"]) || 0;
    const booked = parseInt(campaign["Leads Booked"]) || 0;
    return booked > 0 ? Math.min((sent / booked) * 100, 100) : 0;
  };

  const getPacingStatus = (pacing) => {
    if (pacing > 1.1) return 'ahead';
    if (pacing < 0.9) return 'behind';
    return 'on-track';
  };

  return (
    <div className="status-component-container">
      <div className="status-header">
        <div className="status-title">
          <FaPlay className="status-icon live-icon" />
          <h2>Live Campaigns</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-status-btn">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="status-metrics">
        <div className="metric-card">
          <h3>{totalLive}</h3>
          <p>Active Campaigns</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsDelivered.toLocaleString()}</h3>
          <p>Leads Delivered</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsBooked.toLocaleString()}</h3>
          <p>Total Target</p>
        </div>
        <div className="metric-card">
          <h3>{avgPacing.toFixed(1)}x</h3>
          <p>Avg Pacing</p>
        </div>
      </div>

      <div className="campaigns-list">
        <h3>Active Campaigns</h3>
        {liveCampaigns.length === 0 ? (
          <div className="empty-state">
            <FaPlay className="empty-icon" />
            <p>No live campaigns found</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {liveCampaigns.map((campaign, index) => (
              <div key={index} className="campaign-card live-card">
                <div className="campaign-header">
                  <h4>{campaign.ITL}</h4>
                  <span className="status-badge live">Live</span>
                </div>
                <div className="campaign-details">
                  <p><strong>Tactic:</strong> {campaign.Tactic}</p>
                  <p><strong>Duration:</strong> {campaign["Start Date"]} - {campaign.Deadline}</p>
                  <p><strong>Progress:</strong> {campaign["Lead Sent"]} / {campaign["Leads Booked"]}</p>
                  <p><strong>Pacing:</strong> 
                    <span className={`pacing-${getPacingStatus(campaign.Pacing)}`}>
                      {campaign.Pacing}x
                    </span>
                  </p>
                  <p><strong>Delivery Days:</strong> {campaign["Delivery Days"]}</p>
                </div>
                <div className="campaign-footer">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill live" 
                      style={{ width: `${getProgressPercentage(campaign)}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {Math.round(getProgressPercentage(campaign))}% Complete
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;