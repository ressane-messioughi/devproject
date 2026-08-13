import PropTypes from 'prop-types';
import logo from '../../assets/image/logo.webp';

function CustomToast({ message, avatar }) {
  return (
    <div className="flex items-center gap-2">
      <div>
        <img src={logo} className="w-20 h-15 object-cover" alt="" />
      </div>
      {avatar && (
        <img
          src={avatar}
          className="w-8 h-8 rounded-full object-cover border-green-500 border"
          alt="Photo de profil de l'utilisateur connecté"
        />
      )}

      <div className=" flex flex-col gap-2">
        <h4 className="font-bold text-white">DevProject BETA</h4>
        <p className=" text-gray-300">{message}</p>
      </div>
    </div>
  );
}

CustomToast.propTypes = {
  message: PropTypes.node.isRequired,
  avatar: PropTypes.string,
};

export default CustomToast;
