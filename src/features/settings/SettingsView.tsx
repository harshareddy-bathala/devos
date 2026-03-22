import { motion } from 'framer-motion';
import styles from './SettingsView.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export default function SettingsView() {
  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <section className={styles.panel}>
        <h2 className={styles.title}>Settings</h2>
        <p className={styles.description}>
          Settings are coming soon. Keyboard shortcuts already available: 1-4 to switch modules, N for new project, and Ctrl/Cmd+, for this page.
        </p>
      </section>
    </motion.div>
  );
}
