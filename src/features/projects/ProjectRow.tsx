import { motion } from 'framer-motion';
import { Edit3, Trash2, ExternalLink, Github, Copy, Rocket, Pause, Ship } from 'lucide-react';
import type { Project, ProjectStatus } from '@/types';
import ProgressBar from '@components/ui/ProgressBar';
import StatusPill from '@components/ui/StatusPill';
import ContextMenu, { ContextMenuItem } from '@components/ui/ContextMenu';
import styles from './ProjectRow.module.css';

interface ProjectRowProps {
  project: Project;
  index: number;
  onClick: () => void;
  onStatusChange?: (status: ProjectStatus) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

// Map tech stack to colors
const TECH_COLORS: Record<string, string> = {
  typescript: '#3178c6',
  react: '#61dafb',
  python: '#3776ab',
  rust: '#ce422b',
  go: '#00add8',
  node: '#539e43',
  nodejs: '#539e43',
  'node.js': '#539e43',
  javascript: '#f7df1e',
  vue: '#42b883',
  svelte: '#ff3e00',
  nextjs: '#ffffff',
  'next.js': '#ffffff',
  tauri: '#ffc131',
};

function getIconColor(stackTags: string[]): string {
  if (!stackTags || stackTags.length === 0) return '#7f77dd';

  const firstTag = stackTags[0].toLowerCase();
  return TECH_COLORS[firstTag] || '#7f77dd';
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

export default function ProjectRow({ project, index, onClick, onStatusChange, onDelete, onDuplicate }: ProjectRowProps) {
  const iconColor = project.icon_color || getIconColor(project.stack_tags);

  const contextMenuItems: ContextMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit Details',
      icon: Edit3,
      shortcut: 'Enter',
      onClick: onClick,
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      shortcut: '⌘D',
      onClick: onDuplicate,
    },
    { id: 'divider-1', label: '', divider: true },
    {
      id: 'mark-active',
      label: 'Mark as Active',
      icon: Rocket,
      disabled: project.status === 'active',
      onClick: () => onStatusChange?.('active'),
    },
    {
      id: 'mark-shipped',
      label: 'Ship It!',
      icon: Ship,
      disabled: project.status === 'shipped',
      onClick: () => onStatusChange?.('shipped'),
    },
    {
      id: 'mark-paused',
      label: 'Pause Project',
      icon: Pause,
      disabled: project.status === 'paused',
      onClick: () => onStatusChange?.('paused'),
    },
    { id: 'divider-2', label: '', divider: true },
    ...(project.github_url
      ? [
          {
            id: 'open-github',
            label: 'Open GitHub',
            icon: Github,
            onClick: () => window.open(project.github_url!, '_blank'),
          },
        ]
      : []),
    ...(project.live_url
      ? [
          {
            id: 'open-live',
            label: 'Open Live Site',
            icon: ExternalLink,
            onClick: () => window.open(project.live_url!, '_blank'),
          },
        ]
      : []),
    ...(project.github_url || project.live_url ? [{ id: 'divider-3', label: '', divider: true }] : []),
    {
      id: 'delete',
      label: 'Delete Project',
      icon: Trash2,
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <ContextMenu items={contextMenuItems}>
      <motion.button
        className={styles.row}
        onClick={onClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.18,
          delay: index * 0.06,
          ease: [0.4, 0, 0.2, 1],
        }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
      >
        <div className={styles.icon} style={{ backgroundColor: `${iconColor}20`, color: iconColor }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="3" y="3" width="14" height="14" rx="2" />
          </svg>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.name}>{project.name}</h3>
            <StatusPill status={project.status} />
          </div>

          <div className={styles.tags}>
            {project.stack_tags.slice(0, 4).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
            {project.stack_tags.length > 4 && (
              <span className={styles.tagMore}>+{project.stack_tags.length - 4}</span>
            )}
          </div>

          <div className={styles.progressRow}>
            <ProgressBar value={project.progress} size="sm" animated={false} />
            <span className={styles.progressPercent}>{project.progress}%</span>
          </div>
        </div>

        <span className={styles.date}>{formatDate(project.updated_at)}</span>
      </motion.button>
    </ContextMenu>
  );
}
