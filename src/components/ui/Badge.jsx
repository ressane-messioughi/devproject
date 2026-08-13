import PropTypes from 'prop-types';

function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full font-bold border ${className}`}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
