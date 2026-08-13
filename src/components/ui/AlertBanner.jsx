import PropTypes from 'prop-types';
import { TriangleAlert } from 'lucide-react';

// Bandeau d'erreur renvoyée par l'API, affiché en haut d'un formulaire.
// Rend null s'il n'y a pas de message, pour pouvoir l'appeler sans condition autour.
function AlertBanner({ message, className = '' }) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400 ${className}`}
      role="alert"
    >
      <TriangleAlert className="size-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

AlertBanner.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default AlertBanner;
