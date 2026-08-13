import { useState } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Trash2, ChevronDown } from 'lucide-react';
import Avatar from '../../ui/Avatar.jsx';
import IconButton from '../../ui/IconButton.jsx';
import Badge from '../../ui/Badge.jsx';
import Modal from '../../ui/Modal.jsx';
import { TEAM_ROLE_COLORS, TEAM_ROLE_BADGE_SIZE } from '../../../constants/teamRoles.js';

const STATUS_COLORS = {
  OK: 'bg-green-500/15 text-green-400 border-green-500/30',
  'EN COURS': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  BUG: 'bg-red-500/15 text-red-400 border-red-500/30',
};

// Couleur du bloc "pris en charge par" sous le statut, selon qui a changé le statut en dernier
const UPDATED_BY_COLORS = {
  OK: 'text-green-400',
  'EN COURS': 'text-orange-400',
};

function RowBug({ bug, isAuthor, isOwner, onStatusChange, onEdit, onDelete }) {
  const [showImage, setShowImage] = useState(false);
  const updatedByColor = UPDATED_BY_COLORS[bug.status];

  return (
    <article className="w-full bg-(--color-background-secondary) border border-white/10 rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Avatar
          src={bug.avatar}
          username={bug.username}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/20 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{bug.username}</span>
            {bug.team_role && (
              <Badge className={`${TEAM_ROLE_BADGE_SIZE} ${TEAM_ROLE_COLORS[bug.team_role]}`}>
                {bug.team_role}
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-base md:text-lg mt-1 break-words">{bug.title}</h3>
        </div>

        {bug.file_url && (
          <button
            onClick={() => setShowImage(true)}
            aria-label="Voir la capture d'écran en grand"
            className="cursor-pointer shrink-0"
          >
            <img
              src={bug.file_url}
              alt="Capture d'écran du bug"
              className="w-16 h-16 rounded-lg object-cover border border-white/20 hover:opacity-80 transition"
            />
          </button>
        )}

        <div className="flex flex-row md:flex-col items-start gap-2 shrink-0">
          <select
            value={bug.status}
            onChange={(e) => onStatusChange(bug.id_bug, e.target.value)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-(--color-background) cursor-pointer ${STATUS_COLORS[bug.status] || ''}`}
          >
            <option value="BUG">BUG</option>
            <option value="EN COURS">EN COURS</option>
            <option value="OK">OK</option>
          </select>

          {updatedByColor && bug.updated_by_username && (
            <div className="flex items-center gap-1.5">
              <Avatar
                src={bug.updated_by_avatar}
                username={bug.updated_by_username}
                className="w-5 h-5 rounded-full object-cover border border-white/20"
              />
              <span className={`text-xs font-bold ${updatedByColor}`}>
                {bug.updated_by_username}
              </span>
            </div>
          )}
        </div>

        {(isAuthor || isOwner) && (
          <div className="flex gap-1.5 shrink-0">
            {isAuthor && (
              <IconButton color="orange" onClick={() => onEdit(bug)} aria-label="Modifier le bug">
                <Pencil size={16} />
              </IconButton>
            )}
            {isOwner && (
              <IconButton onClick={() => onDelete(bug.id_bug)} aria-label="Supprimer le bug">
                <Trash2 size={16} />
              </IconButton>
            )}
          </div>
        )}
      </div>

      <details className="group mt-3 pt-3 border-t border-white/10">
        <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-semibold text-(--color-text-secondary)">
          <ChevronDown size={16} className="transition group-open:rotate-180" />
          Description
        </summary>
        <p className="text-sm text-gray-300 leading-relaxed mt-2 break-words whitespace-pre-wrap">
          {bug.description}
        </p>
      </details>

      {bug.file_url && (
        <Modal isOpen={showImage} onClose={() => setShowImage(false)} title={bug.title}>
          <img
            src={bug.file_url}
            alt="Capture d'écran du bug en grand"
            className="w-full h-auto rounded-lg"
          />
        </Modal>
      )}
    </article>
  );
}

RowBug.propTypes = {
  bug: PropTypes.shape({
    id_bug: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    file_url: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string,
    team_role: PropTypes.string,
    updated_by_username: PropTypes.string,
    updated_by_avatar: PropTypes.string,
  }).isRequired,
  isAuthor: PropTypes.bool.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RowBug;
