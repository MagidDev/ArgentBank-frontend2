import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Si l'utilisateur n'est pas connecté, redirige vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche les enfants (la route protégée)
  return children;
}

export default PrivateRoute;
