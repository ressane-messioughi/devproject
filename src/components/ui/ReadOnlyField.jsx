import PropTypes from 'prop-types';
import { INPUT_CLASS } from '../../constants/formClasses.js';

// Champ en lecture seule qui affiche une information existante.
// Selon les écrans la valeur est passée en value (URL d'un dépôt) ou en
// placeholder (page profil) : les deux props sont donc disponibles.
function ReadOnlyField({
  type = 'text',
  id,
  name,
  ariaLabel,
  value,
  placeholder,
  className = INPUT_CLASS,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      className={className}
      readOnly
    />
  );
}

ReadOnlyField.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  ariaLabel: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default ReadOnlyField;
