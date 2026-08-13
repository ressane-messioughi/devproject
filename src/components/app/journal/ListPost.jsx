import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Trash2 } from 'lucide-react';
import { useFetch } from '../../../hooks/useFetch.js';
import useProject from '../../../hooks/useProject.js';
import useIsOwner from '../../../hooks/useIsOwner.js';
import { AuthContext } from '../../../context/AuthContext.js';
import { socket } from '../../../socket.js';
import Badge from '../../ui/Badge.jsx';
import Modal from '../../ui/Modal.jsx';
import ModalField from '../../ui/ModalField.jsx';
import Button from '../../ui/Button.jsx';
import IconButton from '../../ui/IconButton.jsx';
import { TEAM_ROLE_COLORS, TEAM_ROLE_BADGE_SIZE } from '../../../constants/teamRoles.js';

function ListPost() {
  const { apiFetch } = useFetch();
  const { selectedProject } = useProject();
  const { user } = useContext(AuthContext);
  const isOwner = useIsOwner();
  const [post, setPost] = useState([]);
  const [openPost, setOpenPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject) return;

      const response = await apiFetch(`/project/${selectedProject.id_project}/journal`, {
        method: 'GET',
      });

      if (!response?.ok) {
        return;
      }
      const result = await response.json();
      setPost(result);
    };
    fetchData();
  }, [selectedProject, apiFetch]);

  // UseEffect pour le rendu via socket.io
  // =============================================
  useEffect(() => {
    if (!selectedProject) return;

    const handleNewMessage = (newMessage) => {
      if (Number(newMessage.project_id) !== Number(selectedProject.id_project)) return;

      setPost((prev) => [newMessage, ...prev]);
    };

    socket.on('newJournalMessage', handleNewMessage);

    return () => {
      socket.off('newJournalMessage', handleNewMessage);
    };
  }, [selectedProject]);

  // UseEffect pour mettre à jour la photo de profil d'un auteur de post en temps réel
  // =============================================
  useEffect(() => {
    const handleAvatarUpdated = ({ user_id, avatar }) => {
      setPost((prev) => prev.map((item) => (item.id === user_id ? { ...item, avatar } : item)));
    };

    socket.on('avatarUpdated', handleAvatarUpdated);

    return () => {
      socket.off('avatarUpdated', handleAvatarUpdated);
    };
  }, []);

  // Fonction pour supprimer un post (l'auteur ou le owner du projet)
  // =============================================
  const handleDelete = async (id_journal) => {
    const confirmed = window.confirm('Supprimer ce post ?');
    if (!confirmed) return;

    const response = await apiFetch(
      `/project/${selectedProject.id_project}/journal/${id_journal}`,
      { method: 'DELETE' },
    );

    if (!response?.ok) return;

    setPost((prev) => prev.filter((item) => item.id_journal !== id_journal));
  };

  // Fonction pour ouvrir la modale d'édition d'un post (uniquement l'auteur)
  // =============================================
  const openEditModal = (item) => {
    reset({ title: item.title, message: item.message });
    setEditingPost(item.id_journal);
  };

  // Fonction pour modifier un post
  // =============================================
  const handleEditSubmit = async (data) => {
    const response = await apiFetch(
      `/project/${selectedProject.id_project}/journal/${editingPost}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );

    if (!response?.ok) return;

    setPost((prev) =>
      prev.map((item) =>
        item.id_journal === editingPost
          ? { ...item, title: data.title, message: data.message }
          : item,
      ),
    );
    setEditingPost(null);
  };

  return (
    <section className="h-130 overflow-y-auto rounded-xl bg-(--color-surface) border border-white/10 p-6">
      <div className="flex flex-col gap-6">
        {post.map((item) => {
          const isAuthor = item.id === user?.id;

          return (
            <article
              key={item.id_journal}
              className="flex flex-col gap-4 hover:bg-white/5 rounded-lg p-3 transition"
            >
              <div className="w-full flex items-start gap-2">
                <button
                  onClick={() => setOpenPost(openPost === item.id_journal ? null : item.id_journal)}
                  className="flex-1 min-w-0 flex gap-4 text-left cursor-pointer"
                >
                  <img
                    src={item.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-bold text-white text-base md:text-sm">
                        {item.username}
                      </span>

                      <span className="text-xs text-gray-400 flex items-center gap-2">
                        {new Date(item.created_at).toLocaleString('fr-FR')}
                        {item.team_role && (
                          <Badge
                            className={`hidden sm:inline-flex ${TEAM_ROLE_BADGE_SIZE} ${TEAM_ROLE_COLORS[item.team_role]}`}
                          >
                            {item.team_role}
                          </Badge>
                        )}
                      </span>
                    </div>
                    {item.team_role && (
                      <Badge
                        className={`sm:hidden self-start mt-1 ${TEAM_ROLE_BADGE_SIZE} ${TEAM_ROLE_COLORS[item.team_role]}`}
                      >
                        {item.team_role}
                      </Badge>
                    )}

                    <h2 className="text-gray-100 text-left font-bold leading-relaxed wrap-break-word text-xl md:text-lg">
                      {item.title}
                    </h2>
                  </div>
                </button>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {(isAuthor || isOwner) && (
                    <div className="flex gap-1.5">
                      {isAuthor && (
                        <IconButton
                          color="orange"
                          size="md"
                          onClick={() => openEditModal(item)}
                          aria-label="Modifier le post"
                        >
                          <Pencil size={20} />
                        </IconButton>
                      )}
                      <IconButton
                        size="md"
                        onClick={() => handleDelete(item.id_journal)}
                        aria-label="Supprimer le post"
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setOpenPost(openPost === item.id_journal ? null : item.id_journal)
                    }
                    aria-label={
                      openPost === item.id_journal ? 'Réduire le post' : 'Déplier le post'
                    }
                    className="text-2xl font-bold cursor-pointer px-2 hover:text-(--color-text-secondary)"
                  >
                    {openPost === item.id_journal ? '−' : '+'}
                  </button>
                </div>
              </div>
              {openPost === item.id_journal && (
                <div className="mt-4 ml-0 sm:ml-16 rounded-lg bg-black/20 border border-white/10 p-4">
                  <p className="text-gray-100 leading-relaxed text-base md:text-sm">
                    {item.message}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Modal
        isOpen={editingPost !== null}
        onClose={() => setEditingPost(null)}
        title="Modifier le post"
      >
        <form onSubmit={handleSubmit(handleEditSubmit)} className="flex flex-col gap-2">
          <ModalField
            id="edit-title"
            label="Titre :"
            register={register('title', { required: 'titre requis' })}
          />

          <ModalField
            id="edit-message"
            label="Message :"
            textarea
            rows="6"
            register={register('message', { required: 'message requis' })}
          />

          <Button variant="secondary" type="submit">
            Enregistrer
          </Button>
        </form>
      </Modal>
    </section>
  );
}

export default ListPost;
