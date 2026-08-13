import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { container, item } from '../../ui/PageAnimation.jsx';
import Avatar from '../../ui/Avatar.jsx';
import QRCode from 'react-qr-code';
import useProject from '../../../hooks/useProject.js';

function MemberOnline({ connectedUsers }) {
  const { selectedProject } = useProject();
  return (
    <>
      <div
        className={`w-full bg-(--color-surface) border border-white/10 rounded-xl px-6 py-4 items-center gap-4 md:gap-10 shadow-lg shadow-black/20 ${connectedUsers.length === 0 ? 'hidden md:flex' : 'flex'}`}
      >
        {/* <h4 className="hidden md:inline shrink-0 p-4 bg-(--color-background-secondary) rounded-sm border-white/10 border font-bold">
          Membre en ligne :
        </h4> */}
        <div className="flex items-center gap-4 md:gap-10 overflow-x-auto min-w-0 flex-1">
          {connectedUsers.map((user) => (
            <div key={user.id} className="shrink-0 flex flex-col items-center">
              <motion.section
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-6"
              >
                <motion.div variants={item}>
                  <Avatar
                    src={user.avatar}
                    username={user.username}
                    className="w-18 h-18 rounded-full object-cover border-2 border-green-500 "
                  />
                  <p className="text-center">{user.username}</p>
                </motion.div>
              </motion.section>
            </div>
          ))}
        </div>
        {selectedProject && (
          <>
            <div className="hidden md:block w-0.5 h-16 bg-white/20 shrink-0" aria-hidden="true" />
            <div className="hidden md:flex shrink-0 flex-col items-center gap-2">
              <div className="w-18 h-18 p-1.5 rounded-lg border-2 border-white/20 bg-white flex items-center justify-center">
                <QRCode
                  value={`${import.meta.env.VITE_APP_URL}/join/${selectedProject.team_code}`}
                  className="w-full h-full"
                />
              </div>
              <p className="text-center max-w-24 truncate" title={selectedProject.name}>
                {selectedProject.name}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

MemberOnline.propTypes = {
  connectedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ).isRequired,
};

export default MemberOnline;
