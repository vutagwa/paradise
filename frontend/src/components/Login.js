import React, { useState, useEffect } from 'react';
import { signInWithEmail, signInWithPhone, signInWithGoogle, getUserRoleFromFirestore } from '../services/firebase'; // Import your Firebase functions
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appVerifier, setAppVerifier] = useState(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [error, setError] = useState('');

  // Set up reCAPTCHA when the component mounts
  useEffect(() => {
    if (window.firebase && window.firebase.auth) {
      const verifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      });
      setAppVerifier(verifier);
    } else {
      console.error('Firebase is not initialized or auth is not available');
    }
  }, []);

  // Function to handle role-based redirection
  const handleRedirectBasedOnRole = (role) => {
    if (role === 'admin') {
      navigate('/admin-dashboard'); // Path to Admin Dashboard
    } else if (role === 'collector') {
      navigate('/collector-dashboard'); // Path to Collector Dashboard
    } else {
      navigate('/user-dashboard'); // Path to User Dashboard
    }
  };

  // Email login handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmail(email, password); // Assuming this returns user data
      const role = await getUserRoleFromFirestore(user.uid); // Get user role from Firestore
      handleRedirectBasedOnRole(role); // Redirect based on role
    } catch (error) {
      setError('Email or password is wrong.');
      console.error(error);
    }
  };

  // Phone login handler
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    try {
      const confirmationResult = await signInWithPhone(phoneNumber, appVerifier);
      const code = prompt('Enter the verification code you received:');
      const user = await confirmationResult.confirm(code); // Confirm phone verification
      const role = await getUserRoleFromFirestore(user.uid); // Get user role from Firestore
      handleRedirectBasedOnRole(role); // Redirect based on role
    } catch (error) {
      setError('Phone number is wrong.');
      console.error(error);
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle(); // Assuming this returns user data
      const role = await getUserRoleFromFirestore(user.uid); // Get user role from Firestore
      handleRedirectBasedOnRole(role); // Redirect based on role
    } catch (error) {
      setError('Error signing in with Google.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          {isPhoneLogin ? (
            <form onSubmit={handlePhoneLogin}>
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <button type="submit">Login with Phone</button>
            </form>
          ) : (
            <form onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login with Email</button>
            </form>
          )}
          <button onClick={handleGoogleLogin}>Login with Google</button>
          <button onClick={() => setIsPhoneLogin(!isPhoneLogin)}>
            {isPhoneLogin ? 'Use Email Login' : 'Use Phone Login'}
          </button>
        </div>
        <p>
          Not registered? <a href="/register">Register here</a>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
