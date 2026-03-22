import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, Trash2, Zap, Calendar, RefreshCw, Plus, Check } from 'lucide-react';
import type { Project, ProjectMilestone, ProjectStatus } from '@/types';
import ProgressBar from '@components/ui/ProgressBar';
import TagInput from '@components/ui/TagInput';
import {
  addProjectMilestone,
  calculateMilestoneProgress,
  deleteProjectMilestone,
  getProjectMilestones,
  seedDefaultMilestones,
  updateProjectMilestone,
} from './projectMilestones';
import { toast } from '@/stores/toast.store';
import styles from './ProjectPanel.module.css';

interface ProjectPanelProps {
  project: Project | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'planned', label: 'Planned', color: 'var(--text-muted)' },
  { value: 'active', label: 'Active', color: 'var(--color-teal)' },
  { value: 'building', label: 'Building', color: 'var(--color-blue)' },
  { value: 'shipped', label: 'Shipped', color: 'var(--color-purple)' },
  { value: 'paused', label: 'Paused', color: 'var(--color-coral)' },
];

// Common tech stack suggestions
const TECH_SUGGESTIONS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Rust', 'Go', 'Vue', 'Next.js', 'Tauri', 'Svelte',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
  'Docker', 'AWS', 'Tailwind CSS', 'CSS Modules'
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function ProjectPanel({ project, onClose, onUpdate, onDelete }: ProjectPanelProps) {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeight, setNewMilestoneWeight] = useState(20);

  useEffect(() => {
    if (project) {
      setDescription(project.description || '');
      setTags(project.stack_tags);
      setGithubUrl(project.github_url || '');
      setLiveUrl(project.live_url || '');
      setConfirmDelete(false);
      setNewMilestoneTitle('');
      setNewMilestoneWeight(20);
    } else {
      setMilestones([]);
    }
  }, [project]);

  useEffect(() => {
    if (!project) {
      return;
    }

    let cancelled = false;

    const loadMilestones = async () => {
      setMilestonesLoading(true);

      try {
        let rows = await getProjectMilestones(project.id);

        if (rows.length === 0) {
          rows = await seedDefaultMilestones(project.id, project.progress);
        }

        if (cancelled) {
          return;
        }

        setMilestones(rows);

        const derivedProgress = calculateMilestoneProgress(rows);
        if (derivedProgress !== project.progress) {
          onUpdate(project.id, { progress: derivedProgress });
        }
      } catch (error) {
        console.error('Failed to load milestones:', error);
        toast.error('Could not load milestones', 'Project progress may be out of sync.');
      } finally {
        if (!cancelled) {
          setMilestonesLoading(false);
        }
      }
    };

    void loadMilestones();

    return () => {
      cancelled = true;
    };
  }, [project, onUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  const handleStatusChange = (status: ProjectStatus) => {
    if (project) {
      onUpdate(project.id, { status });
    }
  };

  const handleDescriptionBlur = () => {
    if (project && description !== (project.description || '')) {
      onUpdate(project.id, { description });
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
    if (project) {
      onUpdate(project.id, { stack_tags: newTags });
    }
  };

  const handleGithubBlur = () => {
    if (project && githubUrl !== (project.github_url || '')) {
      onUpdate(project.id, { github_url: githubUrl || null });
    }
  };

  const handleLiveUrlBlur = () => {
    if (project && liveUrl !== (project.live_url || '')) {
      onUpdate(project.id, { live_url: liveUrl || null });
    }
  };

  const handleDelete = () => {
    if (project) {
      setConfirmDelete(true);
    }
  };

  const handleConfirmDelete = () => {
    if (project) {
      onDelete(project.id);
      onClose();
    }
  };

  const syncProgress = (nextMilestones: ProjectMilestone[]) => {
    if (!project) {
      return;
    }

    const derivedProgress = calculateMilestoneProgress(nextMilestones);
    if (derivedProgress !== project.progress) {
      onUpdate(project.id, { progress: derivedProgress });
    }
  };

  const handleToggleMilestone = async (milestone: ProjectMilestone) => {
    if (!project) {
      return;
    }

    const nextCompleted = !milestone.completed;

    try {
      await updateProjectMilestone(milestone.id, { completed: nextCompleted });

      const nextMilestones = milestones.map((item) =>
        item.id === milestone.id
          ? {
              ...item,
              completed: nextCompleted,
              completed_at: nextCompleted ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            }
          : item
      );

      setMilestones(nextMilestones);
      syncProgress(nextMilestones);
    } catch (error) {
      console.error('Failed to update milestone:', error);
      toast.error('Could not update milestone', 'Please try again.');
    }
  };

  const handleAddMilestone = async () => {
    if (!project || !newMilestoneTitle.trim()) {
      return;
    }

    try {
      const created = await addProjectMilestone(project.id, newMilestoneTitle.trim(), newMilestoneWeight);
      const nextMilestones = [...milestones, created];
      setMilestones(nextMilestones);
      syncProgress(nextMilestones);
      setNewMilestoneTitle('');
      setNewMilestoneWeight(20);
    } catch (error) {
      console.error('Failed to add milestone:', error);
      toast.error('Could not add milestone', 'Please try again.');
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      await deleteProjectMilestone(milestoneId);
      const nextMilestones = milestones.filter((milestone) => milestone.id !== milestoneId);
      setMilestones(nextMilestones);
      syncProgress(nextMilestones);
    } catch (error) {
      console.error('Failed to delete milestone:', error);
      toast.error('Could not delete milestone', 'Please try again.');
    }
  };

  const derivedProgress = calculateMilestoneProgress(milestones);
  const completedMilestones = milestones.filter((milestone) => milestone.completed).length;

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.panel}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <h2 className={styles.title}>{project.name}</h2>
                <div className={styles.headerMeta}>
                  <span className={styles.xpBadge}>
                    <Zap size={12} />
                    Lifecycle XP is one-time per milestone
                  </span>
                </div>
              </div>
              <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              {/* Status */}
              <div className={styles.section}>
                <label className={styles.label}>Status</label>
                <div className={styles.statusGrid}>
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.statusButton} ${
                        project.status === option.value ? styles.statusActive : ''
                      }`}
                      onClick={() => handleStatusChange(option.value)}
                      style={{
                        '--status-color': option.color
                      } as React.CSSProperties}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div className={styles.section}>
                <label className={styles.label}>Progress</label>
                <div className={styles.progressControl}>
                  <ProgressBar value={derivedProgress} animated={false} />
                  <div className={styles.progressMeta}>
                    <span>{derivedProgress}% complete</span>
                    <span>{completedMilestones}/{milestones.length} milestones done</span>
                  </div>
                  <div className={styles.milestoneList}>
                    {milestonesLoading ? (
                      <p className={styles.milestoneHint}>Loading milestones...</p>
                    ) : milestones.length === 0 ? (
                      <p className={styles.milestoneHint}>Add milestones to auto-calculate progress.</p>
                    ) : (
                      milestones.map((milestone) => (
                        <div key={milestone.id} className={styles.milestoneRow}>
                          <button
                            type="button"
                            className={`${styles.milestoneToggle} ${milestone.completed ? styles.milestoneToggleDone : ''}`}
                            onClick={() => void handleToggleMilestone(milestone)}
                            aria-label={`Mark ${milestone.title} as ${milestone.completed ? 'incomplete' : 'complete'}`}
                          >
                            {milestone.completed ? <Check size={14} /> : null}
                          </button>
                          <span className={styles.milestoneTitle}>{milestone.title}</span>
                          <span className={styles.milestoneWeight}>{milestone.weight}%</span>
                          <button
                            type="button"
                            className={styles.milestoneDelete}
                            onClick={() => void handleDeleteMilestone(milestone.id)}
                            aria-label={`Delete milestone ${milestone.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className={styles.milestoneComposer}>
                    <input
                      type="text"
                      value={newMilestoneTitle}
                      onChange={(event) => setNewMilestoneTitle(event.target.value)}
                      placeholder="Add milestone"
                      className={styles.milestoneInput}
                    />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newMilestoneWeight}
                      onChange={(event) => setNewMilestoneWeight(Math.max(1, Math.min(100, Number(event.target.value) || 1)))}
                      className={styles.weightInput}
                      aria-label="Milestone weight"
                    />
                    <button
                      type="button"
                      className={styles.addMilestoneButton}
                      onClick={() => void handleAddMilestone()}
                      disabled={!newMilestoneTitle.trim()}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className={styles.section}>
                <label className={styles.label}>Tech Stack</label>
                <TagInput
                  tags={tags}
                  onChange={handleTagsChange}
                  placeholder="Add technologies..."
                  suggestions={TECH_SUGGESTIONS}
                />
              </div>

              {/* Description */}
              <div className={styles.section}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="What is this project about? What problem does it solve?"
                  spellCheck
                  rows={4}
                />
              </div>

              {/* Links */}
              <div className={styles.section}>
                <label className={styles.label}>Links</label>
                <div className={styles.linkGroup}>
                  <div className={styles.linkInput}>
                    <Github size={16} className={styles.linkIcon} />
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      onBlur={handleGithubBlur}
                      placeholder="https://github.com/user/repo"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.linkInput}>
                    <ExternalLink size={16} className={styles.linkIcon} />
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      onBlur={handleLiveUrlBlur}
                      placeholder="https://myproject.com"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className={styles.section}>
                <label className={styles.label}>Timeline</label>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <Calendar size={14} />
                    <span>Created {formatDate(project.created_at)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <RefreshCw size={14} />
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className={styles.dangerZone}>
                {confirmDelete ? (
                  <div className={styles.confirmBox}>
                    <p className={styles.confirmText}>
                      Are you sure? This action cannot be undone.
                    </p>
                    <div className={styles.confirmActions}>
                      <button
                        className={styles.cancelDeleteButton}
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </button>
                      <button className={styles.deleteButton} onClick={handleConfirmDelete}>
                        <Trash2 size={16} />
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.deleteButton} onClick={handleDelete}>
                    <Trash2 size={16} />
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
