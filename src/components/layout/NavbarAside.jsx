import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo.png';
import { Crown, LogOut, Menu, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import PictureDefault from '/icon/user.svg';
import Avatar from '../ui/Avatar.jsx';
import useProject from '../../hooks/useProject.js';
import useIsOwner from '../../hooks/useIsOwner.js';
import { useFetch } from '../../hooks/useFetch';
function NavbarAside() {
  const { userInfo, user, isLoggedIn, logout } = useContext(AuthContext);
  const { projects, setProjects, selectedProject, setSelectedProject } = useProject();
  const isOwner = useIsOwner();
  const { apiFetch } = useFetch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // UseEffect pour récupérer les projets de l'utilisateur à chaque fois que l'utilisateur se connecte
  // =============================================
  useEffect(() => {
    async function getProjects() {
      const response = await apiFetch('/project/my-project');

      if (!response?.ok) return;

      const data = await response.json();

      setProjects(data);

      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0]);
      }
    }

    if (isLoggedIn) {
      getProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  useEffect(() => {
    userInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoggedIn && (
        <>
          <button
            className="md:hidden fixed top-4 left-4 z-[60] bg-gray-900 text-white p-3 rounded-xl shadow-lg shadow-black/50 border border-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <aside
            className={`fixed top-0 left-0 w-60 h-dvh bg-(--color-surface) border-r border-white/8 flex flex-col gap-16 items-center overflow-y-auto z-50 transition-transform duration-300 md:translate-x-0 ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div>
              <img src={logo} alt="Logo" />
              <div className="px-4 py-3">
                <label htmlFor="project-select" className="text-sm text-gray-300">
                  Projet actif
                </label>

                <select
                  id="project-select"
                  className="w-full mt-2 p-2 rounded bg-gray-800 text-white"
                  value={selectedProject?.id_project || ''}
                  onChange={(e) => {
                    const project = projects.find(
                      (project) => project.id_project === Number(e.target.value),
                    );

                    setSelectedProject(project);
                  }}
                >
                  {projects.map((project) => (
                    <option key={project.id_project} value={project.id_project}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <nav className="flex flex-col justify-center text-base w-full gap-4">
              <Link
                to="/panel"
                className="text-(--color-text-secondary) text-center no-underline p-4 rounded-xl w-full transition duration-200 hover:bg-white/5 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/project"
                className="text-(--color-text-secondary) text-center no-underline p-4 rounded-xl w-full transition duration-200 hover:bg-white/5 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Mes projets
              </Link>
              <Link
                to="/me"
                className="text-(--color-text-secondary) text-center no-underline p-4 rounded-xl w-full transition duration-200 hover:bg-white/5 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Mon profil
              </Link>
            </nav>

            <footer className="flex flex-col items-center gap-8 w-full mt-auto">
              <div className="w-full flex items-center flex-col">
                <Avatar
                  src={user?.avatar}
                  fallback={PictureDefault}
                  username={user?.username || 'utilisateur'}
                  className="w-25 h-25 rounded-full object-cover p-[5px] border-2 border-(--color-primary) mb-10"
                />
                <span className="text-white text-center bg-(--color-background) py-2 px-4 w-full text-base font-bold border border-white/8 inline-flex items-center justify-center gap-1.5">
                  {user?.username}
                  {isOwner && (
                    <Crown
                      className="text-amber-400 shrink-0"
                      size={16}
                      aria-label="Propriétaire du projet"
                    />
                  )}
                </span>
                <button
                  onClick={logout}
                  aria-label="Se déconnecter"
                  className="bg-red-900 w-full text-white hover:bg-red-800 flex justify-center items-center h-15 hover:cursor-pointer"
                >
                  <LogOut />
                </button>
                <p className="text-center text-sm">DevProject V1.0</p>
              </div>
            </footer>
          </aside>
        </>
      )}
    </>
  );
}

export default NavbarAside;
