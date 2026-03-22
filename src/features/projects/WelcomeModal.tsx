import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Sparkles, Rocket, X } from 'lucide-react';
import styles from './WelcomeModal.module.css';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.layer}>
            <motion.section
              className={styles.modal}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-title"
            >
              <button className={styles.closeButton} onClick={onClose} aria-label="Close welcome modal">
                <X size={16} />
              </button>

              <p className={styles.eyebrow}>
                <Sparkles size={12} />
                Welcome to DevOS
              </p>
              <h2 id="welcome-title" className={styles.title}>Track less, build more.</h2>
              <p className={styles.description}>
                Create projects, complete milestones, and earn XP from real progress. Everything stays local on your machine.
              </p>

              <div className={styles.shortcuts}>
                <p className={styles.shortcutsTitle}>
                  <Keyboard size={14} />
                  Keyboard shortcuts
                </p>
                <ul className={styles.list}>
                  <li><span className={styles.kbd}>1-4</span> switch modules</li>
                  <li><span className={styles.kbd}>N</span> create project</li>
                  <li><span className={styles.kbd}>Ctrl/Cmd + ,</span> open settings</li>
                </ul>
              </div>

              <button className={styles.primaryButton} onClick={onClose}>
                <Rocket size={14} />
                Start building
              </button>
            </motion.section>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
