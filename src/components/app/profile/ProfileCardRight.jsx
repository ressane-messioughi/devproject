import { useState, useEffect } from 'react';
import { useFetch } from '../../../hooks/useFetch.js';

function ProfileCardRight() {
  const [project, setProject] = useState([]);
  const [ownerProject, setOwnerProject] = useState([]);
  const [memberProject, setMemberProject] = useState([]);

  const { apiFetch } = useFetch();
  // Fonction pour récupérer les projets de l'utilisateur
  // =============================================

  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiFetch('/project/my-project', {
          method: 'GET',
        });
        const result = await response.json();
        setOwnerProject(result.filter((item) => item.role === 'OWNER'));
        setMemberProject(result.filter((item) => item.role === 'MEMBER'));
        setProject(result);
      } catch (error) {
        console.error(error);
      }
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);
  return (
    <>
      <section className="flex flex-col min-h-full justify-around gap-4">
        <h2 className="sr-only">Statistiques du profil</h2>
        <div className="flex items-center gap-6 sm:gap-8">
          <p className="w-36 sm:w-48 shrink-0 whitespace-nowrap rounded-lg border border-white/10 bg-(--color-background-secondary) px-3 py-2 font-bold text-sm sm:text-base">
            Projets total :
          </p>
          <p className="font-[Bungee] text-4xl sm:text-6xl text-transparent [-webkit-text-stroke:2px_white]">
            {project.length}
          </p>
        </div>
        <hr className="border-white/10" />
        <div className="flex items-center gap-6 sm:gap-8">
          <p className="w-36 sm:w-48 shrink-0 whitespace-nowrap rounded-lg border border-white/10 bg-(--color-background-secondary) px-3 py-2 font-bold text-sm sm:text-base">
            Projet créé :
          </p>
          <p className="font-[Bungee] text-4xl sm:text-6xl text-transparent [-webkit-text-stroke:2px_white]">
            {ownerProject.length}
          </p>
        </div>
        <hr className="border-white/10" />
        <div className="flex items-center gap-6 sm:gap-8">
          <p className="w-36 sm:w-48 shrink-0 whitespace-nowrap rounded-lg border border-white/10 bg-(--color-background-secondary) px-3 py-2 font-bold text-sm sm:text-base">
            Projet rejoint :
          </p>
          <p className="font-[Bungee] text-4xl sm:text-6xl text-transparent [-webkit-text-stroke:2px_white]">
            {memberProject.length}
          </p>
        </div>
      </section>
    </>
  );
}

export default ProfileCardRight;
