import PropTypes from 'prop-types';
import {
  BUTTON_PRIMARY_CLASS,
  BUTTON_SECONDARY_CLASS,
  BUTTON_GHOST_CLASS,
  BUTTON_SIZE_MD,
  BUTTON_SIZE_SM,
} from '../../constants/formClasses.js';

const VARIANTS = {
  primary: BUTTON_PRIMARY_CLASS,
  secondary: BUTTON_SECONDARY_CLASS,
  ghost: BUTTON_GHOST_CLASS,
};

const SIZES = {
  md: BUTTON_SIZE_MD,
  sm: BUTTON_SIZE_SM,
};

// Bouton du projet, en trois variantes ("primary" bleu, "secondary" gris,
// "ghost" transparent) et deux tailles ("md" par défaut, "sm" pour les
// formulaires compacts).
// className sert aux ajustements de mise en page (w-full, flex-1, mt-2...).
function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button className={`${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['md', 'sm']),
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Button;
