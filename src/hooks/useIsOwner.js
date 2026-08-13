import useProject from './useProject.js';

// Hook pour savoir si l'utilisateur connecté est le OWNER du projet actuellement sélectionné.
// Le rôle est déjà présent sur chaque projet renvoyé par /project/my-project (voir project.model.js findByUserId).
export default function useIsOwner() {
  const { selectedProject } = useProject();
  return selectedProject?.role === 'OWNER';
}
