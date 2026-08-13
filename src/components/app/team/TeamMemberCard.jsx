import { useFetch } from '../../../hooks/useFetch.js';
import Avatar from '../../ui/Avatar.jsx';
import useProject from '../../../hooks/useProject.js';
import useIsOwner from '../../../hooks/useIsOwner.js';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Crown, UserMinus } from 'lucide-react';
import { socket } from '../../../socket.js';
import Badge from '../../ui/Badge.jsx';
import {
  TEAM_ROLES,
  TEAM_ROLE_COLORS,
  TEAM_ROLE_BADGE_SIZE,
} from '../../../constants/teamRoles.js';

function TeamMemberCard({ refreshMembers }) {
  const { apiFetch } = useFetch();
  const { selectedProject } = useProject();
  const isOwner = useIsOwner();
  const [members, setMembers] = useState([]);

  // Fonction pour récupérer les membres du projet
  // =============================================
  const getMembers = async () => {
    if (!selectedProject) return;

    const response = await apiFetch(`/project/${selectedProject.id_project}/team`);

    if (!response?.ok) return;

    const data = await response.json();
    setMembers(data);
  };

  // Fonction pour modifier le team_role d'un membre (uniquement le owner)
  // =============================================
  const handleRoleChange = async (users_id, team_role) => {
    const response = await apiFetch(
      `/project/${selectedProject.id_project}/team/${users_id}/role`,
      {
        method: 'PATCH',
        body: JSON.stringify({ team_role }),
      },
    );

    if (!response?.ok) return;

    setMembers((prev) =>
      prev.map((member) => (member.id === users_id ? { ...member, team_role } : member)),
    );
  };

  // Fonction pour retirer un membre du projet (uniquement le owner)
  // =============================================
  const handleRemoveMember = async (users_id) => {
    const confirmed = window.confirm('Retirer ce membre du projet ?');
    if (!confirmed) return;

    const response = await apiFetch(
      `/project/${selectedProject.id_project}/team/${users_id}/member`,
      { method: 'DELETE' },
    );

    if (!response?.ok) return;

    setMembers((prev) => prev.filter((member) => member.id !== users_id));
  };

  // UseEffect pour le re-render de mon composant
  // =============================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, refreshMembers]);

  // UseEffect pour mettre à jour la photo de profil d'un membre en temps réel
  // =============================================
  useEffect(() => {
    const handleAvatarUpdated = ({ user_id, avatar }) => {
      setMembers((prev) =>
        prev.map((member) => (member.id === user_id ? { ...member, avatar } : member)),
      );
    };

    socket.on('avatarUpdated', handleAvatarUpdated);

    return () => {
      socket.off('avatarUpdated', handleAvatarUpdated);
    };
  }, []);
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:gap-6 mx-auto max-w-2xl">
        {members.map((member) => (
          <li
            className="w-full min-w-0 h-full flex bg-(--color-background-secondary) rounded-xl shadow-lg shadow-black/20 overflow-hidden"
            key={member.id}
          >
            <div className="flex flex-col items-center text-center py-3 md:py-4 px-2 md:px-3 min-w-0 w-full">
              <Avatar
                src={member.avatar}
                username={member.username}
                className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-white object-cover shrink-0"
              />
              <table className="w-full min-w-0 text-left mt-3">
                <caption className="w-full min-w-0 border border-white/20 text-base sm:text-lg font-bold bg-(--color-background) py-1 px-2 wrap-break-word">
                  <div className="flex flex-col items-center gap-1">
                    <span>
                      {member.username}{' '}
                      {member.role === 'OWNER' && (
                        <Crown
                          className="inline-block align-middle text-amber-400 shrink-0"
                          size={18}
                          aria-label="Propriétaire du projet"
                        />
                      )}
                    </span>
                    {member.team_role && (
                      <Badge
                        className={`${TEAM_ROLE_BADGE_SIZE} ${TEAM_ROLE_COLORS[member.team_role]}`}
                      >
                        {member.team_role}
                      </Badge>
                    )}
                  </div>
                </caption>
                <tbody className="flex flex-col w-full min-w-0">
                  <tr className="flex w-full min-w-0 gap-4 py-1 px-2 border-b border-white/10">
                    <th scope="row" className="font-bold shrink-0 w-14 sm:w-20 text-xs sm:text-sm">
                      Nom
                    </th>
                    <td className="min-w-0 flex-1 wrap-break-word text-xs sm:text-sm">
                      {member.lastname}
                    </td>
                  </tr>
                  <tr className="flex w-full min-w-0 gap-4 py-1 px-2 border-b border-white/10">
                    <th scope="row" className="font-bold shrink-0 w-14 sm:w-20 text-xs sm:text-sm">
                      Prénom
                    </th>
                    <td className="min-w-0 flex-1 wrap-break-word text-xs sm:text-sm">
                      {member.firstname}
                    </td>
                  </tr>
                  <tr className="flex w-full min-w-0 gap-4 py-1 px-2 border-b border-white/10">
                    <th scope="row" className="font-bold shrink-0 w-14 sm:w-20 text-xs sm:text-sm">
                      Téléphone
                    </th>
                    <td className="min-w-0 flex-1 wrap-break-word text-xs sm:text-sm">
                      {member.phone}
                    </td>
                  </tr>
                  <tr className="flex w-full min-w-0 gap-4 py-1 px-2">
                    <th scope="row" className="font-bold shrink-0 w-14 sm:w-20 text-xs sm:text-sm">
                      Ville
                    </th>
                    <td className="min-w-0 flex-1 wrap-break-word text-xs sm:text-sm">
                      {member.city}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="w-full min-w-0 px-2 mt-2 flex flex-col items-center gap-2">
                <label
                  htmlFor={`team-role-${member.id}`}
                  className="text-xs sm:text-sm font-bold self-start"
                >
                  Rôle dans le projet
                </label>
                <select
                  id={`team-role-${member.id}`}
                  value={member.team_role || ''}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                  disabled={!isOwner}
                  className="w-full min-w-0 mt-1 p-2 rounded bg-(--color-background) text-xs sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">-- Choisir un rôle --</option>
                  {TEAM_ROLES.map((teamRole) => (
                    <option key={teamRole} value={teamRole}>
                      {teamRole}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full min-w-0 mt-3 min-h-9">
                {isOwner && member.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="w-full min-w-0 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-red-400 border border-red-400/40 rounded-lg py-2 hover:bg-red-500/10 cursor-pointer"
                  >
                    <UserMinus size={16} className="shrink-0" />
                    Retirer du projet
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

TeamMemberCard.propTypes = {
  refreshMembers: PropTypes.bool,
};

export default TeamMemberCard;
