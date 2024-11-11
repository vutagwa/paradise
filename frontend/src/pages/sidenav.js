import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaRecycle, FaMapMarkerAlt, FaStar, FaComments, FaHandsHelping, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../styles/userDash.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/home">
            <FaHome /> Home
          </Link>
        </li>
        <li>
          <Link to="/ewaste_submittion">
            <FaRecycle /> E-Waste Submission
          </Link>
        </li>
        <li>
          <Link to="/collection_points">
            <FaMapMarkerAlt /> Collection Points
          </Link>
        </li>
        <li>
          <Link to="/points_dashboard">
            <FaStar /> Points Dashboard
          </Link>
        </li>
        <li>
          <Link to="/feedback">
            <FaComments /> Feedback Form
          </Link>
        </li>
        <li>
          <Link to="/help_support">
            <FaHandsHelping /> Help & Support
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <FaCog /> Settings
          </Link>
        </li>
        <li>
          <Link to="/login">
            <FaSignOutAlt /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
