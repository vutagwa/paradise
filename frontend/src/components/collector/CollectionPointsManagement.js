import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../../styles/cpm.css';

// Define the valid region with relaxed latitude and longitude boundaries
const validRegion = {
  minLat: 1.0,  // Minimum Latitude (adjusted for broader region)
  maxLat: 1.6,  // Maximum Latitude (adjusted for broader region)
  minLon: 36.5, // Minimum Longitude (adjusted for broader region)
  maxLon: 37.2, // Maximum Longitude (adjusted for broader region)
};

const CollectionPointsManagement = () => {
  const [newPoint, setNewPoint] = useState({
    name: '',  // Added name field for collection point
    location: '',
    capacity: '',
    contactInfo: '',
    hoursOfOperation: '',
    latitude: '',
    longitude: '',
    ewasteCategory: '',
    acceptedEwaste: [],
    charges: {},
  });
  const [eWasteCategories, setEWasteCategories] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch e-waste categories
  useEffect(() => {
    const fetchCategories = async () => {
      // Simulate e-waste categories
      const categories = {
        electronics: ['Laptop', 'Phone', 'Tablet'],
        appliances: ['Fridge', 'Washing Machine'],
      };
      setEWasteCategories(categories);
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPoint({ ...newPoint, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setNewPoint({ ...newPoint, ewasteCategory: e.target.value });
  };

  const handleItemChange = (item, isChecked) => {
    if (isChecked) {
      setNewPoint({
        ...newPoint,
        acceptedEwaste: [...newPoint.acceptedEwaste, item],
      });
    } else {
      setNewPoint({
        ...newPoint,
        acceptedEwaste: newPoint.acceptedEwaste.filter((ewaste) => ewaste !== item),
      });
    }
  };

  const handleAmountChange = (item, value) => {
    setNewPoint({
      ...newPoint,
      charges: {
        ...newPoint.charges,
        [item]: value,
      },
    });
  };

  // Function to check if the coordinates are within the valid region
  const isValidLocation = (latitude, longitude) => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    // Check if latitude and longitude are within the valid region
    return (
      lat >= validRegion.minLat &&
      lat <= validRegion.maxLat &&
      lon >= validRegion.minLon &&
      lon <= validRegion.maxLon
    );
  };

  // Validate operational hours
  const isValidHours = (hours) => {
    const parsedHours = parseInt(hours, 10);
    return parsedHours >= 0 && parsedHours <= 24;
  };

  // Validate Kenyan phone number
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^(\+254)(7[0-9]{8})$/; // Format: +2547XXXXXXXX
    return phoneRegex.test(phone);
  };

  const handleAddCollectionPoint = async () => {
    // Validate latitude and longitude
    if (!isValidLocation(newPoint.latitude, newPoint.longitude)) {
      setError('Invalid location! Latitude and Longitude must be within the valid region.');
      return;
    }

    // Validate hours of operation
    if (!isValidHours(newPoint.hoursOfOperation)) {
      setError('Invalid hours of operation! Please enter a value between 0 and 24.');
      return;
    }

    // Validate phone number
    if (newPoint.contactInfo && !isValidPhoneNumber(newPoint.contactInfo)) {
      setError('Invalid contact number! Please enter a valid Kenyan phone number.');
      return;
    }

    try {
      // Add collection point to Firestore
      await addDoc(collection(db, 'collectionPoints'), {
        ...newPoint,
        createdAt: Timestamp.now(),
      });
      setSuccess('Collection Point Added Successfully!');
      setNewPoint({
        name: '',  // Reset name field after successful add
        location: '',
        capacity: '',
        contactInfo: '',
        hoursOfOperation: '',
        latitude: '',
        longitude: '',
        ewasteCategory: '',
        acceptedEwaste: [],
        charges: {},
      });
    } catch (error) {
      setError('Failed to add collection point!');
    }
  };

  return (
    <div className="container">
      <h2>Manage Collection Points</h2>
      {error && <p className="alert alert-error">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}

      {/* Collection Point Name Field */}
      <div className="form-group">
        <label htmlFor="name">Collection Point Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={newPoint.name}
          onChange={handleInputChange}
          placeholder="Enter Collection Point Name"
        />
      </div>

      {/* Location */}
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={newPoint.location}
          onChange={handleInputChange}
        />
      </div>

      {/* Capacity */}
      <div className="form-group">
        <label htmlFor="capacity">Capacity</label>
        <input
          type="text"
          id="capacity"
          name="capacity"
          value={newPoint.capacity}
          onChange={handleInputChange}
        />
      </div>

      {/* Contact Info */}
      <div className="form-group">
        <label htmlFor="contactInfo">Contact Info (Kenyan Phone Number)</label>
        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          value={newPoint.contactInfo}
          onChange={handleInputChange}
          placeholder="(+254XXXXXXXXX)"
        />
      </div>

      {/* Hours of Operation */}
      <div className="form-group">
        <label htmlFor="hoursOfOperation">Hours of Operation (0-24)</label>
        <input
          type="text"
          id="hoursOfOperation"
          name="hoursOfOperation"
          value={newPoint.hoursOfOperation}
          onChange={handleInputChange}
          placeholder="Enter operational hours (0-24)"
        />
      </div>

      {/* Latitude */}
      <div className="form-group">
        <label htmlFor="latitude">Latitude</label>
        <input
          type="text"
          id="latitude"
          name="latitude"
          value={newPoint.latitude}
          onChange={handleInputChange}
        />
      </div>

      {/* Longitude */}
      <div className="form-group">
        <label htmlFor="longitude">Longitude</label>
        <input
          type="text"
          id="longitude"
          name="longitude"
          value={newPoint.longitude}
          onChange={handleInputChange}
        />
      </div>

      {/* E-Waste Category Dropdown */}
      <div className="form-group">
        <label htmlFor="ewasteCategory">E-Waste Category</label>
        <select
          name="ewasteCategory"
          value={newPoint.ewasteCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select E-Waste Category</option>
          {Object.keys(eWasteCategories).map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Select Items */}
      {newPoint.ewasteCategory && (
        <div>
          <h4>Select Items:</h4>
          {eWasteCategories[newPoint.ewasteCategory].map((item) => (
            <div key={item}>
              <input
                type="checkbox"
                checked={newPoint.acceptedEwaste.includes(item)}
                onChange={(e) => handleItemChange(item, e.target.checked)}
              />
              <label>{item}</label>
              <input
                type="text"
                placeholder="Amount"
                value={newPoint.charges[item] || ''}
                onChange={(e) => handleAmountChange(item, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Collection Point Button */}
      <div className="form-group">
        <button onClick={handleAddCollectionPoint}>Add Collection Point</button>
      </div>
    </div>
  );
};

export default CollectionPointsManagement;
