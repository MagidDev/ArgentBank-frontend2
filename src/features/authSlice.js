import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: Boolean(localStorage.getItem('user')),
  user: JSON.parse(localStorage.getItem('user')) || {
    email: null,
    firstName: null,
    lastName: null,
    token: null,
    username: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = { 
        email: action.payload.email,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        token: action.payload.token,
        username: action.payload.userName || action.payload.username, // Compatibilité avec les deux formats
      };
      localStorage.setItem('user', JSON.stringify(state.user)); // Sauvegarde dans localStorage
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        email: null,
        firstName: null,
        lastName: null,
        token: null,
        username: null,
      };
      localStorage.removeItem('user'); // Supprime les données du localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
