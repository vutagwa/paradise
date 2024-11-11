import React, { useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import CollectionPointsManagement from '../collector/CollectionPointsManagement';
import RequestManagement from '../collector/RequestManagement';
import UserProfile from '../UserProfile';
import '../../styles/Dashboard.css'; // Admin Dashboard CSS file

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Tab navigation */}
      <div className="tabs">
        <button onClick={() => handleTabChange('analytics')} className={activeTab === 'analytics' ? 'active' : ''}>
          Analytics
        </button>
        <button onClick={() => handleTabChange('collectionPoints')} className={activeTab === 'collectionPoints' ? 'active' : ''}>
          Collection Points Management
        </button>
        <button onClick={() => handleTabChange('requests')} className={activeTab === 'requests' ? 'active' : ''}>
          Request Management
        </button>
        <button onClick={() => handleTabChange('userProfile')} className={activeTab === 'userProfile' ? 'active' : ''}>
          User Profile
        </button>
      </div>

      {/* Render the selected tab component */}
      <div className="tab-content">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'collectionPoints' && <CollectionPointsManagement />}
        {activeTab === 'requests' && <RequestManagement />}
        {activeTab === 'userProfile' && <UserProfile />}
      </div>
    </div>
  );
};

export default AdminDashboard;
