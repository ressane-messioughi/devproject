import usePageTitle from '../../hooks/usePageTitle.js';
import ButtonProject from '../../components/app/project/ButtonProject';
import ListProject from '../../components/app/project/ListProject';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { container, item } from '../../components/ui/PageAnimation.jsx';

function AppProjectPage() {
  usePageTitle('Mes Projets');

  const [refreshProject, setRefreshProject] = useState(false);
  const triggerRefreshProject = () => {
    setRefreshProject((prev) => !prev);
  };
  return (
    <>
      <section className="flex flex-col gap-10">
        <h1 className="sr-only">Mes projets</h1>
        <ButtonProject ProjectCreate={triggerRefreshProject} />
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={item}>
            <ListProject refreshProject={refreshProject} ProjectDelete={triggerRefreshProject} />
          </motion.div>
        </motion.section>
      </section>
    </>
  );
}

export default AppProjectPage;
