import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { db } from '../../services/firebase'; // Make sure to configure Firebase
import { doc, updateDoc, increment } from 'firebase/firestore';
import { storage } from '../../services/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import '../../styles/subm.css'; // Make sure to include your styles

const EwasteSubmission = ({ userId }) => {
  const [image, setImage] = useState(null);  // For uploading image
  const [confirmationImage, setConfirmationImage] = useState(null);  // For confirmation image
  const [confirmationMessage, setConfirmationMessage] = useState('');  // For manual text input
  const [extractedMessage, setExtractedMessage] = useState(null);  // To store extracted message text
  const [isProcessing, setIsProcessing] = useState(false);  // To show OCR is processing
  const [ewasteType, setEwasteType] = useState(null);  // E-waste type after image identification
  const [disposalLocations, setDisposalLocations] = useState([]);  // Collection points for disposal
  const [userLocation, setUserLocation] = useState(null);  // For storing user geolocation
  const [points, setPoints] = useState(0); // User's points

  // Fetch the user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  // Fetch disposal locations based on e-waste type and proximity to user
  useEffect(() => {
    const fetchDisposalLocations = async () => {
      if (ewasteType && userLocation) {
        const collectionRef = collection(db, 'collectionPoints');
        const snapshot = await getDocs(collectionRef);
        const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter locations based on e-waste type and proximity
        const sortedLocations = locations
          .filter(location => location.acceptedEwaste.includes(ewasteType)) // Filter by e-waste type
          .map(location => {
            const distance = calculateDistance(
              userLocation.lat, userLocation.lon, 
              parseFloat(location.latitude), parseFloat(location.longitude)
            );
            return { ...location, distance };
          })
          .sort((a, b) => a.distance - b.distance); // Sort by distance

        setDisposalLocations(sortedLocations); // Set sorted locations
      }
    };

    if (ewasteType && userLocation) {
      fetchDisposalLocations();
    }
  }, [ewasteType, userLocation]);

  // Haversine formula to calculate the distance between two lat/lon points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle uploading the image and identifying the e-waste type
  const handleUpload = async () => {
    if (!image) return;

    try {
      const imageRef = ref(storage, `ewaste/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Call the AI/ML service to identify the e-waste type
      const identifiedEwasteType = await identifyEwaste(imageUrl);
      setEwasteType(identifiedEwasteType[0]);  // Assuming the AI returns an array of e-waste types
    } catch (error) {
      console.error('Error during image upload or identification:', error);
      alert('An error occurred while identifying the e-waste type.');
    }
  };

  // Use Tesseract.js to extract text from image
  const extractTextFromImage = (imageFile) => {
    setIsProcessing(true);
    Tesseract.recognize(
      imageFile,
      'eng', // Language for OCR
      {
        logger: (m) => console.log(m), // Optional: Show progress
      }
    ).then(({ data: { text } }) => {
      setExtractedMessage(text);
      setIsProcessing(false);
    }).catch((err) => {
      console.error("OCR extraction failed:", err);
      alert("Failed to extract text from image.");
      setIsProcessing(false);
    });
  };

  // Handle confirming the disposal and awarding points
  const handleConfirmDisposal = async () => {
    let confirmationText = confirmationMessage;

    // If there's an image, use the extracted message
    if (confirmationImage) {
      if (!extractedMessage) {
        await extractTextFromImage(confirmationImage);  // Extract text from image if not already done
        confirmationText = extractedMessage;  // Use extracted message
      }
    }

    // Extract key information (date, time, place, collector)
    const keyInfo = extractKeyInfo(confirmationText);

    if (keyInfo.date && keyInfo.time && keyInfo.location && keyInfo.collector) {
      // Validation successful, award points
      const userRef = doc(db, 'userPoints', userId);
      await updateDoc(userRef, {
        points: increment(1),
      });

      setPoints((prevPoints) => prevPoints + 1);
      alert("Disposal confirmed! You've earned a point.");
    } else {
      alert("Invalid confirmation message. Please ensure it includes key information.");
    }

    setConfirmationMessage('');
  };

  // Extract key information from extracted message (date, time, location, collector)
  const extractKeyInfo = (text) => {
    const regex = {
      date: /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/,  // Date regex
      time: /\b(?:[01]?[0-9]|2[0-3]):[0-5][0-9]\b/,  // Time regex (HH:MM format)
      location: /(?:at\s|in\s)(\w+\s*\w*)/i, // Place location pattern
      collector: /\b(?:Collector|Agent):?\s*(\w+\s*\w*)/i  // Collector name pattern
    };

    const date = text.match(regex.date);
    const time = text.match(regex.time);
    const location = text.match(regex.location);
    const collector = text.match(regex.collector);

    return {
      date: date ? date[0] : null,
      time: time ? time[0] : null,
      location: location ? location[1] : null,
      collector: collector ? collector[1] : null,
    };
  };

  // Manually enter e-waste type
  const handleManualEntry = () => {
    setEwasteType(confirmationMessage); // Manually entered e-waste type
  };

  // Mock function for identifying e-waste type (replace with actual logic)
  const identifyEwaste = async (imageUrl) => {
    // Simulate a delay as if processing an image
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['electronics']); // Mock return of identified e-waste type
      }, 2000);
    });
  };

  return (
    <div className="ewaste-submission-container">
      <h1>E-Waste Submission</h1>

      {/* Step 1: Image Upload or Manual Entry */}
      <div className="step-container">
        <h2>Step 1: Upload Image or Enter E-Waste Type</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleUpload}>
          {isProcessing ? 'Processing Image...' : 'Upload Image'}
        </button>

        <div className="manual-entry">
          <input
            type="text"
            placeholder="Or manually enter e-waste type"
            value={confirmationMessage}
            onChange={(e) => setConfirmationMessage(e.target.value)}
          />
          <button onClick={handleManualEntry}>Confirm</button>
        </div>
      </div>

      {/* Step 2: Display Identified E-Waste Type */}
      {ewasteType && (
        <div className="identified-ewaste">
          <h2>Identified E-Waste Type: {ewasteType}</h2>
        </div>
      )}

      {/* Step 3: Confirmation and Points */}
      {ewasteType && (
        <div className="confirmation">
          <h2>Step 3: Confirm Disposal</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setConfirmationImage(e.target.files[0])}
          />
          <button onClick={handleConfirmDisposal}>Confirm Disposal</button>
        </div>
      )}

      {/* Display Collection Points */}
      {disposalLocations.length > 0 && (
        <div className="collection-points">
          <h2>Closest Collection Points</h2>
          <ul>
            {disposalLocations.map((point) => (
              <li key={point.id}>
                {point.location} - {point.distance.toFixed(2)} km away
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EwasteSubmission;
