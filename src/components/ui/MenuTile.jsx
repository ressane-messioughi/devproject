import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Tuile du panel : une icône et un titre dans une carte cliquable.
// Avec "to" elle devient un lien de navigation, avec "onClick" un bouton.
const TILE_CLASS =
  'bg-white/4 backdrop-blur-md border border-white/8 flex flex-col items-center justify-center gap-2 md:gap-4 rounded-2xl p-4 h-40 sm:h-44 md:h-56 w-full overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-300 hover:bg-(--color-card-hover) hover:-translate-y-1 text-center hover:cursor-pointer';

function MenuTile({ to, onClick, icon, label }) {
  const content = (
    <>
      <img src={icon} className="w-16 h-16 sm:w-20 sm:h-20 md:w-30 md:h-30" alt="" />
      <h4 className="text-sm md:text-lg font-bold">{label}</h4>
    </>
  );

  if (to) {
    return (
      <Link to={to}>
        <div className={TILE_CLASS}>{content}</div>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={TILE_CLASS}>
      {content}
    </button>
  );
}

MenuTile.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
};

export default MenuTile;
