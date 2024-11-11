/*import React, { useState, useEffect } from 'react';
import { Autocomplete, createFilterOptions, TextField, Button, FormControlLabel, Switch, Typography, Paper, Box, Divider } from '@mui/material';
import { auth, db } from '../services/firebase';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/SettingsPage.css';*/

/*const SettingsPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    notificationsEnabled: true,
    darkMode: false,
    accountPrivacy: 'public',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        if (userData.email !== user.email) {
          await updateEmail(user, userData.email);
        }
        if (userData.password) {
          await updatePassword(user, userData.password);
        }
        const userDoc = doc(db, 'users', user.uid);
        await updateDoc(userDoc, {
          name: userData.name,
          notificationsEnabled: userData.notificationsEnabled,
          darkMode: userData.darkMode,
          accountPrivacy: userData.accountPrivacy,
        });
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving settings.');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (confirmDelete) {
      try {
        const user = auth.currentUser;
        if (user) {
          await user.delete();
          alert('Account deleted successfully!');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while deleting your account.');
      }
    }
  };

  return (
    <Box component="main" className="settings-container">
      <Paper elevation={3} className="settings-paper">
        <Typography variant="h4" className="settings-heading">
          E-Waste Management Settings
        </Typography>
        <Typography variant="body1" className="settings-description">
          Manage your account, notifications, and other settings here.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="settings-textfield"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={userData.email}
            onChange={handleChange}
            type="email"
            className="settings-textfield"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={userData.password}
            onChange={handleChange}
            type="password"
            className="settings-textfield"
          />

          <Divider className="settings-divider" />

          <FormControlLabel
            control={
              <Switch
                checked={userData.notificationsEnabled}
                onChange={handleChange}
                name="notificationsEnabled"
                className="settings-switch"
              />
            }
            label="Enable Notifications"
            className="settings-switch-label"
          />

          <FormControlLabel
            control={
              <Switch
                checked={userData.darkMode}
                onChange={handleChange}
                name="darkMode"
                className="settings-switch"
              />
            }
            label="Dark Mode"
            className="settings-switch-label"
          />

          <TextField
            label="Account Privacy"
            variant="outlined"
            fullWidth
            margin="normal"
            name="accountPrivacy"
            value={userData.accountPrivacy}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            className="settings-textfield"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            className="settings-button settings-save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>

          <Button
            variant="outlined"
            className="settings-button settings-logout-button"
            onClick={handleLogout}
          >
            Logout
          </Button>

          <Button
            variant="outlined"
            className="settings-button settings-delete-button"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
*/