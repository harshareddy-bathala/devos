import { motion } from 'framer-motion';
import { Sparkles, Target, Calendar, Timer } from 'lucide-react';
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

export default function TimetableView() {
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
            {/* Clock face */}
            <circle
              cx="40"
              cy="40"
              r="28"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Hour markers */}
            <circle cx="40" cy="16" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="64" cy="40" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="40" cy="64" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="16" cy="40" r="2" fill="currentColor" opacity="0.4" />
            {/* Hour hand */}
            <line
              x1="40" y1="40" x2="40" y2="26"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1="40" y1="40" x2="54" y2="32"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              opacity="0.7"
            />
            {/* Center dot */}
            <circle cx="40" cy="40" r="3" fill="rgba(127, 119, 221, 0.8)" />
            {/* Focus arc indicator */}
            <path
              d="M 40 12 A 28 28 0 0 1 68 40"
              stroke="rgba(127, 119, 221, 0.4)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className={styles.badge}>
          <Sparkles size={12} />
          Coming in Phase 6
        </div>

        <h2 className={styles.emptyTitle}>Timetable & Focus</h2>
        <p className={styles.emptyDescription}>
          Plan your day intentionally. Schedule focus blocks,
          enter distraction-free mode, and track where your time actually goes.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Calendar size={16} />
            <span>Daily & weekly planning</span>
          </div>
          <div className={styles.feature}>
            <Target size={16} />
            <span>Full-screen focus mode</span>
          </div>
          <div className={styles.feature}>
            <Timer size={16} />
            <span>Pomodoro sessions</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
