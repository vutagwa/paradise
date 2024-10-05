import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Define the incentive structure
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

const IncentiveSubmission = () => {
  const [userVerified, setUserVerified] = useState(false);
  const [category, setCategory] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]); // State for transaction history
  const [dialogVisible, setDialogVisible] = useState(false); // State for dialog visibility
  const [redeemMethod, setRedeemMethod] = useState(''); // State for redeem method

    // Dropzone configuration
 const onDrop = (acceptedFiles) => {
    setReceipt(acceptedFiles[0]); // Set the first accepted file
    };
    
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
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
    return 0; // Default to 0 if category is not found
  };

  const validateReceipt = async (receipt) => {
    return true; // Simulating a successful validation
  };

  const addPointsToAccount = (points) => {
    setTotalPoints(prevPoints => prevPoints + points);
    console.log(`Added ${points} points to user's account.`);
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
      setDialogVisible(true); // Show the dialog if points are sufficient
    } else {
      setMessage('Not enough points to redeem. You need at least 200 points.');
    }
  };

  const confirmRedeem = (method) => {
    if (totalPoints > 0) {
      const redeemedPoints = totalPoints; // Redeem all points
      setTotalPoints(0); // Reset points
      logTransaction(`Redeemed ${redeemedPoints} points to ${method}.`);
      setMessage(`Successfully redeemed ${redeemedPoints} points to ${method}.`);
    } else {
      setMessage('No points to redeem.');
    }
    setDialogVisible(false); // Hide the dialog
  };

  return (
    <div className="container">
      <div className="points">Total Points: {totalPoints}</div>
      <h2>Submit E-Waste Disposal for Incentives</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Verify Account:
            <input
              type="checkbox"
              checked={userVerified}
              onChange={() => setUserVerified(!userVerified)}
            />
          </label>
        </div>
        <div>
          <label>
            Select Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select</option>
              {/* Your existing category options */}
            </select>
          </label>
        </div>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop your receipt here, or click to select files (from your computer, Google Drive, Dropbox, etc.)</p>
          <p>{receipt ? `Selected file: ${receipt.name}` : 'No file selected'}</p>
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleRedeemPoints} style={{ marginLeft: '10px' }}>Redeem Points</button>
      </form>
      {message && <p className="message">{message}</p>}
      
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
          <h3>Select Redeem Method</h3>
          <button onClick={() => confirmRedeem('M-Pesa')}>M-Pesa</button>
          <button onClick={() => confirmRedeem('Bank Account')}>Bank Account</button>
          <button onClick={() => setDialogVisible(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default IncentiveSubmission;
