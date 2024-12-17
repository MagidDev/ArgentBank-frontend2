import { createSlice } from '@reduxjs/toolkit';

// Définition de l'état initial
const initialState = {
  isAuthenticated: Boolean(localStorage.getItem('user')), // Vérifie si un utilisateur est stocké dans localStorage pour définir l'état d'authentification
  user: JSON.parse(localStorage.getItem('user')) || {    // Récupère les informations utilisateur depuis localStorage ou initialise avec des valeurs par défaut
    email: null,
    firstName: null,
    lastName: null,
    token: null,
    username: null,
  },
};

// Création du slice Redux pour gérer l'authentification
const authSlice = createSlice({
  name: 'auth', // Nom du slice utilisé pour identifier cette fonctionnalité dans Redux
  initialState, // État initial défini ci-dessus
  reducers: {
    // Action pour connecter l'utilisateur
    login: (state, action) => {
      state.isAuthenticated = true; // Met à jour l'état d'authentification à "true"
      state.user = { 
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,   // Met à jour le nom
        token: action.payload.token,
        username: action.payload.userName || action.payload.username, // Met à jour le nom d'utilisateur avec compatibilité pour deux formats
      };
      localStorage.setItem('user', JSON.stringify(state.user)); // Sauvegarde les informations utilisateur dans localStorage pour persistance
    },
    
    logout: (state) => {
      state.isAuthenticated = false; // Réinitialise l'état d'authentification à "false"
      state.user = { // Réinitialise les informations utilisateur à des valeurs nulles
        email: null,
        firstName: null,
        lastName: null,
        token: null,
        username: null,
      };
      localStorage.removeItem('user'); // Supprime les données utilisateur de localStorage
    },
  },
});

// Export des actions pour les utiliser dans les composants
export const { login, logout } = authSlice.actions;
// Export du reducer pour l'ajouter au store Redux
export default authSlice.reducer;
