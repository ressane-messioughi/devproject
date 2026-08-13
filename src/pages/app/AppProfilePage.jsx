import usePageTitle from '../../hooks/usePageTitle.js';
import ProfileCard from '../../components/app/profile/ProfileCardLeft';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { container, item } from '../../components/ui/PageAnimation.jsx';

function AppProfilePage() {
  usePageTitle('Mon Profil');

  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };
  return (
    <>
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-6"
      >
        <motion.div variants={item}>
          <ProfileCard refresh={refresh} triggerRefresh={triggerRefresh} />
        </motion.div>
      </motion.section>
    </>
  );
}

export default AppProfilePage;
