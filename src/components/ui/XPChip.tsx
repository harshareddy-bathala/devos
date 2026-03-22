import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Zap } from 'lucide-react';
import styles from './XPChip.module.css';

interface XPChipProps {
  value: number;
}

export default function XPChip({ value }: XPChipProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const controls = useAnimationControls();

  useEffect(() => {
    if (value !== displayValue) {
      // Animate the chip on value change
      controls.start({
        scale: [1, 1.12, 1],
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      });

      // Count up animation
      const diff = value - displayValue;
      const duration = 300; // ms
      const steps = 20;
      const increment = diff / steps;
      let current = displayValue;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value, displayValue, controls]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <motion.div className={styles.chip} animate={controls}>
      <Zap size={14} strokeWidth={2} className={styles.icon} />
      <span className={styles.value}>{formatNumber(displayValue)}</span>
    </motion.div>
  );
}
