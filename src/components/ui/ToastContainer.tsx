import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, ToastType } from '@/stores/toast.store';
import styles from './ToastContainer.module.css';

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className={styles.container}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];

          return (
            <motion.div
              key={toast.id}
              className={`${styles.toast} ${styles[toast.type]}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              layout
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Icon size={18} className={styles.icon} />
              <div className={styles.content}>
                <p className={styles.title}>{toast.title}</p>
                {toast.description && (
                  <p className={styles.description}>{toast.description}</p>
                )}
              </div>
              <button
                className={styles.closeButton}
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
