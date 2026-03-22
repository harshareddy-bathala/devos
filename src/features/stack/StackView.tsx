import { motion } from 'framer-motion';
import { Hexagon, Sparkles } from 'lucide-react';
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

export default function StackView() {
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
            {/* Outer hexagon */}
            <polygon
              points="40,5 72,22 72,58 40,75 8,58 8,22"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            {/* Middle hexagon */}
            <polygon
              points="40,16 60,27 60,53 40,64 20,53 20,27"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
            {/* Inner hexagon with glow */}
            <polygon
              points="40,28 50,34 50,46 40,52 30,46 30,34"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(127, 119, 221, 0.15)"
            />
            {/* Center dot */}
            <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.5" />
          </svg>
        </div>

        <div className={styles.badge}>
          <Sparkles size={12} />
          Coming in Phase 4
        </div>

        <h2 className={styles.emptyTitle}>Stack Radar</h2>
        <p className={styles.emptyDescription}>
          Your technical skills visualized. As you build projects and complete courses,
          your expertise will be mapped here with confidence levels.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Hexagon size={16} />
            <span>Interactive radar chart</span>
          </div>
          <div className={styles.feature}>
            <Hexagon size={16} />
            <span>Auto-tracked from projects</span>
          </div>
          <div className={styles.feature}>
            <Hexagon size={16} />
            <span>Confidence levels</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
