import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaTags, FaChevronDown } from 'react-icons/fa';
import './Sidebar.css';
import logo from '../assets/Interlink-logo-01.png';


const Sidebar = () => {
  const [openCampaigns, setOpenCampaigns] = useState(false);
  const [openAudience, setOpenAudience] = useState(false);

  return (
    <div className="sidebar">
      <img src={logo} alt="Interlink Logo" className="logo" />

      <nav className='sidebar-nav'>
        <ul>
          <li><NavLink to="/" className="main-link"><FaChartBar /> Overview</NavLink></li>

        

          <li>
            <button className="main-link" onClick={() => setOpenCampaigns(!openCampaigns)}>
              <FaTags /> Campaigns <FaChevronDown className={`chevron ${openCampaigns ? 'rotate' : ''}`} />
            </button>
            {openCampaigns && (
              <ul className="sub-menu">
                <li><NavLink to="/campaigns/all">All Campaigns</NavLink></li>
                <li><NavLink to="/campaigns/search">Search</NavLink></li>
                <li><NavLink to="/campaigns/display">Display</NavLink></li>
              </ul>
            )}
          </li>          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
