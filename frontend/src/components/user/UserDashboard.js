import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from '../../pages/sidenav';
import Header from '../../pages/header';
import Home from './home';
import EwasteSubmission from './ewaste_submittion';
import CollectionPointsList from './CollectionPointsList';
import PointsDashboard from './PointsDashboard';
import FeedbackForm from './FeedbackForm';
import HelpSupport from './HelpSupport';
// import SettingsPage from './components/SettingsPage';
import Login from '../Login';
import '../../styles/userDash.css';

const UserDashboard = () => {
  return (
    <div>
      <div className="content-area">
      <Header />
      <div className="user-dashboard">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} /> {/* Redirect to Home */}
            <Route path="/home" element={<Home />} />
            <Route path="/ewaste_submittion" element={<EwasteSubmission />} />
            <Route path="/collection_points" element={<CollectionPointsList />} />
            <Route path="/points_dashboard" element={<PointsDashboard />} />
            <Route path="/feedback_form" element={<FeedbackForm />} />
            <Route path="/help_support" element={<HelpSupport />} />
            <Route path="/logout" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserDashboard;
