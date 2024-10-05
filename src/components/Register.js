import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import Dialog from './passkeyStore'; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [passkey, setPasskey] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const db = getFirestore();

  const generatePasskey = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const generatedPasskey = generatePasskey();

      await setDoc(doc(db, "users", userId), {
        email,
        passkey: generatedPasskey,
        firstName,
        lastName,
        username,
        location,
      });

      setPasskey(generatedPasskey);
      setIsDialogOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          placeholder="First Name" 
          required 
        />
        <input 
          type="text" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          placeholder="Last Name" 
          required 
        />
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Location" 
          required 
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>

      <Dialog 
        isOpen={isDialogOpen} 
        onClose={closeDialog} 
        passkey={passkey} 
      />
    </div>
  );
};

export default Register;
