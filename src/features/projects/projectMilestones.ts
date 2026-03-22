import { nanoid } from 'nanoid';
import type { ProjectMilestone } from '@/types';
import { fromSqliteBool, getDatabase, toSqliteBool } from '@/lib/db';

interface MilestoneRow {
  id: string;
  project_id: string;
  title: string;
  weight: number;
  completed: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

function parseMilestone(row: MilestoneRow): ProjectMilestone {
  return {
    id: row.id,
    project_id: row.project_id,
    title: row.title,
    weight: Number(row.weight) || 0,
    completed: fromSqliteBool(Number(row.completed)),
    completed_at: row.completed_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function calculateMilestoneProgress(milestones: ProjectMilestone[]): number {
  const totalWeight = milestones.reduce((sum, milestone) => sum + Math.max(0, milestone.weight), 0);
  if (totalWeight <= 0) {
    return 0;
  }

  const completedWeight = milestones.reduce((sum, milestone) => {
    if (!milestone.completed) {
      return sum;
    }
    return sum + Math.max(0, milestone.weight);
  }, 0);

  return Math.round((completedWeight / totalWeight) * 100);
}

export async function getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
  const db = await getDatabase();
  const rows = await db.select<MilestoneRow>(
    `SELECT id, project_id, title, weight, completed, completed_at, created_at, updated_at
     FROM project_milestones
     WHERE project_id = ?
     ORDER BY created_at ASC`,
    [projectId]
  );

  return rows.map(parseMilestone);
}

export async function addProjectMilestone(projectId: string, title: string, weight: number): Promise<ProjectMilestone> {
  const db = await getDatabase();
  const id = nanoid(12);
  const now = new Date().toISOString();

  await db.execute(
    `INSERT INTO project_milestones (id, project_id, title, weight, completed, completed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, 0, NULL, ?, ?)`,
    [id, projectId, title, Math.max(1, Math.min(100, weight)), now, now]
  );

  return {
    id,
    project_id: projectId,
    title,
    weight: Math.max(1, Math.min(100, weight)),
    completed: false,
    completed_at: null,
    created_at: now,
    updated_at: now,
  };
}

export async function updateProjectMilestone(
  milestoneId: string,
  updates: Partial<Pick<ProjectMilestone, 'title' | 'weight' | 'completed'>>
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const sets: string[] = ['updated_at = ?'];
  const values: unknown[] = [now];

  if (typeof updates.title === 'string') {
    sets.push('title = ?');
    values.push(updates.title);
  }

  if (typeof updates.weight === 'number') {
    sets.push('weight = ?');
    values.push(Math.max(1, Math.min(100, updates.weight)));
  }

  if (typeof updates.completed === 'boolean') {
    sets.push('completed = ?');
    sets.push('completed_at = ?');
    values.push(toSqliteBool(updates.completed));
    values.push(updates.completed ? now : null);
  }

  values.push(milestoneId);

  await db.execute(`UPDATE project_milestones SET ${sets.join(', ')} WHERE id = ?`, values);
}

export async function deleteProjectMilestone(milestoneId: string): Promise<void> {
  const db = await getDatabase();
  await db.execute('DELETE FROM project_milestones WHERE id = ?', [milestoneId]);
}

export async function seedDefaultMilestones(projectId: string, initialProgress: number): Promise<ProjectMilestone[]> {
  const defaults = [
    { title: 'Scope and plan', weight: 25 },
    { title: 'Build core features', weight: 35 },
    { title: 'Test and refine', weight: 20 },
    { title: 'Ship and document', weight: 20 },
  ];

  const milestones: ProjectMilestone[] = [];
  const completedTarget = Math.floor(Math.max(0, Math.min(100, initialProgress)) / 25);

  for (let index = 0; index < defaults.length; index += 1) {
    const created = await addProjectMilestone(projectId, defaults[index].title, defaults[index].weight);

    if (index < completedTarget) {
      await updateProjectMilestone(created.id, { completed: true });
      milestones.push({ ...created, completed: true, completed_at: new Date().toISOString() });
    } else {
      milestones.push(created);
    }
  }

  return milestones;
}
