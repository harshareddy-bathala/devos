import { motion } from 'framer-motion';
import { BookOpen, Sparkles, CheckCircle, BarChart3 } from 'lucide-react';
import styles from './PageView.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export default function CoursesView() {
  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Book base */}
            <rect
              x="12"
              y="18"
              width="56"
              height="44"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Book spine */}
            <line x1="40" y1="18" x2="40" y2="62" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            {/* Page lines left */}
            <line x1="20" y1="30" x2="34" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="38" x2="32" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="20" y1="46" x2="34" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {/* Page lines right */}
            <line x1="46" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="46" y1="38" x2="58" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <line x1="46" y1="46" x2="60" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            {/* Progress indicator */}
            <rect
              x="18"
              y="52"
              width="18"
              height="4"
              rx="2"
              fill="rgba(55, 138, 221, 0.3)"
            />
            <rect
              x="18"
              y="52"
              width="10"
              height="4"
              rx="2"
              fill="rgba(55, 138, 221, 0.6)"
            />
          </svg>
        </div>

        <div className={styles.badge}>
          <Sparkles size={12} />
          Coming in Phase 5
        </div>

        <h2 className={styles.emptyTitle}>Courses Tracker</h2>
        <p className={styles.emptyDescription}>
          Track every course you take across any platform. See your progress,
          earn XP for each module completed, and celebrate when you finish.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <BookOpen size={16} />
            <span>Multi-platform tracking</span>
          </div>
          <div className={styles.feature}>
            <CheckCircle size={16} />
            <span>Module completion rewards</span>
          </div>
          <div className={styles.feature}>
            <BarChart3 size={16} />
            <span>Progress insights</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
