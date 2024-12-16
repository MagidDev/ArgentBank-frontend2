import React, { useState, useEffect } from 'react'; // Ajout de useEffect pour récupérer les données sauvegardées.
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  // États locaux pour gérer l'email, le mot de passe, l'erreur, et l'état "Remember Me".
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Nouvel état pour la case "Remember Me".
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

  // Récupérer les informations utilisateur sauvegardées dans localStorage au chargement de la page.
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      const { email, password } = JSON.parse(savedUser); // Parse les données sauvegardées.
      setEmail(email);
      setPassword(password);
      setRememberMe(true); // Coche automatiquement la case "Remember Me".
    }
  }, []);

  // Fonction déclenchée lors de la soumission du formulaire de connexion.
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const loginResponse = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });

      console.log('Login response:', loginResponse.data);

      const token = loginResponse.data.body.token;

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
        userName: userResponse.data.body.userName,
        token,
      };

      // Sauvegarde des informations utilisateur dans localStorage si "Remember Me" est activé.
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('rememberedUser'); // Supprime les données sauvegardées si "Remember Me" est désactivé.
      }

      // Dispatch de l'action login pour mettre à jour Redux.
      dispatch(login(userData));

      setError(null); // Réinitialise les erreurs.
      navigate('/profile'); // Redirection vers la page profil.
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
          <div className="input-remember">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)} // Mise à jour de l'état "Remember Me".
            />
            <label htmlFor="remember-me">Remember Me</label>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="sign-in-button">Sign In</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
