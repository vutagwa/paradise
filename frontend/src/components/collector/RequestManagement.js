import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import '../../styles/RequestManagemen.css'; // Import your CSS file

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState('');
  const [eWasteType, setEWasteType] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  // Fetch e-waste requests from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requests'), (snapshot) => {
      const fetchedRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(fetchedRequests);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  // Handle status update
  const handleUpdateStatus = async (requestId) => {
    setError('');
    setSuccess('');

    if (!newStatus) {
      setError('Please select a new status.');
      return;
    }

    try {
      const requestRef = doc(db, 'requests', requestId);
      const requestDoc = await getDoc(requestRef);

      if (requestDoc.exists()) {
        const requestData = requestDoc.data();
        const updatedHistory = [
          ...(requestData.requestHistory || []),
          { status: newStatus, timestamp: new Date() },
        ];

        await updateDoc(requestRef, {
          status: newStatus,
          updatedAt: new Date(),
          requestHistory: updatedHistory,
          location: location,
          eWasteType: eWasteType,
          contactInfo: contactInfo,
        });

        setSuccess('Request status updated successfully!');
        setNewStatus('');
      } else {
        setError('Request does not exist.');
      }
    } catch (error) {
      setError('Error updating status: ' + error.message);
    }
  };

  // Handle new request submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const requestRef = collection(db, 'requests');
      const requestDoc = await addDoc(requestRef, {
        location: location,
        eWasteType: eWasteType,
        contactInfo: contactInfo,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        requestHistory: [],
      });

      console.log('Request created successfully!');
      setLocation('');
      setEWasteType('');
      setContactInfo('');
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  return (
    <div className="container">
      <h1>E-Waste Request Management</h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" />
            <select value={eWasteType} onChange={(event) => setEWasteType(event.target.value)}>
              <option value="">Select e-waste type</option>
              <option value="electronics">Electronics</option>
              <option value="batteries">Batteries</option>
            </select>
            <input type="text" value={contactInfo} onChange={(event) => setContactInfo(event.target.value)} placeholder="Contact information" />
            <button type="submit">Submit request</button>
          </form>

          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <h2>Request ID: {request.id}</h2>
              <div className="request-details">
                <p>User ID: {request.userId}</p>
                <p>Status: {request.status}</p>
                <p>Location: {request.location}</p>
                <p>Created At: {request.createdAt?.toDate().toLocaleString()}</p>
              </div>
              <button onClick={() => handleViewDetails(request)}>View Details</button>
            </div>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div className="request-card">
          <h2>Request Details</h2>
          <div className="request-details">
            <p>User ID: {selectedRequest.userId}</p>
            <p>Status: {selectedRequest.status}</p>
            <p>Location: {selectedRequest.location}</p>
            <p>Created At: {selectedRequest.createdAt?.toDate().toLocaleString()}</p>
            <h3>Request History:</h3>
            <ul>
              {selectedRequest.requestHistory?.map((history, index) => (
                <li key={index}>
                  {history.status} at {new Date(history.timestamp).toLocaleString()}
                </li>
              )) || <li>No history available</li>}
            </ul>
          </div>
          <select className="select-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="">Select New Status</option>
            <option value="accepted">Accepted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={() => handleUpdateStatus(selectedRequest.id)}>Update Status</button>
          <button onClick={() => setSelectedRequest(null)}>Close</button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default RequestManagement;