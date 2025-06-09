import React, { useState, useEffect } from 'react';
import { FaStop, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './StatusComponents.css';

const NotLive = ({ onClose, data = [] }) => {
  const [notLiveCampaigns, setNotLiveCampaigns] = useState([]);

  useEffect(() => {
    // Filter campaigns with "Not Live" status
    const notLive = data.filter(campaign => 
      campaign.Status && campaign.Status.toLowerCase().includes('not live')
    );
    setNotLiveCampaigns(notLive);
  }, [data]);

  const totalNotLive = notLiveCampaigns.length;
  const totalLeadsBooked = notLiveCampaigns.reduce((sum, campaign) => 
    sum + (parseInt(campaign["Leads Booked"]) || 0), 0
  );
  const upcomingCampaigns = notLiveCampaigns.filter(campaign => {
    const startDate = new Date(campaign["Start Date"]);
    const today = new Date();
    return startDate > today;
  }).length;
  const pendingCampaigns = totalNotLive - upcomingCampaigns;

  const getDaysUntilStart = (startDate) => {
    if (!startDate) return 'N/A';
    const start = new Date(startDate);
    const today = new Date();
    const timeDiff = start.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff > 0) return `${daysDiff} days`;
    if (daysDiff === 0) return 'Today';
    return 'Past due';
  };

  const getCampaignType = (campaign) => {
    const startDate = new Date(campaign["Start Date"]);
    const today = new Date();
    
    if (startDate > today) return 'upcoming';
    return 'pending';
  };

  return (
    <div className="status-component-container">
      <div className="status-header">
        <div className="status-title">
          <FaStop className="status-icon not-live-icon" />
          <h2>Not Live Campaigns</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="close-status-btn">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="status-metrics">
        <div className="metric-card">
          <h3>{totalNotLive}</h3>
          <p>Total Not Live</p>
        </div>
        <div className="metric-card">
          <h3>{upcomingCampaigns}</h3>
          <p>Upcoming</p>
        </div>
        <div className="metric-card">
          <h3>{pendingCampaigns}</h3>
          <p>Pending Setup</p>
        </div>
        <div className="metric-card">
          <h3>{totalLeadsBooked.toLocaleString()}</h3>
          <p>Total Booked</p>
        </div>
      </div>

      <div className="campaigns-list">
        <h3>Not Live Campaigns</h3>
        {notLiveCampaigns.length === 0 ? (
          <div className="empty-state">
            <FaStop className="empty-icon" />
            <p>No campaigns found in not live status</p>
          </div>
        ) : (
          <div className="campaigns-grid">
            {notLiveCampaigns.map((campaign, index) => {
              const campaignType = getCampaignType(campaign);
              return (
                <div key={index} className={`campaign-card not-live-card ${campaignType}`}>
                  <div className="campaign-header">
                    <h4>{campaign.ITL}</h4>
                    <span className="status-badge not-live">Not Live</span>
                  </div>
                  <div className="campaign-details">
                    <p><strong>Tactic:</strong> {campaign.Tactic}</p>
                    <p><strong>Start Date:</strong> {campaign["Start Date"]}</p>
                    <p><strong>End Date:</strong> {campaign.Deadline}</p>
                    <p><strong>Leads Booked:</strong> {campaign["Leads Booked"]}</p>
                    <p><strong>Delivery Days:</strong> {campaign["Delivery Days"]}</p>
                  </div>
                  <div className="campaign-footer">
                    <div className="timeline-info">
                      {campaignType === 'upcoming' ? (
                        <div className="upcoming-info">
                          <FaCalendarAlt className="info-icon" />
                          <span>Starts in {getDaysUntilStart(campaign["Start Date"])}</span>
                        </div>
                      ) : (
                        <div className="pending-info">
                          <FaClock className="info-icon" />
                          <span>Pending setup</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="campaign-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill not-live" 
                        style={{ width: '0%' }}
                      ></div>
                    </div>
                    <span className="progress-text">Not Started</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotLive;