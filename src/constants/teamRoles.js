export const TEAM_ROLES = [
  'Développeur Front',
  'Développeur Back',
  'Développeur Fullstack',
  'DevOps',
  'Lead',
  'Scrum',
];

// Effet "néon" très atténué : fond sombre, bordure et texte en couleur, halo à peine perceptible
export const TEAM_ROLE_COLORS = {
  'Développeur Front':
    'bg-black/70 text-blue-400 border-blue-400/60 shadow-[0_0_3px_0px_rgba(96,165,250,0.2),0_0_6px_1px_rgba(96,165,250,0.08)]',
  'Développeur Back':
    'bg-black/70 text-purple-400 border-purple-400/60 shadow-[0_0_3px_0px_rgba(192,132,252,0.2),0_0_6px_1px_rgba(192,132,252,0.08)]',
  'Développeur Fullstack':
    'bg-black/70 text-cyan-400 border-cyan-400/60 shadow-[0_0_3px_0px_rgba(34,211,238,0.2),0_0_6px_1px_rgba(34,211,238,0.08)]',
  DevOps:
    'bg-black/70 text-orange-400 border-orange-400/60 shadow-[0_0_3px_0px_rgba(251,146,60,0.2),0_0_6px_1px_rgba(251,146,60,0.08)]',
  Lead: 'bg-black/70 text-amber-400 border-amber-400/60 shadow-[0_0_3px_0px_rgba(251,191,36,0.2),0_0_6px_1px_rgba(251,191,36,0.08)]',
  Scrum:
    'bg-black/70 text-green-400 border-green-400/60 shadow-[0_0_3px_0px_rgba(74,222,128,0.2),0_0_6px_1px_rgba(74,222,128,0.08)]',
};

// Taille compacte commune aux badges de rôle (TeamMemberCard, ListPost)
export const TEAM_ROLE_BADGE_SIZE = 'text-[12px] px-4 py-1 leading-none';
