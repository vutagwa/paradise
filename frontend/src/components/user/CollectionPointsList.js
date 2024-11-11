import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import '../../styles/cpm.css';

const CollectionPointsList = () => {
  const [collectionPoints, setCollectionPoints] = useState([]);

  // Add dummy data to be shown initially
  useEffect(() => {
    // For testing, use mock data instead of fetching from Firebase
    const dummyData = [
      {
        id: '1',
        name: 'Collection Point 1',
        latitude: '1.2950',
        longitude: '36.8219',
        contactInfo: '+254711234567',
        acceptedEwaste: ['Laptop', 'Phone', 'Tablet'],
      },
      {
        id: '2',
        name: 'Collection Point 2',
        latitude: '1.2960',
        longitude: '36.8220',
        contactInfo: '+254701234567',
        acceptedEwaste: ['Fridge', 'Washing Machine'],
      },
      {
        id: '3',
        name: 'Collection Point 3',
        latitude: '1.2970',
        longitude: '36.8230',
        contactInfo: '+254721234567',
        acceptedEwaste: ['Phone', 'Tablet'],
      },
      {
        id: '4',
        name: 'Collection Point 4',
        latitude: '1.2980',
        longitude: '36.8240',
        contactInfo: '+254731234567',
        acceptedEwaste: ['Laptop', 'Fridge'],
      },
      {
        id: '5',
        name: 'Collection Point 5',
        latitude: '1.2990',
        longitude: '36.8250',
        contactInfo: '+254741234567',
        acceptedEwaste: ['Washing Machine', 'Tablet'],
      },
      {
        id: '6',
        name: 'Collection Point 6',
        latitude: '1.3000',
        longitude: '36.8260',
        contactInfo: '+254751234567',
        acceptedEwaste: ['Phone', 'Washing Machine'],
      },
      {
        id: '7',
        name: 'Collection Point 7',
        latitude: '1.3010',
        longitude: '36.8270',
        contactInfo: '+254761234567',
        acceptedEwaste: ['Fridge', 'Tablet'],
      },
      {
        id: '8',
        name: 'Collection Point 8',
        latitude: '1.3020',
        longitude: '36.8280',
        contactInfo: '+254771234567',
        acceptedEwaste: ['Laptop', 'Phone'],
      },
    ];
    
    setCollectionPoints(dummyData);

    // Optionally fetch data from Firebase (if desired in the future)
    // const unsubscribe = onSnapshot(collection(db, 'collectionPoints'), (snapshot) => {
    //   const points = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   setCollectionPoints(points);
    // });

    // Cleanup the subscription on unmount
    // return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <h2>Collection Points</h2>

      <div className="list-container">
        {collectionPoints.map((point) => (
          <div className="card" key={point.id}>
            <div className="card-header">
              <h4>{point.name}</h4> {/* Display collection point name */}
            </div>
            <div className="card-content">
              <p><span className="icon">📍</span>Latitude: {point.latitude}, Longitude: {point.longitude}</p>
              <p><span className="icon">📞</span>Contact Info: {point.contactInfo}</p>
              <p>
                <span className="icon">♻️</span>
                Accepted E-Waste: 
                {Array.isArray(point.acceptedEwaste) ? point.acceptedEwaste.join(', ') : 'No items listed'}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CollectionPointsList;
