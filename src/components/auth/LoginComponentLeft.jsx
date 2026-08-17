import logo from '../../assets/image/logo.webp'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import { useFetch } from '../../hooks/useFetch.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';
import { useForm } from 'react-hook-form';
import CustomToast from '../ui/CustomToast.jsx';
import AlertBanner from '../ui/AlertBanner.jsx';
import FormField from '../ui/FormField.jsx';
import Button from '../ui/Button.jsx';
import { jwtDecode } from 'jwt-decode';

function LoginComponentLeft() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  const { loginAuth } = useContext(AuthContext);
  const { apiFetch } = useFetch();
  const [apiError, setApiError] = useState('');

  const handleSubmitForm = async (data) => {
    setApiError(''); // Réinitialise l'erreur à chaque tentative

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const token = result.token;
      if (response.ok) {
        loginAuth(token);
        // Decode le token pour obtenir les informations de l'utilisateur afin d'envvoyer un toast personnalisé avec l'avatar via Socket.IO
        const user = jwtDecode(token);
        if (!user) {
          console.error('Erreur: utilisateur non défini après la connexion.');
          return;
        }
        toast(
          <CustomToast
            message={
              <>
                <span>Bienvenue, </span>
                <span className="font-bold text-amber-400">{user.firstname}</span>
                <span> !</span>
              </>
            }
          />,
        );
        navigate('/panel');
      } else {
        // Capture l'erreur renvoyée par Express (ex: "Mot de passe incorrect")
        const message = getErrorMessage(result, 'Identifiants invalides.');
        setApiError(message);
        toast.error(message);
      }
    } catch {
      // On arrive ici uniquement si le serveur n'a pas repondu du tout
      // (eteint, pas de reseau). Ce n'est pas un probleme d'identifiants.
      setApiError('Connexion au serveur impossible. Réessayez dans un instant.');
    }
  };

  return (
    <div className="bg-(--color-card) flex flex-col items-center justify-center gap-4 border border-(--color-card-border) rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 hover:bg-(--color-card-hover) hover:-translate-y-1 w-full max-w-sm">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col w-full items-center gap-5"
      >
        <img src={logo} alt="Logo" className="w-40 mx-auto" />
        <AlertBanner message={apiError} className="w-full max-w-xs" />

        <FormField
          id="email"
          label="Email:"
          type="email"
          labelClassName="font-bold mt-10"
          errorId="email-error"
          register={register('email', {
            required: 'Email obligatoire',
          })}
          error={errors.email}
        />

        <FormField
          id="password"
          label="Password:"
          type="password"
          errorId="password-error"
          register={register('password', {
            required: 'Mots de passe obligatoire',
          })}
          error={errors.password}
        />
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
      <p className="text-text-secondary underline">Pas encore inscrit ? </p>
    </div>
  );
}

export default LoginComponentLeft;
