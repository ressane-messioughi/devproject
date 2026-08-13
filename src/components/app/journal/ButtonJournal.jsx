import { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch';
import Modal from '../../ui/Modal';
import ModalField from '../../ui/ModalField.jsx';
import Button from '../../ui/Button.jsx';
import { useForm } from 'react-hook-form';
import useProject from '../../../hooks/useProject';

function ButtonJournal() {
  const {
    register,
    handleSubmit,
    // formState: {errors}
  } = useForm({ mode: 'onTouched' });

  // Données centralisé autour du {SelectedProject}
  const { selectedProject } = useProject();

  // Gestion du State pour le Modal
  const [openModal, setOpenModal] = useState(null);

  // ApiFetch
  const { apiFetch } = useFetch();

  // Fonction pour créer un post
  const handleSubmitPost = async (data) => {
    const response = await apiFetch(`/project/${selectedProject.id_project}/journal`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await response.json();
    setOpenModal(null);
  };
  return (
    <>
      <section>
        <div className="w-full bg-(--color-surface) border border-white/10 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg shadow-black/20">
          <div>
            <h2 className="text-2xl font-bold">Journal</h2>
            <p className="text-sm text-gray-400">Suivez activité de votre équipe</p>
          </div>

          <Button onClick={() => setOpenModal('post')}>Ajouter un post</Button>

          <Modal
            isOpen={openModal === 'post'}
            onClose={() => setOpenModal(false)}
            title="Créer un post :"
          >
            <form onSubmit={handleSubmit(handleSubmitPost)} className="flex flex-col gap-2">
              <ModalField
                id="title"
                label="Titre de votre post :"
                register={register('title', {
                  required: 'titre requis',
                })}
              />

              <ModalField
                id="message"
                label="Votre Message :"
                textarea
                rows="6"
                register={register('message', {
                  required: 'message requis',
                })}
              />

              <Button variant="secondary" type="submit">
                Publier
              </Button>
            </form>
          </Modal>
        </div>
      </section>
    </>
  );
}

export default ButtonJournal;
