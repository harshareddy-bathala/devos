import type { ProjectStatus, CourseStatus } from '@/types';
import styles from './StatusPill.module.css';
import { Check } from 'lucide-react';

type Status = ProjectStatus | CourseStatus;

interface StatusPillProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<Status, { label: string; variant: string; showCheck?: boolean }> = {
  // Project statuses
  planned: { label: 'PLANNED', variant: 'planned' },
  active: { label: 'ACTIVE', variant: 'active' },
  building: { label: 'BUILDING', variant: 'building' },
  shipped: { label: 'SHIPPED', variant: 'shipped', showCheck: true },
  paused: { label: 'PAUSED', variant: 'paused' },
  // Course statuses
  in_progress: { label: 'IN PROGRESS', variant: 'active' },
  completed: { label: 'COMPLETED', variant: 'shipped', showCheck: true },
  dropped: { label: 'DROPPED', variant: 'paused' },
};

export default function StatusPill({ status, size = 'sm', className = '' }: StatusPillProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={`${styles.pill} ${styles[config.variant]} ${styles[size]} ${className}`}
    >
      {config.showCheck && <Check size={10} strokeWidth={2.5} />}
      {config.label}
    </span>
  );
}
