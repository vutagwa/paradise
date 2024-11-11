import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/admin/adminDashboard';
import UserDashboard from './components/user/UserDashboard';
import EwasteSubmission from './components/user/ewaste_submittion';
import CollectorDashboard from './components/collector/collectorDashboard';
import CollectionPointsManagement from './components/collector/CollectionPointsManagement';
import CollectionPointsList from './components/user/CollectionPointsList';


const userRole = "admin"; 
const isAuthenticated = true; 

const App = () => {
  return (
   /*<div>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={isAuthenticated ? <Dashboard userRole={userRole} /> : <Navigate to="/login" />}>
          <Route path="" element={<RequestManagement />} />
          <Route path="analytics" element={userRole === "admin" ? <AnalyticsDashboard /> : <Navigate to="/dashboard" />} />
          <Route path="collection-points" element={userRole === "admin" ? <CollectionPointsManagement /> : <Navigate to="/dashboard" />} />
          <Route path="feedback" element={<FeedbackForm />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="points" element={<PointsDashboard />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>*/<EwasteSubmission/>
  );
};

export default App;
 