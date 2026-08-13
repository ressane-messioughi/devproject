import { useEffect } from 'react';

const SITE_NAME = 'DevProject';

// Met à jour le titre de l'onglet quand la page s'affiche.
// C'est le premier élément annoncé par un lecteur d'écran (critère RGAA 8.6),
// et dans une application React le titre ne change pas tout seul d'une route
// à l'autre : il faut le faire à la main.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
