import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Pour interagir avec Redux
import { logout } from '../features/authSlice'; // Action Redux pour gérer la déconnexion


function Navbar() {
  const dispatch = useDispatch(); // Permet de déclencher des actions Redux
  const navigate = useNavigate(); // Permet de naviguer entre les pages

  // Sélectionne les états dans le store Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Vérifie si l'utilisateur est authentifié
  const user = useSelector((state) => state.auth.user); // Récupère les informations de l'utilisateur connecté

  // Fonction appelée lors de la déconnexion
  const handleLogout = () => {
    dispatch(logout()); // Déclenche l'action `logout` pour réinitialiser l'état dans Redux
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil après la déconnexion
  };

  // Rendu du composant Navbar
  return (
    <nav className="main-nav">
      {/* Logo et lien vers la page d'accueil */}
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src="/img/argentBankLogo.webp"
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      
      <div>
        {isAuthenticated ? ( // Si l'utilisateur est authentifié
          <>
            {/* Lien vers la page profil avec le pseudo de l'utilisateur */}
            <Link to="/profile" className="main-nav-item">
              <i className="fa fa-user-circle"></i>
              {user?.username || 'User'} {/* Affiche le pseudo ou "User" par défaut */}
            </Link>
            {/* Bouton de déconnexion */}
            <button
              className="main-nav-item navbar-sign-out"
              onClick={handleLogout} // Appelle handleLogout au clic
            >
              <i className="fa fa-sign-out"></i> Sign Out 
            </button>
          </>
        ) : ( // Si l'utilisateur n'est pas authentifié
          // Lien vers la page de connexion
          <Link className="main-nav-item" to="/login">
            <i className="fa fa-user-circle"></i> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;