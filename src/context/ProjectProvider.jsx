import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import ProjectContext from './ProjectContext';
import { socket } from '../socket.js';
import { AuthContext } from './AuthContext.js';
import { toast } from 'react-toastify';
import CustomToast from '../components/ui/CustomToast.jsx';

export default function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const [selectedProject, setSelectedProject] = useState(() => {
    const project = localStorage.getItem('selectedProject');

    return project ? JSON.parse(project) : null;
  });

  // Vide le contexte projet à la déconnexion (voir AuthProvider.jsx : événement custom
  // car AuthProvider est un ancêtre de ProjectProvider, pas l'inverse — pas d'accès direct)
  // =============================================
  useEffect(() => {
    const handleLogout = () => {
      setProjects([]);
      setSelectedProject(null);
    };

    window.addEventListener('app:logout', handleLogout);

    return () => {
      window.removeEventListener('app:logout', handleLogout);
    };
  }, []);

  // UseEffect pour gérer le changement de projet sélectionné et rejoindre la salle du projet via socket.io
  // =============================================
  useEffect(() => {
    if (!selectedProject) {
      socket.emit('leaveProjectRoom');
      localStorage.removeItem('selectedProject');
      return;
    }
    socket.emit('joinProjectRoom', { id_project: selectedProject.id_project, user });
    localStorage.setItem('selectedProject', JSON.stringify(selectedProject));
  }, [selectedProject, user]);

  // Reprise après reconnexion WebSocket (coupure réseau, mise en veille...) : Socket.IO
  // reconnecte automatiquement le transport, mais ne remet jamais l'utilisateur dans les
  // salles qu'il avait quittées à la déconnexion — sans ça, les notifications et les mises
  // à jour en temps réel s'arrêtent silencieusement jusqu'au rafraîchissement de la page.
  // =============================================
  useEffect(() => {
    const handleReconnect = () => {
      if (user?.id) {
        socket.emit('identify', { user_id: user.id });
      }
      if (selectedProject) {
        socket.emit('joinProjectRoom', { id_project: selectedProject.id_project, user });
      }
    };

    socket.on('connect', handleReconnect);

    return () => {
      socket.off('connect', handleReconnect);
    };
  }, [user, selectedProject]);

  // Notification connexion membre du projet
  useEffect(() => {
    const handleUserConnected = (user) => {
      toast(
        <CustomToast
          avatar={user.avatar}
          message={
            <>
              <span className="font-bold text-amber-400">{user.username}</span>{' '}
              <span>est en ligne</span>{' '}
            </>
          }
        />,
      );
    };

    socket.on('userConnected', handleUserConnected);

    return () => {
      socket.off('userConnected', handleUserConnected);
    };
  }, []);

  // Notification du post par un membre dans le Journal
  useEffect(() => {
    if (!selectedProject) return;

    const handleJournalNotification = (data) => {
      if (Number(data.project_id) !== Number(selectedProject.id_project)) return;

      toast(
        <CustomToast
          avatar={data.avatar}
          message={
            <>
              <span className="font-bold text-amber-400">{data.username}</span>
              <span> a publié : </span>
              <span className="text-amber-400 font-bold">{data.title}</span>
              <span> dans le journal </span>
            </>
          }
        />,
      );
    };

    socket.on('journalNotification', handleJournalNotification);

    return () => {
      socket.off('journalNotification', handleJournalNotification);
    };
  }, [selectedProject]);

  // Notification d'un membre qui rejoint le projet
  useEffect(() => {
    if (!selectedProject) return;

    const handleMemberJoined = (member) => {
      if (Number(member.project_id) !== Number(selectedProject.id_project)) {
        return;
      }

      toast(
        <CustomToast
          avatar={member.avatar}
          message={
            <>
              <span className="font-bold text-amber-400">{member.username}</span>
              <span> à rejoint le projet.</span>
            </>
          }
        />,
      );
    };
    socket.off('memberJoinedProject');
    socket.on('memberJoinedProject', handleMemberJoined);

    return () => {
      socket.off('memberJoinedProject', handleMemberJoined);
    };
  }, [selectedProject]);

  // Notification d'un membre qui quitte le projet
  useEffect(() => {
    if (!selectedProject) return;

    const handleMemberLeft = (member) => {
      if (Number(member.project_id) !== Number(selectedProject.id_project)) return;

      toast(
        <CustomToast
          avatar={member.avatar}
          message={
            <>
              <span className="font-bold text-amber-400">{member.username}</span>
              <span> a quitté le projet.</span>
            </>
          }
        />,
      );
    };

    socket.off('memberLeftProject');
    socket.on('memberLeftProject', handleMemberLeft);

    return () => {
      socket.off('memberLeftProject', handleMemberLeft);
    };
  }, [selectedProject]);

  // Notification du signalement d'un bug par un membre
  useEffect(() => {
    if (!selectedProject) return;

    const handleBugNotification = (data) => {
      if (Number(data.project_id) !== Number(selectedProject.id_project)) return;

      toast(
        <CustomToast
          avatar={data.avatar}
          message={
            <>
              <span className="font-bold text-amber-400">{data.username}</span>
              <span> a signalé un bug : </span>
              <span className="text-amber-400 font-bold">{data.title}</span>
            </>
          }
        />,
      );
    };

    socket.on('bugNotification', handleBugNotification);

    return () => {
      socket.off('bugNotification', handleBugNotification);
    };
  }, [selectedProject]);

  // Retrait forcé d'un projet par le owner : vide le projet sélectionné s'il correspond,
  // puisque l'accès aux données de ce projet n'existe plus
  // =============================================
  useEffect(() => {
    const handleMemberRemoved = (data) => {
      setProjects((prev) => prev.filter((p) => Number(p.id_project) !== Number(data.project_id)));
      setSelectedProject((prev) =>
        prev && Number(prev.id_project) === Number(data.project_id) ? null : prev,
      );

      toast(<CustomToast message={<span>Vous avez été retiré d&apos;un projet.</span>} />);
    };

    socket.on('memberRemoved', handleMemberRemoved);

    return () => {
      socket.off('memberRemoved', handleMemberRemoved);
    };
  }, []);

  // Notification + rejoint automatiquement le projet quand une demande d'adhésion est acceptée
  // =============================================
  useEffect(() => {
    const handleJoinRequestAccepted = (project) => {
      setProjects((prev) => [...prev, project]);
      setSelectedProject(project);

      toast(
        <CustomToast
          message={
            <>
              <span>Vous avez rejoint le projet </span>
              <span className="font-bold text-amber-400">{project.name}</span>
              <span> !</span>
            </>
          }
        />,
      );
    };

    socket.on('joinRequestAccepted', handleJoinRequestAccepted);

    return () => {
      socket.off('joinRequestAccepted', handleJoinRequestAccepted);
    };
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

ProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
