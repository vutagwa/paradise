import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the E-Waste Management System</h1>
      <p>
        Our system helps you easily identify, locate, and responsibly dispose of your e-waste, earning points for each successful disposal.
      </p>

      <div className="usage-steps">
        <h2>How to Use the System:</h2>

        <div className="step">
          <h3>Step 1: Upload an Image or Enter E-Waste Type</h3>
          <p>
            You can start by uploading a clear image of the e-waste item. The system uses advanced AI to recognize the type of e-waste from the image and suggest the nearest disposal locations.
            Alternatively, if you know the e-waste type, enter it manually.
          </p>
          <Link to="/ewaste_submittion" className="start-link">Go to E-Waste Submission</Link>
        </div>

        <div className="step">
          <h3>Step 2: View Identified E-Waste Type and Disposal Locations</h3>
          <p>
            After uploading, the system will display the identified e-waste type along with a list of nearby collection points that accept this type. The list is sorted by proximity, making it easy to find the closest option.
          </p>
        </div>

        <div className="step">
          <h3>Step 3: Confirm Disposal and Earn Points</h3>
          <p>
            Once you've delivered the e-waste to the collection point, confirm the disposal by entering a confirmation message. Each confirmed disposal awards you points as an incentive for responsible e-waste management.
          </p>
        </div>

        <div className="step">
          <h3>Track Your Points</h3>
          <p>
            Earn points for each successful disposal. These points reflect your commitment to a greener future and can be viewed in your profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
