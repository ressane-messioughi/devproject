import usePageTitle from '../../hooks/usePageTitle.js';
import ButtonJournal from '../../components/app/journal/ButtonJournal';
import ListPost from '../../components/app/journal/ListPost';
import { motion } from 'framer-motion';
import { container, item } from '../../components/ui/PageAnimation.jsx';

function AppJournalPage() {
  usePageTitle('Journal');

  return (
    <>
      <section className="flex flex-col gap-10">
        <h1 className="sr-only">Journal</h1>
        <ButtonJournal />
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={item}>
            <ListPost />
          </motion.div>
        </motion.section>
      </section>
    </>
  );
}

export default AppJournalPage;
