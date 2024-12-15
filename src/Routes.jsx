import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
