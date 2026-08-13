/* eslint-disable react-hooks/exhaustive-deps */
import { useFetch } from '../../../hooks/useFetch';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import Delete from '/icon/delete.png';
import IconButton from '../../ui/IconButton.jsx';
import { toast } from 'react-toastify';
import useProject from '../../../hooks/useProject';
// import {socket} from "../../../socket.js"

function ListProject({ ProjectDelete }) {
  const { apiFetch } = useFetch();
  const { projects, setProjects, setSelectedProject, selectedProject } = useProject();

  // Fonction pour récupérer les projets de l'utilisateur
  // =============================================
  const fetchData = async () => {
    try {
      const response = await apiFetch('/project/my-project', {
        method: 'GET',
      });
      const result = await response.json();

      setProjects(result);
    } catch (error) {
      console.error(error);
    }
  };
  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    fetchData();
  }, []);

  // Fonction pour quitter un projet (membre) ou le supprimer définitivement (owner)
  // =============================================
  const handleDelete = async (team_id, id_project, role) => {
    const currentProject = projects.find((item) => item.id_project === id_project);

    if (role === 'OWNER') {
      const confirmed = window.confirm(
        `Supprimer définitivement le projet "${currentProject?.name}" ainsi que le journal, les schémas, les tâches, les sprints et les bugs liés ? Cette action est irréversible.`,
      );
      if (!confirmed) return;

      const response = await apiFetch(`/project/${id_project}`, {
        method: 'DELETE',
      });
      if (!response?.ok) return;
      await response.json();
      toast.success(`Projet ${currentProject?.name} supprimé avec succès !`);
    } else {
      const confirmed = window.confirm(`Quitter le projet "${currentProject?.name}" ?`);
      if (!confirmed) return;

      const response = await apiFetch(`/project/${id_project}/team/${team_id}`, {
        method: 'DELETE',
      });
      if (!response?.ok) return;
      await response.json();
      toast.success(`Vous avez quitté le projet ${currentProject?.name}`);
    }

    const removeProject = projects.filter((project) => project.id_project !== id_project);
    setProjects(removeProject);

    if (selectedProject?.id_project === id_project) {
      const nextProject = removeProject[0] || null;

      setSelectedProject(nextProject);
      if (nextProject) {
        localStorage.setItem('selectedProject', JSON.stringify(nextProject));
      } else {
        localStorage.removeItem('selectedProject');
      }
    }
    ProjectDelete();
  };

  return (
    <>
      <section className="bg-(--color-surface) border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/30">
        <div className="p-5 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Mes projets</h2>
            <p className="text-sm text-gray-400">{projects.length} projet(s)</p>
          </div>
        </div>

        <div className="md:hidden flex flex-col divide-y divide-white/10">
          {projects.map((item) => (
            <div key={item.id_project} className="p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
              <IconButton
                onClick={() => handleDelete(item.team_id, item.id_project, item.role)}
                className="shrink-0 flex items-center justify-center w-10 h-10"
              >
                <img src={Delete} className="w-5" alt="Supprimer" />
              </IconButton>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-(--color-background-secondary)">
              <tr className="text-left text-gray-300 border-b border-white">
                <th className="p-4">Nom</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((item) => (
                <tr
                  key={item.id_project}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-semibold">{item.name}</td>
                  <td className="p-4 text-gray-300">{item.description}</td>
                  <td className="p-4">
                    <IconButton
                      onClick={() => handleDelete(item.team_id, item.id_project, item.role)}
                      className="mx-auto flex items-center justify-center w-10 h-10"
                    >
                      <img src={Delete} className="w-5" alt="Supprimer" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

ListProject.propTypes = {
  ProjectDelete: PropTypes.func.isRequired,
};

export default ListProject;
