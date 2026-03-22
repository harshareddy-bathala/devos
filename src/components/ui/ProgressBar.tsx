import { motion } from 'framer-motion';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0-100
  variant?: 'default' | 'success' | 'info';
  size?: 'sm' | 'md';
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  animated = true,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const isComplete = clampedValue === 100;

  return (
    <div
      className={`${styles.track} ${styles[size]} ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`${styles.fill} ${styles[variant]} ${isComplete ? styles.complete : ''}`}
        initial={animated ? { width: 0 } : false}
        animate={{ width: `${clampedValue}%` }}
        transition={{
          duration: animated ? 0.9 : 0,
          ease: [0.16, 1, 0.3, 1], // ease-out-expo
        }}
      />
    </div>
  );
}
