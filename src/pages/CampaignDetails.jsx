import React from 'react';
import './CampaignDetails.css';

const CampaignDetails = ({ campaign, onClose }) => {
  if (!campaign) return null;

  const delivered = Number(campaign["Lead Sent"]) || 0;
  const projection = Number(campaign["Projection"]) || Number(campaign["Leads Booked"]) || 0;
  const goalPercent = projection > 0 ? Math.min(Math.round((delivered / projection) * 100), 100) : 0;

  return (
    <div className="campaign-wrapper">
      <div className="campaign-top">
        <div className="campaign-meta">
          <h1 className="source-title">{campaign["Campaign Name"]}</h1>
          <p className="source-subtitle">{campaign["Tactic"]}</p>
          <div className="flight-info">
            <strong>Flight Dates:</strong> {campaign["Start Date"]} – {campaign["Deadline"]}
          </div>
        </div>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>

      <div className="campaign-status-section">
        <div className="lead-status-box">
          <h3>Lead Status</h3>
          <div className="status-bar">
            <div className="status accepted" style={{ width: `${goalPercent}%` }}></div>
            <div className="status rejected" style={{ width: `${100 - goalPercent}%` }}></div>
          </div>
          <p>
            <span className="dot green" /> Delivered: {delivered}&nbsp;&nbsp;
            <span className="dot red" /> Shortfall: {campaign["Shortfall"]}&nbsp;&nbsp;
            <span className="dot gray" /> Projection: {projection}
          </p>
        </div>

        <div className="goal-chart">
          <h4>Source Goal</h4>
          <div className="goal-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle"
                strokeDasharray={`${goalPercent}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{goalPercent}%</text>
            </svg>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#333' }}>
              {goalPercent}% 
            </div>
          </div>
        </div>
      </div>

      <div className="terms-section">
        <h3>Performance Metrics</h3>
        <ul className="terms-list">
          <li><strong>Leads Booked:</strong> {campaign["Leads Booked"]}</li>
          <li><strong>Leads Sent:</strong> {campaign["Lead Sent"]}</li>
          <li><strong>Shortfall:</strong> {campaign["Shortfall"]}</li>
          <li><strong>Delivery Days:</strong> {campaign["Delivery Days"]}</li>
          <li><strong>Pacing:</strong> {campaign["Pacing"]}</li>
          <li><strong>Status:</strong> {campaign["Status"]}</li>
        </ul>
      </div>

      <div className="terms-section">
        <h3>Operational Metrics</h3>
        <ul className="terms-list">
          <li><strong>Data Count:</strong> {campaign["Data count"] || "N/A"}</li>
          <li><strong>Ops Count:</strong> {campaign["Ops Count"]}</li>
          <li><strong>Quality Count:</strong> {campaign["Quality Count"]}</li>
          <li><strong>MIS Count:</strong> {campaign["MIS Count"]}</li>
          <li><strong>Campaign Assignees:</strong> {campaign["Campaign Assignees"]}</li>
        </ul>
      </div>

      <div className="terms-section">
        <h3>Insights</h3>
        <ul className="terms-list">
          <li><strong>Ops Insights:</strong> {campaign["Ops Insights"] || "N/A"}</li>
          <li><strong>Email Insights:</strong> {campaign["Email insights"] || "N/A"}</li>
          <li><strong>Delivery Insights:</strong> {campaign["Delivery insights"] || "N/A"}</li>
        </ul>
      </div>

      <div className="terms-section">
        <h3>Comments & Notes</h3>
        <ul className="terms-list">
          <li><strong>Date:</strong> {campaign["Date"]}</li>
          <li><strong>Data/Kapil Comments:</strong> {campaign["Data/Kapil Comments"] || "None"}</li>
          <li><strong>CID Notes:</strong> {campaign["CID - Notes"]}</li>
        </ul>
      </div>
    </div>
  );
};

export default CampaignDetails;
