import { create } from 'zustand';
import type { Project, ProjectStatus } from '@/types';
import { getDatabase, safeJsonArray } from '@/lib/db';
import { toast } from './toast.store';

type ProjectFilter = 'all' | ProjectStatus;

interface ProjectsState {
  projects: Project[];
  selectedId: string | null;
  filter: ProjectFilter;
  isLoading: boolean;

  // Actions
  setProjects: (projects: Project[]) => void;
  setFilter: (filter: ProjectFilter) => void;
  setSelected: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  load: () => Promise<void>;
}

interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  stack_tags: string;
  github_url: string | null;
  live_url: string | null;
  icon_color: string | null;
  created_at: string;
  updated_at: string;
}

function parseProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    progress: Number(row.progress) || 0,
    stack_tags: safeJsonArray(row.stack_tags),
    github_url: row.github_url,
    live_url: row.live_url,
    icon_color: row.icon_color,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function persistInsertProject(project: Project): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    `INSERT INTO projects (
      id, name, description, status, progress, stack_tags, github_url, live_url, icon_color, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      project.id,
      project.name,
      project.description,
      project.status,
      project.progress,
      JSON.stringify(project.stack_tags),
      project.github_url,
      project.live_url,
      project.icon_color,
      project.created_at,
      project.updated_at,
    ]
  );
}

async function persistUpdateProject(project: Project): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    `UPDATE projects SET
      name = ?,
      description = ?,
      status = ?,
      progress = ?,
      stack_tags = ?,
      github_url = ?,
      live_url = ?,
      icon_color = ?,
      updated_at = ?
     WHERE id = ?`,
    [
      project.name,
      project.description,
      project.status,
      project.progress,
      JSON.stringify(project.stack_tags),
      project.github_url,
      project.live_url,
      project.icon_color,
      project.updated_at,
      project.id,
    ]
  );
}

async function persistDeleteProject(id: string): Promise<void> {
  const db = await getDatabase();
  await db.execute('DELETE FROM project_milestones WHERE project_id = ?', [id]);
  await db.execute('DELETE FROM projects WHERE id = ?', [id]);
}

export const useProjectsStore = create<ProjectsState>((set, _get) => ({
  projects: [],
  selectedId: null,
  filter: 'all',
  isLoading: false,

  setProjects: (projects) => set({ projects }),

  setFilter: (filter) => set({ filter }),

  setSelected: (id) => set({ selectedId: id }),

  addProject: (project) => {
    set((state) => ({
      projects: [project, ...state.projects],
    }));

    void persistInsertProject(project).catch((error) => {
      console.error('Failed to create project:', error);
      toast.error('Could not save project', 'Your project was added in memory but not persisted.');
    });
  },

  updateProject: (id, updates) => {
    let updatedProject: Project | null = null;

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id
          ? (updatedProject = { ...p, ...updates, updated_at: new Date().toISOString() })
          : p
      ),
    }));

    if (updatedProject) {
      void persistUpdateProject(updatedProject).catch((error) => {
        console.error('Failed to update project:', error);
        toast.error('Could not save project changes', 'Try again in a moment.');
      });
    }
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));

    void persistDeleteProject(id).catch((error) => {
      console.error('Failed to delete project:', error);
      toast.error('Could not delete project', 'The project was removed from UI but not from storage.');
    });
  },

  load: async () => {
    set({ isLoading: true });

    try {
      const db = await getDatabase();
      const rows = await db.select<ProjectRow>(
        `SELECT id, name, description, status, progress, stack_tags, github_url, live_url, icon_color, created_at, updated_at
         FROM projects
         ORDER BY datetime(updated_at) DESC, created_at DESC`
      );
      set({ projects: rows.map(parseProject) });
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Could not load projects', 'Check database availability and restart DevOS.');
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Helper to get filtered projects
export function useFilteredProjects() {
  const { projects, filter } = useProjectsStore();

  if (filter === 'all') return projects;
  return projects.filter((p) => p.status === filter);
}

// Helper to get selected project
export function useSelectedProject() {
  const { projects, selectedId } = useProjectsStore();
  return projects.find((p) => p.id === selectedId) ?? null;
}
