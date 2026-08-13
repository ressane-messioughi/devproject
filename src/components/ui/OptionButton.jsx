import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Grand bouton blanc arrondi avec icône et libellé (colonne de droite de la
// page de connexion). Avec "to" il devient un lien, sinon un bouton.
const OPTION_CLASS =
  'w-full rounded-full bg-white text-black text-center flex items-center justify-center h-20 hover:bg-gray-400 cursor-pointer transition gap-4';

function OptionButton({ to, icon, label, ...props }) {
  const content = (
    <>
      <img src={icon} className="w-10" alt="" />
      <h2>{label}</h2>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={OPTION_CLASS}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={OPTION_CLASS} {...props}>
      {content}
    </button>
  );
}

OptionButton.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
};

export default OptionButton;
