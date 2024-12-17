import React, { useState, useEffect } from 'react'; // Importation de useState pour gérer les états locaux et useEffect pour les effets secondaires.
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  // États locaux pour gérer l'email, le mot de passe, les erreurs, et la case "Remember Me".
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);

  // Initialisation de useDispatch pour dispatcher des actions Redux.
  const dispatch = useDispatch();

  // Initialisation de useNavigate pour naviguer entre les pages.
  const navigate = useNavigate();

  // Récupération de l'URL de l'API depuis les variables d'environnement ou utilisation d'une valeur par défaut.
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

  // Effet pour récupérer les informations utilisateur sauvegardées dans localStorage si "Remember Me" était activé.
  useEffect(() => {
    const savedUser = localStorage.getItem('rememberedUser'); // Récupère les données sauvegardées depuis localStorage.
    if (savedUser) {
      const { email, password } = JSON.parse(savedUser); // Parse les données sauvegardées en objet.
      setEmail(email);
      setPassword(password);
      setRememberMe(true); // Coche la case "Remember Me" automatiquement.
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
      // Envoie une requête POST à l'API pour se connecter avec l'email et le mot de passe.
      const loginResponse = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });

      console.log('Login response:', loginResponse.data);

      const token = loginResponse.data.body.token; // Extraction du token de la réponse API.

      // Requête GET pour récupérer les informations de profil utilisateur grâce au token.
      const userResponse = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`, // Envoi du token dans les en-têtes d'autorisation.
        },
      });

      console.log('User response:', userResponse.data);

      // Préparation des données utilisateur pour Redux.
      const userData = {
        email: userResponse.data.body.email,
        firstName: userResponse.data.body.firstName,
        lastName: userResponse.data.body.lastName,
        userName: userResponse.data.body.userName,
        token, // Token reçu de l'API.
      };

      // Sauvegarde des informations utilisateur dans localStorage si "Remember Me" est coché.
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('rememberedUser'); // Supprime les données si "Remember Me" est décoché.
      }

      // Dispatch de l'action "login" pour mettre à jour l'état global Redux.
      dispatch(login(userData));

      setError(null); // Réinitialisation de l'erreur.
      navigate('/profile'); // Redirection de l'utilisateur vers la page profil après connexion réussie.
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
        <form onSubmit={handleLogin}> {/* Formulaire qui appelle handleLogin à la soumission. */}
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
              onChange={(e) => setRememberMe(e.target.checked)} // Met à jour l'état rememberMe.
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
