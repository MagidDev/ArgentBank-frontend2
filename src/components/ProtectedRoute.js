import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Si l'utilisateur n'est pas authentifié, redirige vers la page login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche le contenu de la route
  return children;
}

export default ProtectedRoute;