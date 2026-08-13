import PropTypes from 'prop-types';
import FieldError from './FieldError.jsx';
import {
  MODAL_LABEL_CLASS,
  MODAL_INPUT_CLASS,
  MODAL_TEXTAREA_CLASS,
} from '../../constants/formClasses.js';

// Champ de formulaire dans un modal : label, champ et message d'erreur.
// Rend un <textarea> avec textarea, un <select> avec options, sinon un <input>.
// register reçoit directement le retour de register('champ', { ... }).
function ModalField({
  id,
  label,
  type = 'text',
  textarea = false,
  options,
  defaultValue,
  rows,
  placeholder,
  className,
  labelClassName = MODAL_LABEL_CLASS,
  register,
  error,
}) {
  const fieldClass = className || (textarea ? MODAL_TEXTAREA_CLASS : MODAL_INPUT_CLASS);

  return (
    <>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      {options ? (
        <select id={id} defaultValue={defaultValue} className={fieldClass} {...register}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          className={fieldClass}
          {...register}
        />
      ) : (
        <input type={type} id={id} placeholder={placeholder} className={fieldClass} {...register} />
      )}

      <FieldError error={error} />
    </>
  );
}

ModalField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  type: PropTypes.string,
  textarea: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.node })),
  defaultValue: PropTypes.string,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  register: PropTypes.object.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
};

export default ModalField;
