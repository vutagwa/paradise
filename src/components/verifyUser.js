import React, { useState } from 'react';
import { auth } from './firebase';
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

const VerifyUser = () => {
  const [passkey, setPasskey] = useState('');
  const [message, setMessage] = useState('');
  const db = getFirestore();

  const handleVerify = async () => {
    const userId = auth.currentUser?.uid; // Get current user's ID
    if (!userId) {
      setMessage('No user logged in');
      return;
    }

    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.passkey === passkey) {
        setMessage('Verification successful!');
      } else {
        setMessage('Invalid passkey.');
      }
    } else {
      setMessage('User not found.');
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={passkey} 
        onChange={(e) => setPasskey(e.target.value)} 
        placeholder="Enter your passkey" 
        required 
      />
      <button onClick={handleVerify}>Verify</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyUser;
