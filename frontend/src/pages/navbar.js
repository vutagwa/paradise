import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidenav.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">Paradise</div>
      <input type="text" placeholder="Search..." className="search-bar" />
      <div className="nav-items">
        <span className="notification-bell">🔔</span>
        <Link to="/profile">
          <img src="path/to/profile-picture.jpg" alt="Profile" className="profile-picture" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
