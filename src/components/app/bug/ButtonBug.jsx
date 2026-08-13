import { useState } from 'react';
import { useFetch } from '../../../hooks/useFetch.js';
import Modal from '../../ui/Modal.jsx';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import AlertBanner from '../../ui/AlertBanner.jsx';
import ModalField from '../../ui/ModalField.jsx';
import { MODAL_FILE_CLASS } from '../../../constants/formClasses.js';
import Button from '../../ui/Button.jsx';
import useProject from '../../../hooks/useProject.js';
import { getErrorMessage } from '../../../utils/getErrorMessage.js';

const STATUS_OPTIONS = [
  { value: 'BUG', label: 'Bug' },
  { value: 'EN COURS', label: 'En cours' },
  { value: 'OK', label: 'Résolu' },
];

function ButtonBug() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onTouched' });

  // Données centralisé autour du {SelectedProject}
  const { selectedProject } = useProject();

  // Gestion du State pour le Modal
  const [openModal, setOpenModal] = useState(null);
  const [apiError, setApiError] = useState('');

  // ApiFetch
  const { apiFetch } = useFetch();

  // Fonction pour signaler un bug (upload de la capture d'écran vers Cloudinary)
  const handleSubmitBug = async (data) => {
    setApiError('');
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('file', data.file[0]);

    const response = await apiFetch(`/project/${selectedProject.id_project}/bug`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      setApiError(getErrorMessage(result, 'Impossible de signaler ce bug.'));
      toast.error(getErrorMessage(result, 'Impossible de signaler ce bug.'));
      return;
    }

    toast.success('Bug signalé avec succès !');
    reset();
    setOpenModal(null);
  };

  return (
    <>
      <section>
        <div className="w-full bg-(--color-surface) border border-white/10 rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg shadow-black/20">
          <div>
            <h2 className="text-2xl font-bold">Bugs</h2>
            <p className="text-sm text-gray-400">Suivi des anomalies remontées par l&apos;équipe</p>
          </div>

          <Button onClick={() => setOpenModal('bug')}>Signaler un bug</Button>

          <Modal
            isOpen={openModal === 'bug'}
            onClose={() => setOpenModal(false)}
            title="Signaler un bug :"
          >
            <form onSubmit={handleSubmit(handleSubmitBug)} className="flex flex-col gap-2">
              <AlertBanner message={apiError} />

              <ModalField
                id="title"
                label="Titre :"
                register={register('title', { required: 'Titre requis' })}
                error={errors.title}
              />

              <ModalField
                id="description"
                label="Description :"
                textarea
                rows="4"
                register={register('description', { required: 'Description requise' })}
                error={errors.description}
              />

              <ModalField
                id="status"
                label="Statut :"
                defaultValue="BUG"
                options={STATUS_OPTIONS}
                register={register('status', { required: true })}
              />

              <ModalField
                id="file"
                label="Capture d'écran :"
                type="file"
                className={MODAL_FILE_CLASS}
                register={register('file', { required: "Capture d'écran requise" })}
                error={errors.file}
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

export default ButtonBug;
