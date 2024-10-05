// src/Login.js
import React, { useState } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passKey, setPassKey] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userDoc.exists()) {
        // User found, now verify passkey
        const storedPassKey = userDoc.data().passKey;
        if (passKey === storedPassKey) {
          setIsVerified(true);
          alert("Verification successful!");
        } else {
          alert("Incorrect passkey. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={passKey} onChange={(e) => setPassKey(e.target.value)} placeholder="Enter your passkey" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
