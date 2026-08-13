import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFetch } from '../../../hooks/useFetch.js';
import useProject from '../../../hooks/useProject.js';
import useIsOwner from '../../../hooks/useIsOwner.js';
import { AuthContext } from '../../../context/AuthContext.js';
import { socket } from '../../../socket.js';
import Modal from '../../ui/Modal.jsx';
import ModalField from '../../ui/ModalField.jsx';
import Button from '../../ui/Button.jsx';
import RowBug from './RowBug.jsx';

function ListBug() {
  const { apiFetch } = useFetch();
  const { selectedProject } = useProject();
  const { user } = useContext(AuthContext);
  const isOwner = useIsOwner();
  const [bugs, setBugs] = useState([]);
  const [editingBug, setEditingBug] = useState(null);
  const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

  // Fonction pour récupérer les bugs du projet
  // =============================================

  // Fonction pour récupérer les bugs du projet
  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedProject) return;

      const response = await apiFetch(`/project/${selectedProject.id_project}/bug`, {
        method: 'GET',
      });

      if (!response?.ok) return;

      const data = await response.json();
      setBugs(data.result);
    };
    fetchData();
  }, [selectedProject, apiFetch]);

  // UseEffect pour le rendu en temps réel via socket.io
  // =============================================
  useEffect(() => {
    if (!selectedProject) return;

    const handleNewBug = (newBug) => {
      if (Number(newBug.project_id) !== Number(selectedProject.id_project)) return;

      setBugs((prev) => [newBug, ...prev]);
    };

    socket.on('newBug', handleNewBug);

    return () => {
      socket.off('newBug', handleNewBug);
    };
  }, [selectedProject]);

  // UseEffect pour mettre à jour le statut d'un bug en temps réel (changé par n'importe quel membre)
  // =============================================
  useEffect(() => {
    const handleStatusUpdated = (updatedBug) => {
      setBugs((prev) =>
        prev.map((bug) =>
          Number(bug.id_bug) === Number(updatedBug.id_bug) ? { ...bug, ...updatedBug } : bug,
        ),
      );
    };

    socket.on('bugStatusUpdated', handleStatusUpdated);

    return () => {
      socket.off('bugStatusUpdated', handleStatusUpdated);
    };
  }, []);

  // UseEffect pour mettre à jour le titre/description d'un bug modifié en temps réel
  // =============================================
  useEffect(() => {
    const handleBugUpdated = (updatedBug) => {
      setBugs((prev) =>
        prev.map((bug) =>
          Number(bug.id_bug) === Number(updatedBug.id_bug) ? { ...bug, ...updatedBug } : bug,
        ),
      );
    };

    socket.on('bugUpdated', handleBugUpdated);

    return () => {
      socket.off('bugUpdated', handleBugUpdated);
    };
  }, []);

  // UseEffect pour retirer un bug supprimé de la liste en temps réel
  // =============================================
  useEffect(() => {
    const handleBugDeleted = ({ id_bug }) => {
      setBugs((prev) => prev.filter((bug) => Number(bug.id_bug) !== Number(id_bug)));
    };

    socket.on('bugDeleted', handleBugDeleted);

    return () => {
      socket.off('bugDeleted', handleBugDeleted);
    };
  }, []);

  // Fonction pour changer le statut d'un bug
  // =============================================
  const handleStatusChange = async (id_bug, status) => {
    const response = await apiFetch(`/project/${selectedProject.id_project}/bug/${id_bug}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    if (!response?.ok) return;

    await response.json();
  };

  // Fonction pour ouvrir la modale d'édition d'un bug (uniquement l'auteur)
  // =============================================
  const openEditModal = (bug) => {
    reset({ title: bug.title, description: bug.description });
    setEditingBug(bug.id_bug);
  };

  // Fonction pour modifier un bug
  // =============================================
  const handleEditSubmit = async (data) => {
    const response = await apiFetch(`/project/${selectedProject.id_project}/bug/${editingBug}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response?.ok) return;

    await response.json();
    setEditingBug(null);
  };

  // Fonction pour supprimer un bug (uniquement le owner du projet)
  // =============================================
  const handleDelete = async (id_bug) => {
    const confirmed = window.confirm('Supprimer ce bug ?');
    if (!confirmed) return;

    const response = await apiFetch(`/project/${selectedProject.id_project}/bug/${id_bug}`, {
      method: 'DELETE',
    });

    if (!response?.ok) return;

    await response.json();
  };

  if (bugs.length === 0) {
    return (
      <section className="rounded-xl bg-(--color-surface) border border-white/10 p-6">
        <p className="text-center text-gray-400">Aucun bug signalé pour le moment.</p>
      </section>
    );
  }

  return (
    <section className="h-130 overflow-y-auto rounded-xl bg-(--color-surface) border border-white/10 p-6">
      <div className="flex flex-col gap-4">
        {bugs.map((bug) => (
          <RowBug
            key={bug.id_bug}
            bug={bug}
            isAuthor={bug.created_by === user?.id}
            isOwner={isOwner}
            onStatusChange={handleStatusChange}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        isOpen={editingBug !== null}
        onClose={() => setEditingBug(null)}
        title="Modifier le bug"
      >
        <form onSubmit={handleSubmit(handleEditSubmit)} className="flex flex-col gap-2">
          <ModalField
            id="edit-title"
            label="Titre :"
            register={register('title', { required: 'titre requis' })}
          />

          <ModalField
            id="edit-description"
            label="Description :"
            textarea
            rows="4"
            register={register('description', { required: 'description requise' })}
          />

          <Button variant="secondary" type="submit">
            Enregistrer
          </Button>
        </form>
      </Modal>
    </section>
  );
}

export default ListBug;
