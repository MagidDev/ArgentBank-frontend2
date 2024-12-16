import { configureStore } from '@reduxjs/toolkit'; 
// Importe la méthode `configureStore` de Redux Toolkit pour créer le store de l'application
import authReducer from '../features/authSlice'; 
// Importe le reducer `authReducer` pour gérer l'état lié à l'authentification

// Création du store Redux avec `configureStore`
const store = configureStore({
  reducer: {
    auth: authReducer, 
    // Associe le reducer `authReducer` à la clé `auth` dans le store
    // Toutes les actions liées à l'authentification seront gérées ici
  },
  devTools: process.env.NODE_ENV !== 'production', 
  // Active Redux DevTools uniquement si l'application n'est pas en mode production
});

export default store;
