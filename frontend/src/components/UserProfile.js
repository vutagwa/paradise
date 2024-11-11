import React, { useEffect, useState } from 'react';
import { db, auth, storage } from '../services/firebase'; // Import db, auth, and storage
import { onAuthStateChanged } from 'firebase/auth'; // Import from firebase/auth
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; // Import for Firestore
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import for Firebase Storage
import '../styles/userprof.css'; // Import your CSS file

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(''); // State for profile picture
  const [newProfilePicture, setNewProfilePicture] = useState(null); // File for new profile picture
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userId = currentUser.uid;
        const unsubscribeDoc = onSnapshot(doc(db, 'users', userId), (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
            setFirstName(doc.data().firstName);
            setLastName(doc.data().lastName);
            setEmail(doc.data().email);
            setPhoneNumber(doc.data().phoneNumber);
            setProfilePicture(doc.data().profilePicture); // Fetch profile picture from Firestore
          } else {
            setError('User does not exist.');
          }
        });

        return () => unsubscribeDoc(); // Clean up the Firestore listener
      }
    });

    return () => unsubscribe(); // Clean up the auth listener
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = auth.currentUser; // Access current user from auth

      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, 'users', userId);

        // If a new profile picture is selected, upload it
        if (newProfilePicture) {
          const profilePicRef = ref(storage, `profilePictures/${userId}`); // Create a reference to storage
          await uploadBytes(profilePicRef, newProfilePicture); // Upload new profile picture
          const profilePicUrl = await getDownloadURL(profilePicRef); // Get the URL of the uploaded picture
          await updateDoc(userDocRef, {
            firstName,
            lastName,
            email,
            phoneNumber,
            profilePicture: profilePicUrl, // Update Firestore with new profile picture URL
          });
          setProfilePicture(profilePicUrl); // Update state with new profile picture
        } else {
          // If no new profile picture, just update other fields
          await updateDoc(userDocRef, {
            firstName,
            lastName,
            email,
            phoneNumber,
          });
        }

        setSuccess('Profile updated successfully!');
      }
    } catch (error) {
      setError('Error updating profile: ' + error.message);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const currentUser = auth.currentUser; // Access current user from auth

      if (currentUser) {
        if (newPassword) {
          await currentUser.updatePassword(newPassword);
          setSuccess('Password changed successfully!');
          setNewPassword('');
        } else {
          setError('Please enter a new password.');
        }
      }
    } catch (error) {
      setError('Error changing password: ' + error.message);
    }
  };

  // Handle profile picture file input change
  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div>
      <h1>User Profile</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Display current profile picture */}
      {profilePicture && <img src={profilePicture} alt="Profile" width="150" height="150" />}

      <form onSubmit={handleProfileUpdate}>
        <h2>Edit Profile</h2>
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          required
        />

        {/* Profile Picture Upload */}
        <input
          type="file"
          onChange={handleProfilePictureChange}
          accept="image/*"
        />

        <button type="submit">Update Profile</button>
      </form>

      <form onSubmit={handleChangePassword}>
        <h2>Change Password</h2>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default UserProfile;
