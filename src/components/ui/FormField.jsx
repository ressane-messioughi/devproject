import PropTypes from 'prop-types';
import FieldError from './FieldError.jsx';
import { INPUT_CLASS } from '../../constants/formClasses.js';

// Champ de formulaire complet : label, input et message d'erreur.
// register reçoit directement le retour de register('champ', { ... }) de React Hook Form.
// errorId permet de relier le message d'erreur à l'input (aria-describedby).
function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  className = INPUT_CLASS,
  labelClassName = 'font-bold',
  errorId,
  register,
  error,
}) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input type={type} id={id} placeholder={placeholder} className={className} {...register} />
      <FieldError error={error} id={errorId} />
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  errorId: PropTypes.string,
  register: PropTypes.object.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
};

export default FormField;
