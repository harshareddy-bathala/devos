import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import type { ProjectStatus } from '@/types';
import styles from './NewProjectModal.module.css';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; stack_tags: string[]; status: ProjectStatus }) => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planned', label: 'Planned' },
  { value: 'active', label: 'Active' },
  { value: 'building', label: 'Building' },
];

export default function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [stackInput, setStackInput] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('planned');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setName('');
      setStackInput('');
      setStatus('planned');
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    setError('');

    const stackTags = stackInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSubmit({ name: name.trim(), stack_tags: stackTags, status });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.modalLayer} onClick={onClose}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Create project"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.header}>
                <div>
                  <h2 className={styles.title}>New Project</h2>
                  <p className={styles.subtitle}>
                    <Zap size={12} className={styles.subtitleIcon} />
                    +50 XP for creating a new project
                  </p>
                </div>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="project-name">
                    Name
                  </label>
                  <input
                    ref={inputRef}
                    id="project-name"
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My awesome project"
                    autoComplete="off"
                  />
                  {error && <span className={styles.error}>{error}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="project-stack">
                    Tech Stack
                  </label>
                  <input
                    id="project-stack"
                    type="text"
                    className={styles.input}
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    autoComplete="off"
                  />
                  <span className={styles.hint}>Separate with commas</span>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Status</label>
                  <div className={styles.statusOptions}>
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`${styles.statusOption} ${
                          status === option.value ? styles.statusActive : ''
                        }`}
                        onClick={() => setStatus(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.actions}>
                  <button type="button" className={styles.cancelButton} onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!name.trim()}
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
