-- DevOS Initial Schema v1
-- Created: 2024

-- XP and gamification
CREATE TABLE IF NOT EXISTS user_stats (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  total_xp      INTEGER NOT NULL DEFAULT 0,
  level         INTEGER NOT NULL DEFAULT 1,
  rest_tokens   INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Initialize user_stats with a single row
INSERT OR IGNORE INTO user_stats (id) VALUES (1);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'planned',
  progress      INTEGER NOT NULL DEFAULT 0,
  stack_tags    TEXT NOT NULL DEFAULT '[]',
  github_url    TEXT,
  live_url      TEXT,
  icon_color    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Skills (Stack Radar)
CREATE TABLE IF NOT EXISTS skills (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  xp            INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  platform        TEXT NOT NULL DEFAULT 'other',
  url             TEXT,
  total_modules   INTEGER NOT NULL DEFAULT 1,
  done_modules    INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'in_progress',
  tech_tags       TEXT NOT NULL DEFAULT '[]',
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Time blocks
CREATE TABLE IF NOT EXISTS time_blocks (
  id            TEXT PRIMARY KEY,
  date          TEXT NOT NULL,
  start_time    TEXT NOT NULL,
  duration_min  INTEGER NOT NULL DEFAULT 30,
  title         TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'deep_work',
  project_id    TEXT,
  completed     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Focus sessions (logged Pomodoros)
CREATE TABLE IF NOT EXISTS focus_sessions (
  id            TEXT PRIMARY KEY,
  block_id      TEXT,
  duration_min  INTEGER NOT NULL,
  completed_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (block_id) REFERENCES time_blocks(id)
);

-- Streaks
CREATE TABLE IF NOT EXISTS streaks (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL UNIQUE,
  current       INTEGER NOT NULL DEFAULT 0,
  longest       INTEGER NOT NULL DEFAULT 0,
  last_date     TEXT,
  flame_level   TEXT NOT NULL DEFAULT 'none'
);

-- Initialize default streaks
INSERT OR IGNORE INTO streaks (id, type) VALUES
  ('streak_coding', 'coding'),
  ('streak_course', 'course'),
  ('streak_planning', 'planning');

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  earned_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- XP log (audit trail)
CREATE TABLE IF NOT EXISTS xp_log (
  id            TEXT PRIMARY KEY,
  amount        INTEGER NOT NULL,
  reason        TEXT NOT NULL,
  source_type   TEXT NOT NULL DEFAULT 'system',
  source_id     TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Settings (stored separately via tauri-plugin-store)
-- No table needed here

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_time_blocks_date ON time_blocks(date);
CREATE INDEX IF NOT EXISTS idx_xp_log_created ON xp_log(created_at DESC);
