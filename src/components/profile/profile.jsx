import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const ProfileComponent = ({ onLogout }) => {
  const [profilePic, setProfilePic] = useState('default-avatar.png');
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [preferences, setPreferences] = useState({ meditationLevel: '', preferredLanguage: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage('You need to log in to access this page.');
        navigate('/login');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const { name, profilePicture, phone, address, preferences } = response.data;
        setUserName(name || '');
        setProfilePic(profilePicture || 'default-avatar.png');
        setPhone(phone || '');
        setAddress(address || { street: '', city: '', state: '', zipCode: '' });
        setPreferences(preferences || { meditationLevel: '', preferredLanguage: '' });
      } catch (error) {
        console.error('Error fetching user data:', error.response || error.message);
        setErrorMessage('Error fetching user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfilePic(URL.createObjectURL(selectedFile));
    }
  };

  const handleUserNameChange = (event) => setUserName(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
  const handleAddressChange = (event) => setAddress({ ...address, [event.target.name]: event.target.value });
  const handlePreferencesChange = (event) => setPreferences({ ...preferences, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (userName.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', userName);
    formData.append('phone', phone);
    if (file) formData.append('profilePicture', file);
    formData.append('address.street', address.street);
    formData.append('address.city', address.city);
    formData.append('address.state', address.state);
    formData.append('address.zipCode', address.zipCode);
    formData.append('preferences.meditationLevel', preferences.meditationLevel);
    formData.append('preferences.preferredLanguage', preferences.preferredLanguage);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.put(`${apiUrl}/api/profile`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        setProfilePic(response.data.user.profilePicture || 'default-avatar.png');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response || error.message);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form fields to their initial state
    setUserName('');
    setPhone('');
    setAddress({ street: '', city: '', state: '', zipCode: '' });
    setPreferences({ meditationLevel: '', preferredLanguage: '' });
    setFile(null);
    setProfilePic('default-avatar.png');
  
    // Redirect to the Dashboard page
    navigate('/dashboard'); // Change this path to match your actual dashboard route
  };
  

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <h2 className="profile-title">Profile</h2>

      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="profile-content">
        <div className="profile-picture-section">
          <img src={profilePic} alt="Profile" className="profile-picture" />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="profile-info-section">
          <label>Username</label>
          <input type="text" value={userName} onChange={handleUserNameChange} required />

          <label>Phone</label>
          <input type="text" value={phone} onChange={handlePhoneChange} />

          <label>Street</label>
          <input type="text" name="street" value={address.street} onChange={handleAddressChange} />

          <label>City</label>
          <input type="text" name="city" value={address.city} onChange={handleAddressChange} />

          <label>State</label>
          <input type="text" name="state" value={address.state} onChange={handleAddressChange} />

          <label>Zip Code</label>
          <input type="text" name="zipCode" value={address.zipCode} onChange={handleAddressChange} />

          <label>Meditation Level</label>
          <select name="meditationLevel" value={preferences.meditationLevel} onChange={handlePreferencesChange}>
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label>Preferred Language</label>
          <input type="text" name="preferredLanguage" value={preferences.preferredLanguage} onChange={handlePreferencesChange} />
        </div>

        <div className="profile-buttons">
          <button type="submit" className="profile-save-btn">Save</button>
          <button type="button" className="profile-cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
        <button type="button" className="profile-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </form>
  );
};

export default ProfileComponent;
