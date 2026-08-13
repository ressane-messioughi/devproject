# DevProject — Frontend

Application web collaborative de gestion de projet : équipes, journal de bord, suivi de bugs et notifications en temps réel.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white)

---

## À propos

DevProject est mon **projet de fin de formation**, présenté pour l'obtention du titre professionnel **DWWM** (Développeur Web et Web Mobile).

L'idée de départ vient d'un constat simple : quand on travaille à plusieurs sur un projet, l'information se disperse. Les décisions se prennent sur une messagerie, les bugs se notent dans un coin, et personne ne sait vraiment qui fait quoi. DevProject rassemble tout ça au même endroit, avec des notifications instantanées pour que l'équipe reste synchronisée sans avoir à rafraîchir la page.

Ce dépôt contient **le frontend**. Le backend est ici : [DevPROject-Backend](https://github.com/ressane-messioughi/DevPROject-Backend).

---

## Aperçu

### Page d'accueil

![Maquette de la page d'accueil](docs/maquettes/accueil.png)

### Connexion

![Maquette de la page de connexion](docs/maquettes/connexion.png)

### Tableau de bord

![Maquette du tableau de bord](docs/maquettes/tableau-de-bord.png)

### Gestion des projets

![Maquette de la page projets](docs/maquettes/projets.png)

### Équipe

![Maquette de la page équipe](docs/maquettes/equipe.png)

### Profil

![Maquette de la page profil](docs/maquettes/profil.png)

---

## Fonctionnalités

**Authentification** — Inscription et connexion par JWT, mot de passe haché en base avec bcrypt, routes protégées par rôle côté React.

**Projets** — Création d'un projet, ou adhésion à un projet existant via un code d'équipe ou un lien d'invitation. Le propriétaire valide les demandes.

**Équipe** — Chaque membre porte un rôle métier propre au projet (développeur front, back, designer…), distinct de son rôle applicatif. Le propriétaire peut modifier ces rôles et retirer un membre.

**Journal de bord** — Publications datées, éditables et supprimables, pour tracer les décisions et l'avancement.

**Suivi des bugs** — Signalement avec pièce jointe, changement de statut, édition et suppression.

**Temps réel** — Arrivées et départs de membres, nouvelles publications, nouveaux bugs, demandes d'adhésion acceptées : tout arrive instantanément, sans rechargement.

**Profil** — Photo de profil hébergée sur Cloudinary, informations personnelles modifiables, statistiques de projets.

---

## Stack technique

| Domaine | Choix | Pourquoi |
| --- | --- | --- |
| Bibliothèque UI | React 19 | Composants et état, avec les hooks |
| Build | Vite 8 | Démarrage instantané, build rapide |
| Styles | Tailwind CSS 4 | Aucune feuille CSS personnalisée, tout est dans le JSX |
| Routage | React Router 7 | Routes imbriquées et protection par rôle |
| Formulaires | React Hook Form | Validation déclarative, peu de rendus |
| Temps réel | Socket.IO client | Salles par projet, reconnexion automatique |
| Notifications | React Toastify | Retours visuels non bloquants |
| Animations | Framer Motion | Transitions entre les pages |
| Qualité | ESLint · Prettier · Husky · lint-staged | Vérification automatique avant chaque commit |

---

## Architecture du projet

```
src/
├── components/
│   ├── ui/          Design system : Button, Avatar, FormField, Modal…
│   ├── auth/        Formulaires de connexion et d'inscription
│   ├── layout/      Structure du tableau de bord et navigation
│   ├── landing/     Page d'accueil publique
│   └── app/         Un dossier par module métier
│       ├── bug/  home/  journal/  profile/  project/  team/
├── pages/
│   ├── app/         Pages protégées du tableau de bord
│   └── …            Accueil, connexion, inscription, 404
├── context/         AuthProvider et ProjectProvider
├── hooks/           useFetch, usePageTitle, useIsOwner, PrivateRoute
├── constants/       Valeurs partagées (rôles, classes de formulaire)
├── utils/           Fonctions utilitaires
└── socket.js        Instance Socket.IO unique, partagée
```

Le découpage sépare **le design system** (`ui/`, sans logique métier) des **modules fonctionnels** (`app/`, un dossier par domaine). Un composant de `ui/` ne connaît rien au projet : il reçoit tout par props et peut être réutilisé partout.

---

## Prise en main

### Prérequis

- **Node.js 20** ou plus récent
- Le [backend](https://github.com/ressane-messioughi/DevPROject-Backend) démarré
- Une base **MySQL** accessible (via XAMPP, MAMP ou une installation locale)

### Installation

```bash
git clone https://github.com/ressane-messioughi/devproject-frontend.git
cd devproject-frontend
npm install
```

### Variables d'environnement

Copiez le fichier d'exemple puis renseignez-le :

```bash
cp .env.example .env
```

| Variable | Rôle | Exemple |
| --- | --- | --- |
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3000/api` |
| `VITE_SOCKET_URL` | URL du serveur Socket.IO | `http://localhost:3000` |
| `VITE_APP_URL` | URL du front, pour les liens d'invitation | `http://localhost:5173` |

> ⚠️ Le préfixe `VITE_` est **obligatoire** : sans lui, Vite n'expose pas la variable au navigateur et vous obtiendrez `undefined` à l'exécution.

### Lancer

```bash
npm run dev
```

L'application démarre sur `http://localhost:5173`.

---

## Scripts disponibles

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Analyse ESLint |
| `npm run lint:fix` | Analyse ESLint avec correction automatique |
| `npm run format` | Formate tout le projet avec Prettier |

---

## Le temps réel, expliqué

C'est la partie la plus intéressante du projet, et celle qui m'a demandé le plus de mise au point.

**Une seule connexion.** `src/socket.js` crée l'instance Socket.IO dans un module ES : comme un module n'est évalué qu'une fois, tous les composants qui l'importent partagent la même connexion. Ouvrir une connexion par composant serait une erreur coûteuse.

**Deux espaces par utilisateur.** Chacun rejoint une salle personnelle `user_<id>`, qui permet de le notifier directement même s'il n'a sélectionné aucun projet — indispensable pour lui annoncer que sa demande d'adhésion vient d'être acceptée. Puis il rejoint la salle `project_<id>` du projet sélectionné.

**Deux façons de diffuser**, à ne pas confondre :

```js
socket.to(room).emit(…)   // tous les autres membres, sauf l'émetteur
io.to(room).emit(…)       // tout le monde, émetteur compris
```

La première annonce une arrivée — inutile de se prévenir soi-même. La seconde rediffuse la liste des membres connectés, que tout le monde doit recevoir à jour.

**Deux bugs corrigés en cours de route.** Le premier : en changeant de projet, l'ancienne salle n'était jamais quittée, et l'utilisateur restait affiché « en ligne » dans un projet qu'il avait pourtant abandonné. Le second, plus discret : après une coupure réseau ou une mise en veille, Socket.IO rétablit bien le transport mais ne rejoint aucune salle — les notifications s'arrêtaient **en silence** jusqu'au rechargement de la page. Le correctif écoute l'événement `connect` et rejoue l'entrée dans les salles.

---

## Conventions de code

- **Composants** en PascalCase (`Button.jsx`), **hooks** en `useXxx`, **dossiers** en camelCase.
- **Tailwind exclusivement** : aucune classe CSS personnalisée, aucune feuille de style par composant.
- **`async/await`** partout, jamais de chaînes `.then()`.
- **PropTypes** sur les composants qui reçoivent des props.
- Un seul **`<h1>`** par page, et un titre d'onglet défini via `usePageTitle` — le titre est le premier élément annoncé par un lecteur d'écran (critère RGAA 8.6).

Husky et lint-staged lancent ESLint et Prettier automatiquement à chaque commit : le code non conforme ne peut pas entrer dans l'historique.

---

## Astuces et pratique

**Comprendre `fetch` avant de coder la gestion d'erreurs.** `fetch` ne lève **pas** d'exception sur une erreur HTTP : un 400 ou un 500 est une réponse reçue normalement. Un `try/catch` seul n'attrape donc rien de ce genre. Il faut tester `response.ok` pour l'erreur métier, et garder le `try/catch` pour la panne réseau. Les deux sont complémentaires, pas interchangeables.

**Attention aux renommages sur macOS.** Le système de fichiers ne distingue pas `Button.jsx` de `button.jsx`, mais Git et Linux si. Un `mv` simple peut passer inaperçu en local puis casser le déploiement. Utilisez toujours `git mv`, et vérifiez avec `git status` que le renommage est bien enregistré.

**Stabilisez les fonctions passées en dépendances.** Une fonction recréée à chaque rendu et placée dans le tableau de dépendances d'un `useEffect` provoque une boucle infinie. La solution est `useCallback` au niveau du hook qui la fournit, pas un `eslint-disable` sur chaque effet.

**Testez le responsive sur un vrai téléphone.** Le mode responsive du navigateur ne reproduit pas tout : sur iPhone, la barre d'adresse de Safari occupe le bas de l'écran et peut masquer un bouton parfaitement visible en simulation.

**Vérifiez qu'une classe Tailwind existe vraiment.** Une classe arbitraire mal écrite n'est tout simplement pas générée, sans erreur ni avertissement — l'élément retombe alors silencieusement sur le style hérité. En cas de doute, cherchez la classe dans le CSS compilé.

---

## Modélisation de la base de données

| Modèle | Schéma |
| --- | --- |
| Conceptuel (MCD) | ![MCD](docs/schemas/mcd.png) |
| Logique (MLD) | ![MLD](docs/schemas/mld.png) |
| Physique (MPD) | ![MPD](docs/schemas/mpd.png) |

---

## Limites connues

Par honnêteté, et parce qu'un projet de formation gagne à être lucide sur ses angles morts :

- **Les routes de lecture ne revérifient pas l'appartenance à l'équipe.** Seules les actions réservées au propriétaire sont protégées côté serveur.
- **La connexion temps réel n'est pas authentifiée** : aucun jeton n'est transmis à l'ouverture du socket, et l'entrée dans une salle de projet n'est pas contrôlée.
- **La liste des membres connectés vit en mémoire** sur le serveur : un redémarrage l'efface, et une mise à l'échelle sur plusieurs instances demanderait un stockage partagé type Redis.
- **Aucun test automatisé** pour l'instant. La qualité repose sur ESLint, Prettier, Husky et un jeu d'essai manuel documenté. Une base Vitest est la prochaine étape.

---

## Auteur

**Ressane Messioughi** — projet de fin de formation, titre professionnel DWWM.
