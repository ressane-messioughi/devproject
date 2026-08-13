import PropTypes from 'prop-types';

// Bouton d'action en icône seule (modifier, supprimer, valider...).
// La couleur porte le sens : rouge pour supprimer, orange pour modifier,
// vert pour valider.
const COLORS = {
  red: 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 hover:border-red-400/60',
  orange:
    'border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/25 hover:border-orange-400/60',
  green:
    'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/25 hover:border-green-400/60',
};

const SIZES = {
  sm: 'p-2',
  md: 'p-3',
};

const BASE =
  'rounded-lg border cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed';

function IconButton({ color = 'red', size = 'sm', className = '', children, ...props }) {
  return (
    <button className={`${BASE} ${SIZES[size]} ${COLORS[color]} ${className}`} {...props}>
      {children}
    </button>
  );
}

IconButton.propTypes = {
  color: PropTypes.oneOf(['red', 'orange', 'green']),
  size: PropTypes.oneOf(['sm', 'md']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default IconButton;
