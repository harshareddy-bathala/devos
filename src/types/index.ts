// DevOS Type Definitions

export type ProjectStatus = 'planned' | 'active' | 'building' | 'shipped' | 'paused';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  progress: number;
  stack_tags: string[]; // Parsed from JSON
  github_url: string | null;
  live_url: string | null;
  icon_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  weight: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CourseStatus = 'in_progress' | 'completed' | 'dropped' | 'planned';

export interface Course {
  id: string;
  title: string;
  platform: string;
  url: string | null;
  total_modules: number;
  done_modules: number;
  status: CourseStatus;
  tech_tags: string[]; // Parsed from JSON
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ConfidenceLevel = 'beginner' | 'learning' | 'comfortable' | 'fluent' | 'expert';

export interface Skill {
  id: string;
  name: string;
  xp: number;
  confidence: ConfidenceLevel;
  created_at: string;
}

export type BlockType = 'deep_work' | 'learning' | 'admin' | 'break';

export interface TimeBlock {
  id: string;
  date: string;
  start_time: string;
  duration_min: number;
  title: string;
  type: BlockType;
  project_id: string | null;
  completed: boolean;
  created_at: string;
}

export interface FocusSession {
  id: string;
  block_id: string | null;
  duration_min: number;
  completed_at: string;
}

export type StreakType = 'coding' | 'course' | 'planning';
export type FlameLevel = 'none' | 'kindling' | 'flame' | 'inferno' | 'legendary';

export interface Streak {
  id: string;
  type: StreakType;
  current: number;
  longest: number;
  last_date: string | null;
  flame_level: FlameLevel;
}

export interface Badge {
  id: string;
  slug: string;
  earned_at: string;
}

export interface XPLogEntry {
  id: string;
  amount: number;
  reason: string;
  source_type: string;
  source_id: string | null;
  created_at: string;
}

export interface UserStats {
  total_xp: number;
  level: number;
  level_name: string;
  xp_to_next_level: number;
  rest_tokens: number;
}

// Level configuration
export const LEVEL_THRESHOLDS: { threshold: number; name: string }[] = [
  { threshold: 0, name: 'Novice' },
  { threshold: 250, name: 'Apprentice' },
  { threshold: 750, name: 'Developer' },
  { threshold: 1500, name: 'Engineer' },
  { threshold: 3000, name: 'Senior' },
  { threshold: 5000, name: 'Staff' },
  { threshold: 8000, name: 'Principal' },
  { threshold: 12000, name: 'Architect' },
  { threshold: 18000, name: 'Fellow' },
  { threshold: 25000, name: 'Legend' },
];

// Skill confidence thresholds
export const CONFIDENCE_THRESHOLDS: { threshold: number; level: ConfidenceLevel }[] = [
  { threshold: 0, level: 'beginner' },
  { threshold: 100, level: 'learning' },
  { threshold: 300, level: 'comfortable' },
  { threshold: 600, level: 'fluent' },
  { threshold: 1000, level: 'expert' },
];
