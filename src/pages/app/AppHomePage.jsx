import usePageTitle from '../../hooks/usePageTitle.js';
import MemberOnline from '../../components/app/home/MemberOnline';
import MenuHome from '../../components/app/home/MenuHome';
import { useState, useEffect } from 'react';
import useProject from '../../hooks/useProject';
import { socket } from '../../socket.js';
function AppHomePage() {
  usePageTitle('Tableau De Bord');

  const [connectedUsers, setConnectedUsers] = useState([]);
  const { selectedProject } = useProject();

  // UseEffect pour récupérer les membres connectés du projet à chaque fois que le projet sélectionné change
  // =============================================
  useEffect(() => {
    if (!selectedProject) return;

    const handleConnectedUsers = (users) => {
      setConnectedUsers(users);
    };

    socket.on('connectedUsers', handleConnectedUsers);
    if (selectedProject?.id_project) {
      socket.emit('getConnectedUsers', {
        id_project: selectedProject.id_project,
      });
    }
    return () => {
      socket.off('connectedUsers', handleConnectedUsers);
    };
  }, [selectedProject]);

  return (
    <>
      <section className="flex flex-col gap-20">
        <h1 className="sr-only">Tableau de bord</h1>
        <div className="flex flex-col">
          {selectedProject && (
            <p className="md:hidden text-sm w-xs flex justify-end font-semibold uppercase tracking-wide text-gray-400">
              {selectedProject.name}
            </p>
          )}
          <MemberOnline connectedUsers={connectedUsers} />
        </div>
        <MenuHome />
      </section>
    </>
  );
}

export default AppHomePage;
