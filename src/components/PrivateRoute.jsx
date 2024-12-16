import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


// Protège une route et redirige l'utilisateur si celui-ci n'est pas authentifié
function PrivateRoute({ children }) {
  // Utilisation de Redux pour vérifier l'état d'authentification
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Si l'utilisateur n'est pas connecté, redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche les enfants (la route protégée)
  return children;
}

export default PrivateRoute;
