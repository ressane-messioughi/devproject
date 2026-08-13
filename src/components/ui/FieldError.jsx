import PropTypes from 'prop-types';

// Message d'erreur affiché sous un champ de formulaire.
// Rend null s'il n'y a pas d'erreur, pour pouvoir l'appeler sans condition autour.
function FieldError({ error, id }) {
  if (!error) return null;

  return (
    <p id={id} className="text-red-400 flex items-center gap-1.5 text-xs font-semibold px-2">
      • {error.message}
    </p>
  );
}

FieldError.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  id: PropTypes.string,
};

export default FieldError;
