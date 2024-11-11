import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/collectorDash.css'; // Assuming your CSS is in the correct folder

const Header = () => {
  return (
    <div className="header">
      <input type="text" placeholder="Search for E-waste..." className="search-bar" />
      <div className="header-items">
        <span className="notification-bell">🔔</span>
        <Link to="/profile">
          <img src="path/to/profile-picture.jpg" alt="Profile" className="profile-picture" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
