import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import type { Project, ProjectStatus } from '@/types';
import { useProjectsStore, useFilteredProjects, useSelectedProject } from '@/stores/projects.store';
import { useXPStore } from '@/stores/xp.store';
import { toast } from '@/stores/toast.store';
import ProjectRow from './ProjectRow';
import NewProjectModal from './NewProjectModal';
import ProjectPanel from './ProjectPanel';
import WelcomeModal from './WelcomeModal';
import styles from './ProjectsView.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

type FilterTab = 'all' | ProjectStatus;

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'building', label: 'Building' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'paused', label: 'Paused' },
];

const XP_AWARDS = {
  create: 50,
  active: 25,
  shipped: 200,
  building: 15,
};

const EMPTY_STATE_COPY: Record<FilterTab, { title: string; description: string; cta: string }> = {
  all: {
    title: 'No projects yet',
    description: 'Start building something. Track milestones, earn XP, ship products.',
    cta: 'Create Project',
  },
  active: {
    title: 'No active projects',
    description: 'Set a project to active when you\'re ready to focus and execute.',
    cta: 'Create Project',
  },
  building: {
    title: 'Nothing in build',
    description: 'Projects in implementation mode appear here. Start coding to begin.',
    cta: 'Create Project',
  },
  shipped: {
    title: 'Nothing shipped',
    description: 'Completed projects earn +200 XP. Ship your first project to level up.',
    cta: 'Create Project',
  },
  paused: {
    title: 'No paused projects',
    description: 'Paused projects wait here. They\'re on hold, not forgotten.',
    cta: 'Create Project',
  },
};

export default function ProjectsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const { filter, setFilter, addProject, updateProject, deleteProject, setSelected, projects: allProjects } = useProjectsStore();
  const { addXP } = useXPStore();
  const projects = useFilteredProjects();
  const selectedProject = useSelectedProject();
  const emptyStateCopy = EMPTY_STATE_COPY[filter];

  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem('devos_welcome_seen') === '1';
    if (!hasSeenWelcome) {
      setIsWelcomeOpen(true);
    }
  }, []);

  // Keyboard shortcut for new project
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateProject = useCallback(
    (data: { name: string; stack_tags: string[]; status: ProjectStatus }) => {
      const now = new Date().toISOString();
      const project: Project = {
        id: nanoid(12),
        name: data.name,
        description: null,
        status: data.status,
        progress: 0,
        stack_tags: data.stack_tags,
        github_url: null,
        live_url: null,
        icon_color: null,
        created_at: now,
        updated_at: now,
      };
      addProject(project);

      // Award XP for creating project
      void addXP(XP_AWARDS.create, 'project_created', project.id).then((awarded) => {
        if (awarded) {
          toast.success('Project created', `+${XP_AWARDS.create} XP earned`);
        }
      });

      // Additional XP for starting active/building
      if (data.status === 'active') {
        void addXP(XP_AWARDS.active, 'project_active', project.id);
      } else if (data.status === 'building') {
        void addXP(XP_AWARDS.building, 'project_building', project.id);
      }
    },
    [addProject, addXP]
  );

  const handleUpdateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      const oldProject = allProjects.find(p => p.id === id);
      updateProject(id, updates);

      // Award XP for status changes
      if (updates.status && oldProject && updates.status !== oldProject.status) {
        if (updates.status === 'shipped') {
          void addXP(XP_AWARDS.shipped, 'project_shipped', id).then((awarded) => {
            if (awarded) {
              toast.success('Project shipped!', `+${XP_AWARDS.shipped} XP earned`);
            }
          });
        } else if (updates.status === 'active' && oldProject.status !== 'active') {
          void addXP(XP_AWARDS.active, 'project_active', id).then((awarded) => {
            if (awarded) {
              toast.info('Project activated', `+${XP_AWARDS.active} XP earned`);
            }
          });
        } else if (updates.status === 'building' && oldProject.status !== 'building') {
          void addXP(XP_AWARDS.building, 'project_building', id);
        }
      }
    },
    [updateProject, addXP, allProjects]
  );

  const handleDeleteProject = useCallback(
    (id: string) => {
      const project = allProjects.find(p => p.id === id);
      deleteProject(id);
      toast.success('Project deleted', project?.name || 'Project removed');
    },
    [deleteProject, allProjects]
  );

  const handleDuplicateProject = useCallback(
    (project: Project) => {
      const now = new Date().toISOString();
      const newProject: Project = {
        ...project,
        id: nanoid(12),
        name: `${project.name} (Copy)`,
        status: 'planned',
        progress: 0,
        created_at: now,
        updated_at: now,
      };
      addProject(newProject);
      toast.success('Project duplicated', `Created "${newProject.name}"`);
    },
    [addProject]
  );

  const handleStatusChange = useCallback(
    (id: string, status: ProjectStatus) => {
      handleUpdateProject(id, { status });
    },
    [handleUpdateProject]
  );

  const handleCloseWelcome = useCallback(() => {
    window.localStorage.setItem('devos_welcome_seen', '1');
    setIsWelcomeOpen(false);
  }, []);

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {/* Filter Tabs */}
      <div className={styles.filterRow}>
        <div className={styles.filters}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              className={`${styles.filterTab} ${filter === tab.value ? styles.filterActive : ''}`}
              onClick={() => setFilter(tab.value)}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className={styles.filterCount}>
                  {allProjects.filter(p => p.status === tab.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className={styles.newButton} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Project List or Empty State */}
      {projects.length > 0 ? (
        <div className={styles.list}>
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelected(project.id)}
              onStatusChange={(status) => handleStatusChange(project.id, status)}
              onDelete={() => handleDeleteProject(project.id)}
              onDuplicate={() => handleDuplicateProject(project)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <path
                d="M36 10L62 24V48L36 62L10 48V24L36 10Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M36 36L62 24M36 36L10 24M36 36V62"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
              <circle cx="36" cy="36" r="4" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>{emptyStateCopy.title}</h2>
          <p className={styles.emptyDescription}>{emptyStateCopy.description}</p>
          <button className={styles.emptyButton} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            {emptyStateCopy.cta}
            <span className={styles.kbd}>N</span>
          </button>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <WelcomeModal isOpen={isWelcomeOpen} onClose={handleCloseWelcome} />

      {/* Project Detail Panel */}
      <ProjectPanel
        project={selectedProject}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdateProject}
        onDelete={handleDeleteProject}
      />
    </motion.div>
  );
}
