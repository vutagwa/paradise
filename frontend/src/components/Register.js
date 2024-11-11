import React, { useState, useEffect } from 'react';
import { signUpWithEmail, signInWithGoogle, signInWithPhone, setupRecaptcha } from '../services/firebase';
import '../styles/Register.css';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [contactNumber, setContactNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneRegistration, setIsPhoneRegistration] = useState(false); // New state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setupRecaptcha(); // Initialize reCAPTCHA when the component is mounted
  }, []);

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const db = getFirestore();
    try {
      await signUpWithEmail(email, password, firstName, lastName, role, contactNumber);
      await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        email,
        role,
        contactNumber,
        createdAt: new Date(),
      });
      alert('Registration successful!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      alert('Google login successful!');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const confirmationResult = await signInWithPhone(phoneNumber);
      const code = prompt('Enter the verification code you received:');
      if (code) {
        await confirmationResult.confirm(code);
        alert('Phone sign-in successful!');
      } else {
        alert('No code entered');
      }
    } catch (error) {
      console.error('Error during phone sign-in:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>

        {/* Toggle between email and phone registration */}
        {!isPhoneRegistration ? (
          <form onSubmit={handleEmailSignUp}>
            <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User</option>
              <option value="collector">Collector</option>
              <option value="admin">Admin</option>
            </select>
            <input type="text" placeholder="Contact Number" onChange={(e) => setContactNumber(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={isLoading}>Register with Email</button>
          </form>
        ) : (
          <form onSubmit={handlePhoneSignIn}>
            <input
              type="text"
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>Confirm Phone Registration</button>
          </form>
        )}

        {/* Google Sign-In Button */}
        <button className="btn" onClick={handleGoogleSignIn} disabled={isLoading}>Sign in with Google</button>

        {/* Toggle for switching between phone and email registration */}
        <button className="btn" onClick={() => setIsPhoneRegistration(!isPhoneRegistration)} disabled={isLoading}>
          {isPhoneRegistration ? 'Sign in with email' : 'Sign in with Phone'}
        </button>
        <p>
          already registered? <a href="/login">Register here</a>
        </p>
        {/* Invisible reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Register;
