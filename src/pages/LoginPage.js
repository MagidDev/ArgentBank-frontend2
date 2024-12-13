import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation des champs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Requête de connexion pour obtenir le token
      const loginResponse = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });

      console.log('Login response:', loginResponse.data);

      const token = loginResponse.data.body.token;

      // Requête pour récupérer les informations utilisateur avec le token
      const userResponse = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User response:', userResponse.data);

      const userData = {
        email: userResponse.data.body.email,
        firstName: userResponse.data.body.firstName,
        lastName: userResponse.data.body.lastName,
        userName: userResponse.data.body.userName, // Ajout du champ `userName`
        token,
      };

      // Mise à jour du Redux store
      dispatch(login(userData));

      setError(null); // Réinitialise les erreurs
      navigate('/profile'); // Redirection vers la page profil
    } catch (err) {
      console.error('Error during login:', err);
      setError('Invalid email or password');
    }
  };

  return (
    <main className="main bg-dark login-page">
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
