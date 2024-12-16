import React, { useState, useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import { login } from '../features/authSlice.js'; 
import TransactionButton from '../components/TransactionButton.jsx'; 

// Déclaration du composant UserProfilePage
function UserProfilePage() { 
  const dispatch = useDispatch(); // Hook pour envoyer des actions Redux
  const navigate = useNavigate(); // Hook pour naviguer entre les pages
  const user = useSelector((state) => state.auth.user); // Récupère les informations de l'utilisateur depuis le store Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Vérifie si l'utilisateur est connecté
  const token = user?.token; // Récupère le token de l'utilisateur
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1'; // Détermine l'URL de l'API

  // États locaux pour gérer l'édition du profil
  const [isEditing, setIsEditing] = useState(false); // Définit si le mode édition est actif
  const [username, setUsername] = useState(user?.username || ''); // Stocke le nom d'utilisateur en cours d'édition
  const [firstName] = useState(user?.firstName || ''); // Stocke le prénom (non modifiable)
  const [lastName] = useState(user?.lastName || ''); // Stocke le nom de famille (non modifiable)

  // Redirection si l'utilisateur n'est pas connecté
  useEffect(() => { 
    if (!isAuthenticated) { 
      navigate('/login'); 
    } 
  }, [isAuthenticated, navigate]); 

  // Fonction pour sauvegarder les modifications du profil utilisateur
  const handleSave = async () => { 
    try { 
      console.log('Token:', token); 
      console.log('Updating username to:', username); 

      // Requête PUT pour mettre à jour le profil
      const response = await axios.put( 
        `${API_URL}/user/profile`, 
        { userName: username }, 
        { 
          headers: { 
            Authorization: `Bearer ${token}`, // Envoie le token pour l'authentification
          }, 
        } 
      ); 

      console.log('Update Response:', response.data); 

      const updatedUsername = response.data.body?.userName || username; // Récupère le nom mis à jour

      const updatedUser = { 
        ...user, 
        username: updatedUsername, 
      }; 

      // Met à jour l'état global avec Redux
      dispatch(login(updatedUser)); 

      // Sauvegarde dans le localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser)); 

      setIsEditing(false); // Désactive le mode édition
    } catch (err) { 
      console.error('Failed to update username', err); 
    } 
  }; 

  // Structure JSX du composant
  return ( 
    <main className="main bg-dark profile-page"> 
      <div className="header"> 
        {!isEditing ? ( 
          <> 
            <h1> 
              Welcome back 
              <br /> 
              {user?.firstName} {user?.lastName}! 
            </h1> 
            <button className="edit-button" onClick={() => setIsEditing(true)}> 
              Edit Name 
            </button> 
          </> 
        ) : ( 
          <div className="edit-form"> 
            <h2>Edit user info</h2> 
            <div className="form-group"> 
              <label htmlFor="username">User name:</label> 
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              /> 
            </div> 
            <div className="form-group"> 
              <label htmlFor="firstName">First name:</label> 
              <input 
                type="text" 
                id="firstName" 
                value={firstName} 
                disabled // Champ désactivé
              /> 
            </div> 
            <div className="form-group"> 
              <label htmlFor="lastName">Last name:</label> 
              <input 
                type="text" 
                id="lastName" 
                value={lastName} 
                disabled // Champ désactivé
              /> 
            </div> 
            <div className="form-buttons"> 
              <button className="edit-button" onClick={handleSave}> 
                Save 
              </button> 
              <button className="edit-button" onClick={() => setIsEditing(false)}> 
                Cancel 
              </button> 
            </div> 
          </div> 
        )} 
      </div> 
      <h2 className="sr-only">Accounts</h2> 
      {/* Sections des comptes */}
      <section className="account"> 
        <div className="account-content-wrapper"> 
          <h3 className="account-title">Argent Bank Checking (x8349)</h3> 
          <p className="account-amount">$2,082.79</p> 
          <p className="account-amount-description">Available Balance</p> 
        </div> 
        <div className="account-content-wrapper cta"> 
          {/* Bouton de transaction réutilisable */}
          <TransactionButton onClick={() => console.log('View transactions for Checking')} /> 
        </div> 
      </section> 
      <section className="account"> 
        <div className="account-content-wrapper"> 
          <h3 className="account-title">Argent Bank Savings (x6712)</h3> 
          <p className="account-amount">$10,928.42</p> 
          <p className="account-amount-description">Available Balance</p> 
        </div> 
        <div className="account-content-wrapper cta"> 
          {/* Bouton de transaction réutilisable */}
          <TransactionButton onClick={() => console.log('View transactions for Savings')} /> 
        </div> 
      </section> 
      <section className="account"> 
        <div className="account-content-wrapper"> 
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3> 
          <p className="account-amount">$184.30</p> 
          <p className="account-amount-description">Current Balance</p> 
        </div> 
        <div className="account-content-wrapper cta"> 
          <TransactionButton onClick={() => console.log('View transactions for Credit Card')} /> 
        </div> 
      </section> 
    </main> 
  ); 
} 

export default UserProfilePage; 