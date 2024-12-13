import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../features/authSlice';

function UserProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = user?.token;
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [firstName] = useState(user?.firstName || '');
  const [lastName] = useState(user?.lastName || '');

  // Redirige si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    try {
      console.log('Token:', token);
      console.log('Updating username to:', username);

      const response = await axios.put(
        `${API_URL}/user/profile`,
        { userName: username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Update Response:', response.data);

      const updatedUsername = response.data.body?.userName || username;

      const updatedUser = {
        ...user,
        username: updatedUsername,
      };

      // Met à jour Redux
      dispatch(login(updatedUser));

      // Sauvegarde dans localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update username', err);
    }
  };

  return (
    <main className="main bg-dark profile-page">
      <div className="header">
        {!isEditing ? (
          <>
            <h1>
              Welcome back
              <br />
              {user?.firstName} {user?.lastName}!
            </h1>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit Name
            </button>
          </>
        ) : (
          <div className="edit-form">
            <h2>Edit user info</h2>
            <div className="form-group">
              <label htmlFor="username">User name:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                disabled
              />
            </div>
            <div className="form-buttons">
              <button className="edit-button" onClick={handleSave}>
                Save
              </button>
              <button className="edit-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <h2 className="sr-only">Accounts</h2>
      {/* Sections des comptes */}
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
