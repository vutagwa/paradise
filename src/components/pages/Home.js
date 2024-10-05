import React from 'react';
import ContactLinks from '../ContactLinks';
import EWasteIdentification from '../EWasteIdentification';

const Home = () => {
  return (
    <div>
      <h2>Welcome to Paradise</h2>
      <p>Discover innovative solutions for e-waste management in Nairobi.</p>
      <EWasteIdentification />
      <ContactLinks />
    </div>
  );
};

export default Home;
