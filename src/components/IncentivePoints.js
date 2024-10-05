import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from './firebase'; 

const incentives = {
  "Household E-Waste": {
    "IT and Telecommunications Equipment": 250,
    "Large Household Appliances": 250,
    "Small Household Appliances": 50,
  },
  "Commercial E-Waste": {
    "Office Equipment": 250,
    "Industrial Equipment": 300,
  },
  "Electronic Components": {
    "Batteries": 30,
    "Circuit Boards": 310,
  },
  "Other E-Waste": {
    "Medical Equipment": 500,
    "Automotive Electronics": 550,
    "Consumer Electronics": 30,
  },
};

const IncentiveSubmission = ({ userId }) => {
  const [userVerified, setUserVerified] = useState(false);
  const [category, setCategory] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [storedPasskey, setStoredPasskey] = useState(''); // State for storing the passkey

  // Firestore reference
  const db = getFirestore();

  useEffect(() => {
    const fetchUserPasskey = async () => {
      const user = auth.currentUser; // Get the current user
      if (!user) {
        console.error("No user is logged in.");
        return; // Exit if there is no user
      }

      const userId = user.uid; // Get user ID
      const docRef = doc(db, "users", userId); // Reference the document
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStoredPasskey(docSnap.data().passkey); // Store the passkey in state
      } else {
        console.error("No such document!");
      }
    };

    fetchUserPasskey();
  }, [db]);

  const onDrop = (acceptedFiles) => {
    setReceipt(acceptedFiles[0]);
  };
  
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  
  const handleVerifyAccount = () => {
    if (passkey === storedPasskey) {
      setUserVerified(true);
      setMessage('Successful verification!');
      setPasskeyError('');
    } else {
      setPasskeyError('Invalid passkey. Please try again.');
    }
    setPasskey('');
    setDialogVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userVerified) {
      setMessage('Please verify your account to submit.');
      return;
    }

    if (!category || !receipt) {
      setMessage('Please select a category and upload your receipt.');
      return;
    }

    const points = getPoints(category);
    const isValidReceipt = await validateReceipt(receipt);

    if (isValidReceipt) {
      addPointsToAccount(points);
      logTransaction(`Earned ${points} points for disposing of ${category}.`);
      setMessage(`Success! You've earned ${points} points.`);
    } else {
      setMessage('Invalid receipt. Please check and try again.');
    }
  };

  const getPoints = (category) => {
    for (const key in incentives) {
      if (incentives[key][category] !== undefined) {
        return incentives[key][category];
      }
    }
    return 0;
  };

  const validateReceipt = async (receipt) => {
    return true; // Simulating a successful validation
  };

  const addPointsToAccount = (points) => {
    setTotalPoints(prevPoints => prevPoints + points);
  };

  const logTransaction = (message) => {
    const newTransaction = {
      id: transactionHistory.length + 1,
      message,
      date: new Date().toLocaleString(),
    };
    setTransactionHistory([...transactionHistory, newTransaction]);
  };

  const handleRedeemPoints = () => {
    if (totalPoints >= 200) {
      setDialogVisible(true);
    } else {
      setMessage('Not enough points to redeem. You need at least 200 points.');
    }
  };

  const confirmRedeem = (method) => {
    if (totalPoints > 0) {
      const redeemedPoints = totalPoints;
      setTotalPoints(0);
      logTransaction(`Redeemed ${redeemedPoints} points to ${method}.`);
      setMessage(`Successfully redeemed ${redeemedPoints} points to ${method}.`);
    } else {
      setMessage('No points to redeem.');
    }
    setDialogVisible(false);
  };

  return (
    <div className="container">
      <div className="points">Total Points: {totalPoints}</div>
      <h2>Submit E-Waste Disposal for Incentives</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Verify Account:
            <button type="button" onClick={() => setDialogVisible(true)}>Enter Passkey</button>
          </label>
        </div>
        <div>
          <label>
            Select Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select</option>
              {Object.keys(incentives).map((key) => (
                Object.keys(incentives[key]).map((subKey) => (
                  <option key={subKey} value={subKey}>{subKey}</option>
                ))
              ))}
            </select>
          </label>
        </div>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop your receipt here, or click to select files</p>
          <p>{receipt ? `Selected file: ${receipt.name}` : 'No file selected'}</p>
        </div>
        <button type="submit">Submit</button> 
        <button type="button" onClick={handleRedeemPoints} style={{ marginLeft: '10px' }}>Redeem Points</button>
      </form>
      {message && <p className="message">{message}</p>}
      {passkeyError && <p className="error">{passkeyError}</p>}
      
      {/* Transaction History Section */}
      <h3>Transaction History</h3>
      <ul>
        {transactionHistory.map(transaction => ( 
          <li key={transaction.id}>
            {transaction.date}: {transaction.message}
          </li>
        ))}
      </ul>

      {/* Redeem Method Dialog */}
      {dialogVisible && (
        <div className="dialog">
          <h3>Enter Your Passkey</h3>
          <input 
            type="text" 
            value={passkey} 
            onChange={(e) => setPasskey(e.target.value)} 
            placeholder="Passkey" 
          />
          <button onClick={handleVerifyAccount}>Verify</button>
          <button onClick={() => setDialogVisible(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default IncentiveSubmission;
