// import { Edit, Trash, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useProject from '../../../hooks/useProject.js';
import useIsOwner from '../../../hooks/useIsOwner.js';
import { useFetch } from '../../../hooks/useFetch.js';
import Avatar from '../../ui/Avatar.jsx';
import IconButton from '../../ui/IconButton.jsx';
import Button from '../../ui/Button.jsx';
import Modal from '../../ui/Modal.jsx';
import { Check, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import CustomToast from '../../ui/CustomToast.jsx';
import { socket } from '../../../socket.js';

function TeamToolsBar({ onMemberAccepted }) {
  const [project, setProject] = useState([]);
  const { apiFetch } = useFetch();
  const { selectedProject } = useProject();
  const isOwner = useIsOwner();
  const [openModal, setOpenModal] = useState(null);
  const [request, setRequest] = useState([]);

  // UseEffect pour récupérer le TeamCode du projet
  // =============================================
  useEffect(() => {
    async function getProjectCode() {
      if (!selectedProject) return;

      const response = await apiFetch(`/project/${selectedProject.id_project}`);

      if (!response?.ok) return;

      const data = await response.json();

      setProject(data);
    }

    getProjectCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  // useEffect pour récupérer les demandes d'accès à un projet
  // =============================================
  useEffect(() => {
    async function getRequestByProject() {
      if (!selectedProject) return;

      const response = await apiFetch(`/project/${selectedProject.id_project}/requests`, {
        method: 'GET',
      });
      const result = await response.json();
      const pendingRequests = result.filter((request) => request.status === 'PENDING');
      if (pendingRequests.length === 0) {
        <p>Aucune demande pour le moment ..</p>;
        return;
      }
      setRequest(pendingRequests);
    }
    getRequestByProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  //UseEffect refresh la liste des demandes d'accès à un projet après l'acceptation d'un membre
  // =============================================
  useEffect(() => {
    if (!selectedProject) return;

    const handleNewJoinRequest = (newRequest) => {
      if (Number(newRequest.project_id) !== Number(selectedProject.id_project)) return;

      setRequest((prev) => [newRequest, ...prev]);
    };

    socket.on('newJoinRequest', handleNewJoinRequest);

    return () => {
      socket.off('newJoinRequest', handleNewJoinRequest);
    };
  }, [selectedProject]);
  // Fonction pour accepter une demande d'accès à un projet
  // =============================================
  const handleSubmitAccept = async (id_request) => {
    const currentRequest = request.find((item) => item.id_request === id_request);
    const response = await apiFetch(
      `/project/${selectedProject.id_project}/requests/${id_request}/accept`,
      {
        method: 'PUT',
      },
    );
    await response.json();
    setRequest((prev) => prev.filter((request) => request.id_request !== id_request));
    <CustomToast message={`${currentRequest?.firstname} accepté`} />;
    onMemberAccepted();
  };

  // Fonction pour refuser une demande d'accès à un projet
  // =============================================
  async function handleSubmitRefuse(id_request) {
    const response = await apiFetch(
      `/project/${selectedProject.id_project}/requests/${id_request}/refuse`,
      {
        method: 'PUT',
      },
    );
    await response.json();
    setRequest((prev) => prev.filter((request) => request.id_request !== id_request));
  }
  return (
    <>
      {project.map((projects) => (
        <section
          className="static p-6 md:p-0 rounded-lg md:rounded-none md:fixed md:right-0 md:top-0 w-full md:w-60 md:h-screen mb-6 md:mb-0 bg-(--color-surface) border-l border-white/10 "
          key={projects.id}
        >
          <div className="flex flex-col items-center mt-10 gap-10 h-full w-full">
            <div className="flex flex-col justify-center items-center w-full text-center">
              <div className="bg-(--color-background-secondary) w-full">
              <h2 className="text-center border-b border-white/10 border-2 border-t font-bold">
                {projects.name}
              </h2></div>
              <QRCode
                className="w-40"
                value={`${import.meta.env.VITE_APP_URL}/join/${projects.team_code}`}
              />
              <h3 className="bg-(--color-background-secondary) w-fit p-2 text-center border-white/10 border-2">
                {projects.team_code}
              </h3>
            </div>
            <Button onClick={() => setOpenModal('request')} size="sm">
              Voir les demandes reçus
            </Button>
            <Modal
              isOpen={openModal === 'request'}
              onClose={() => setOpenModal(false)}
              title="Liste des demandes d'accès"
            >
              {request.length === 0 ? (
                <p>Aucune demande pour le moment ...</p>
              ) : (
                request.map((requests) => (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 bg-(--color-background-secondary) rounded-lg p-3 border border-white/10"
                    key={requests.id_request}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={requests.avatar}
                        username={requests.username}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border border-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm sm:text-base truncate">
                          {requests.username}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          {requests.lastname} {requests.firstname}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <IconButton
                        color="green"
                        onClick={() => handleSubmitAccept(requests.id_request)}
                        disabled={!isOwner}
                        aria-label="Accepter la demande"
                      >
                        <Check />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSubmitRefuse(requests.id_request)}
                        disabled={!isOwner}
                        aria-label="Refuser la demande"
                      >
                        <X />
                      </IconButton>
                    </div>
                  </div>
                ))
              )}
            </Modal>
            {/* <button className="bg-amber-900 w-30 h-10 flex justify-center items-center rounded-xs cursor-pointer  borde-white/10 shadow-md shadow-black hover:bg-amber-800">
              <Edit />
            </button>
            <button className="bg-red-900 w-30 h-10 flex justify-center items-center rounded-xs cursor-pointer  borde-white/10 shadow-md shadow-black hover:bg-red-800">
              <Trash />
            </button> */}
          </div>
        </section>
      ))}
    </>
  );
}

TeamToolsBar.propTypes = {
  onMemberAccepted: PropTypes.func.isRequired,
};

export default TeamToolsBar;
