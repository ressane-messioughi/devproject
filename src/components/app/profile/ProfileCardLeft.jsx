import PropTypes from 'prop-types';
import { AuthContext } from '../../../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import ProfileLine from '../../ui/HorizontalLine';
import ProfileCardRight from './ProfileCardRight';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch';
import { toast } from 'react-toastify';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button.jsx';
import ModalField from '../../ui/ModalField.jsx';
import ReadOnlyField from '../../ui/ReadOnlyField.jsx';
import { INPUT_PLACEHOLDER_CLASS } from '../../../constants/formClasses.js';
import { socket } from '../../../socket.js';

function ProfileCard({ refresh }) {
  // Récupérer les informations de l'utilisateur connecté depuis le AuthContext
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(null);
  // Mettre à jour la photos dans le composant après l'update
  const { loginAuth, userInfo, updateUser } = useContext(AuthContext);
  // UseFetch pour {handleSubmitAvatar}
  const { apiFetch } = useFetch();
  const { handleSubmit: handleSubmitAvatar } = useForm({ mode: 'onTouched' });
  const { register, handleSubmit: handleSubmitUpdate } = useForm({ mode: 'onTouched' });

  // Fonction pour modifié son avatar
  // =============================================
  const handleSubmitUpdateAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiFetch(`/auth/me/avatar`, {
      method: 'PUT',
      body: formData,
    });
    const result = await response.json();
    // loginAuth régénère le token avec la nouvelle photo (sans ça, un rafraîchissement
    // de page réafficherait l'ancienne photo tant qu'on ne se reconnecte pas).
    loginAuth(result.token);
    socket.emit('avatarUpdated', { user_id: user.id, avatar: result.avatar });
    toast.success('Avatar mis à jour');
  };

  // Fonction pour modifié les informations de l'utilisateur
  // ======================================================
  const handleSubmitUpdateUser = async (newData) => {
    try {
      const id = user.id;
      const response = await apiFetch(`/auth/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(newData),
      });
      await response.json();
      updateUser(newData);
      setOpenModal(null);
      toast.success('Champs modifié avec succès !');
    } catch (error) {
      console.error(error);
    }
  };
  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    userInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // UseEffect pour le re-render de mon composant après l'update
  // =============================================
  useEffect(() => {
    userInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <>
      <h1 className="font-bold flex flex-col">
        {user?.lastname}
        <span className="z-1 font-bold">{user?.firstname}</span>
      </h1>
      <div className="flex flex-col md:flex-row justify-evenly gap-10 rounded-2xl p-4 shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 bg-white/4 backdrop-blur-md border border-white/8">
        <div className="flex flex-col w-full max-w-lg gap-4 ">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <img
              src={user?.avatar}
              alt={user?.firstname}
              className="w-40 h-40 border-white p-2 border object-cover rounded-full"
            />
            <div className="flex flex-col gap-2">
              <form
                onSubmit={handleSubmitAvatar(handleSubmitUpdateAvatar)}
                className="flex flex-col items-center gap-4"
              >
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    handleSubmitUpdateAvatar(file);
                  }}
                />

                <label
                  htmlFor="avatar"
                  className="cursor-pointer rounded-xl border-2 border-dashed border-white/60 bg-white/10 px-3 py-4 text-center hover:bg-white/20 transition"
                >
                  <p className="font-bold">Modifier mon avatar</p>
                  <p className="text-sm opacity-70">PNG, JPG, WEBP, SVG</p>
                </label>
              </form>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ReadOnlyField
              type="text"
              ariaLabel="Nom d'utilisateur actuel"
              placeholder={user?.username}
            />
            <Button onClick={() => setOpenModal('username')}>
              <Edit />
            </Button>
            <Modal
              isOpen={openModal === 'username'}
              onClose={() => setOpenModal(false)}
              title="Modifier mon Pseudo"
            >
              <form onSubmit={handleSubmitUpdate(handleSubmitUpdateUser)}>
                <ModalField
                  id="username"
                  label="Pseudo :"
                  placeholder="Ton nouveau pseudo ..."
                  className={INPUT_PLACEHOLDER_CLASS}
                  register={register('username')}
                />
                <Button variant="secondary" type="submit" className="mt-2">
                  Modifié
                </Button>
              </form>
            </Modal>
          </div>
          <div className="flex items-center gap-2">
            <ReadOnlyField
              type="text"
              ariaLabel="Adresse email actuelle"
              placeholder={user?.email}
            />
            <Button onClick={() => setOpenModal('email')}>
              <Edit />
            </Button>
            <Modal
              isOpen={openModal === 'email'}
              onClose={() => setOpenModal(false)}
              title="Modifier mon email"
            >
              <form onSubmit={handleSubmitUpdate(handleSubmitUpdateUser)}>
                <ModalField
                  id="email"
                  label="email :"
                  placeholder="Ta nouvelle adresse e-mail ..."
                  className={INPUT_PLACEHOLDER_CLASS}
                  register={register('email')}
                />
                <Button variant="secondary" type="submit" className="mt-2">
                  Modifié
                </Button>
              </form>
            </Modal>
          </div>
          <div className="flex items-center gap-2">
            <ReadOnlyField
              type="tel"
              ariaLabel="Numéro de téléphone actuel"
              placeholder={user?.phone?.replace(/(\d{2})(?=\d)/g, '$1.')}
            />
            <Button onClick={() => setOpenModal('phone')}>
              <Edit />
            </Button>
            <Modal
              isOpen={openModal === 'phone'}
              onClose={() => setOpenModal(false)}
              title="Modifier mon numéro de téléphone"
            >
              <form onSubmit={handleSubmitUpdate(handleSubmitUpdateUser)}>
                <ModalField
                  id="phone"
                  label="Télèphone :"
                  placeholder="Ton nouveau numéro (mobile) ..."
                  className={INPUT_PLACEHOLDER_CLASS}
                  register={register('phone')}
                />
                <Button variant="secondary" type="submit" className="mt-2">
                  Modifié
                </Button>
              </form>
            </Modal>
          </div>
          <div className="flex items-center gap-2">
            <ReadOnlyField
              type="password"
              ariaLabel="Mot de passe (masqué)"
              placeholder="**********"
            />
            <Button onClick={() => setOpenModal('password')}>
              <Edit />
            </Button>
            <Modal
              isOpen={openModal === 'password'}
              onClose={() => setOpenModal(false)}
              title="Modifier mon mots de passe"
            >
              <form onSubmit={handleSubmitUpdate(handleSubmitUpdateUser)}>
                <ModalField
                  id="password"
                  label="Nouveau mot de passe :"
                  type="password"
                  placeholder="Ton nouveau mot de passe ..."
                  className={INPUT_PLACEHOLDER_CLASS}
                  register={register('password')}
                />
                <Button variant="secondary" type="submit" className="mt-2">
                  Modifié
                </Button>
              </form>
            </Modal>
          </div>
          <div className="flex gap-5">
            <p className="text-xs">Création du compte effectué le :</p>
            <p className="text-xs">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Date non disponible'}
            </p>
          </div>
        </div>
        <ProfileLine />
        <ProfileCardRight />
      </div>
    </>
  );
}

ProfileCard.propTypes = {
  refresh: PropTypes.bool,
};

export default ProfileCard;
