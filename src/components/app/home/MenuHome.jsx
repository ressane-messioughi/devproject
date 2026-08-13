/* eslint-disable react-hooks/exhaustive-deps */
import dashboard from '/icon/dashboard.png';
import teamwork from '/icon/teamwork.png';
import journal from '/icon/journal.png';
import bug from '/icon/bug.png';
import GithubTrello from '/icon/githubTrello.png';
import agile from '/icon/agile.png';
import parametres from '/icon/parametres.png';
import shemas from '/icon/shemas.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { container, item } from '../../ui/PageAnimation.jsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../ui/Modal.jsx';
import MenuTile from '../../ui/MenuTile.jsx';
import ModalField from '../../ui/ModalField.jsx';
import ReadOnlyField from '../../ui/ReadOnlyField.jsx';
import Button from '../../ui/Button.jsx';
import { MODAL_INPUT_SM_CLASS } from '../../../constants/formClasses.js';
import useProject from '../../../hooks/useProject.js';
import { useFetch } from '../../../hooks/useFetch.js';
import logoGit from '/icon/github.png';
import logoTrello from '/icon/trello.png';

function MenuHome() {
  const [openModal, setOpenModal] = useState(null);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const { selectedProject } = useProject();
  const [project, setProject] = useState([]);
  const { apiFetch } = useFetch();
  const [github, setGithub] = useState([]);
  const { register, handleSubmit, reset } = useForm({ mode: 'onTouched' });

  // Fonction pour récupérer les données de github_repository

  const fetchDataGithub = async () => {
    if (!selectedProject) return;
    const response = await apiFetch(`/project/${selectedProject.id_project}/github`, {
      method: 'GET',
    });
    const result = await response.json();
    setGithub(result.result);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDataGithub();
  }, [selectedProject]);

  // Fonction pour ajouter un répertoire GitHub au projet
  // =============================================
  const handleAddRepo = async (data) => {
    const response = await apiFetch(`/project/${selectedProject.id_project}/github`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response?.ok) return;

    await response.json();
    reset();
    setShowAddRepo(false);
    fetchDataGithub();
  };

  // Fonction pour récupérer les données du projet

  const fecthDataProject = async () => {
    const response = await apiFetch(`/project/${selectedProject.id_project}`, {
      method: 'GET',
    });
    const result = await response.json();

    setProject(result[0]);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fecthDataProject();
  }, [selectedProject]);
  return (
    <>
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={item}>
          <section className="flex flex-col gap-4 md:gap-20">
            <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-4 sm:gap-6 md:gap-10">
              <MenuTile to="/panel" icon={dashboard} label="Dashboard" />
              <MenuTile to="/team" icon={teamwork} label="Gestion équipe" />
              <MenuTile to="/journal" icon={journal} label="Journal" />

              <MenuTile
                onClick={() => setOpenModal('githubTrello')}
                icon={GithubTrello}
                label="GitHub & Trello"
              />
              <Modal
                isOpen={openModal === 'githubTrello'}
                onClose={() => setOpenModal(false)}
                title="GitHub / Trello"
              >
                <section className="flex flex-col gap-2">
                  {github.map((git) => (
                    <div key={git.id_repository} className="w-full flex flex-col">
                      <label htmlFor="github" className="font-extrabold">
                        {git.name}
                      </label>
                      <div className="flex items-center gap-3">
                        <Link to={git.url}>
                          <img
                            src={logoGit}
                            className="w-17 h-15 p-2 bg-(--color-background-secondary) cursor-pointer hover:bg-white rounded-md "
                            alt="Ouvrir le dépôt GitHub"
                          />
                        </Link>
                        <ReadOnlyField id="github" name="github" value={git.url} />
                      </div>
                    </div>
                  ))}

                  {showAddRepo ? (
                    <form
                      onSubmit={handleSubmit(handleAddRepo)}
                      className="w-full flex flex-col gap-2 border-t border-white/10 pt-3"
                    >
                      <ModalField
                        id="repo-name"
                        label="Nom du dépôt :"
                        className={MODAL_INPUT_SM_CLASS}
                        register={register('name', { required: 'nom requis' })}
                      />

                      <ModalField
                        id="repo-url"
                        label="URL du dépôt :"
                        type="url"
                        placeholder="https://github.com/..."
                        className={MODAL_INPUT_SM_CLASS}
                        register={register('url', { required: 'URL requise' })}
                      />

                      <ModalField
                        id="repo-branch"
                        label="Branche :"
                        placeholder="main"
                        className={MODAL_INPUT_SM_CLASS}
                        register={register('branch', { required: 'branche requise' })}
                      />

                      <div className="flex gap-2 mt-1">
                        <Button variant="secondary" size="sm" type="submit" className="flex-1">
                          Ajouter
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowAddRepo(false)}>
                          Annuler
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button size="sm" onClick={() => setShowAddRepo(true)} className="w-full">
                      + Ajouter un dépôt GitHub
                    </Button>
                  )}

                  <div>
                    <label htmlFor="trello" className="font-extrabold">
                      Trello
                    </label>
                    <div className="flex items-center gap-3">
                      <Link to={project?.trello_url}>
                        <img
                          src={logoTrello}
                          alt="Ouvrir Trello"
                          className="w-17 h-15 p-2 bg-(--color-background-secondary) cursor-pointer hover:bg-white rounded-md"
                        />
                      </Link>
                      <ReadOnlyField id="trello" name="trello" value={project?.trello_url} />
                    </div>
                  </div>
                </section>
              </Modal>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-4 sm:gap-6 md:gap-10">
              <MenuTile to="/bug" icon={bug} label="Bug" />
              <MenuTile to="/sprint" icon={agile} label="Sprint" />
              <MenuTile to="/schemas" icon={shemas} label="Schémas" />
              <MenuTile to="/parametres" icon={parametres} label="Paramètres" />
            </div>
          </section>
        </motion.div>
      </motion.section>
    </>
  );
}

export default MenuHome;
