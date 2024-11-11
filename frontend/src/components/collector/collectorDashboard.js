import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom'; // Import required components
import Header from '../../pages/cHeader';
import RequestManagement from './RequestManagement';
import CollectionPointsManagement from './CollectionPointsManagement';
import CollectorsAnalytics from './collectorsAnalytics';
import '../../styles/collectorDash.css'; // Make sure the path is correct

const CollectorDashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <div className="user-dashboard">
        <div className="sidebar">
          <ul>
            <li><Link to="/collector-dashboard/request-management">Request Management</Link></li>
            <li><Link to="/collector-dashboard/collection-points">Collection Points</Link></li>
            <li><Link to="/collector-dashboard/analytics">Collectors Analytics</Link></li>
          </ul>
        </div>
        <div className="main-content">
          <Routes>
            {/* Redirect to a default route */}
            <Route path="/" element={<Navigate to="/collector-dashboard/request-management" />} /> {/* Redirect to Request Management */}
            
            {/* Route for Request Management */}
            <Route path="/collector-dashboard/request-management" element={<RequestManagement />} />
            
            {/* Route for Collection Points Management */}
            <Route path="/collector-dashboard/collection-points" element={<CollectionPointsManagement />} />
            
            {/* Route for Collectors Analytics */}
            <Route path="/collector-dashboard/analytics" element={<CollectorsAnalytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;
