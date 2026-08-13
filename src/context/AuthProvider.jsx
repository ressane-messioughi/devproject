import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket.js';

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const [user, setUser] = useState(null);

  // Rejoint la salle personnelle "user_<id>" dès que l'utilisateur est identifié,
  // pour pouvoir le notifier directement (ex: acceptation d'une demande d'adhésion)
  // sans dépendre du projet actuellement sélectionné.
  useEffect(() => {
    if (!user?.id) return;
    socket.emit('identify', { user_id: user.id });
  }, [user?.id]);

  // Récupère les informations de l'utilisateur
  function userInfo() {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch {
      setUser(null);
    }
  }
  // R'envoi un nouveau Token avec les informations UPDATE
  const updateUser = (newData) => {
    setUser((prev) => ({
      ...prev,
      ...newData,
    }));
  };
  // Gestion du token à la connexion  enregistrement + decode + setUser
  function loginAuth(token) {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsLoggedIn(true);
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    }
  }

  const navigate = useNavigate();
  // Fonction qui gère la déconnexion
  function logout() {
    socket.emit('leaveProjectRoom');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedProject');
    setUser(null);
    setIsLoggedIn(false);
    // ProjectProvider est un descendant, pas un ancestor : impossible d'appeler useProject()
    // ici pour vider selectedProject directement. Un événement custom le prévient sans
    // dépendance directe entre les deux contextes.
    window.dispatchEvent(new Event('app:logout'));
    navigate('/');
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginAuth,
        logout,
        user,
        userInfo,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
