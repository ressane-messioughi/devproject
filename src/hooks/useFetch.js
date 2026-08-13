import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export function useFetch() {
  const navigate = useNavigate();

  const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,

      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(!isFormData && { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });

    // Un 401/403 sans token déjà présent n'est pas une session expirée mais un
    // échec de connexion/inscription classique (mauvais identifiants, etc.) —
    // le formulaire concerné doit pouvoir afficher son propre message sans être
    // interrompu par une redirection.
    if ((res.status === 401 || res.status === 403) && token) {
      localStorage.removeItem('token');
      toast.warn('Connexion expirée');
      navigate('/login');

      return res;
    }

    return res;
  };
  return { apiFetch };
}
