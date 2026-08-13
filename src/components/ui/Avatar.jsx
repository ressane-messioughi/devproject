import PropTypes from 'prop-types';

// Photo de profil d'un utilisateur.
// Le texte alternatif suit partout la même formule à partir du pseudo.
// "fallback" n'est utilisé que là où un visuel de remplacement existe déjà.
function Avatar({ src, username, className, fallback }) {
  return (
    <img
      src={fallback ? src || fallback : src}
      alt={`Photo de profil de ${username}`}
      className={className}
    />
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  username: PropTypes.string,
  className: PropTypes.string,
  fallback: PropTypes.string,
};

export default Avatar;
