import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, roles }) {
  const { isLoggedIn } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    const decoded = jwtDecode(token);

    if (!roles.includes(decoded.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
