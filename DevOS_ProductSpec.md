# DevOS — Product Specification
### Version 1.0 · Production Release

---

## Table of Contents

1. [Vision & Philosophy](#1-vision--philosophy)
2. [Target User](#2-target-user)
3. [Tech Stack](#3-tech-stack)
4. [Architecture Overview](#4-architecture-overview)
5. [Design System](#5-design-system)
6. [Module Specifications](#6-module-specifications)
   - 6.1 [Projects Hub](#61-projects-hub)
   - 6.2 [Stack Radar](#62-stack-radar)
   - 6.3 [Courses Tracker](#63-courses-tracker)
   - 6.4 [Timetable & Focus Planner](#64-timetable--focus-planner)
   - 6.5 [Gamification Engine](#65-gamification-engine)
   - 6.6 [Notification System](#66-notification-system)
7. [Navigation & Shell](#7-navigation--shell)
8. [Data Models](#8-data-models)
9. [State Management](#9-state-management)
10. [Animation System](#10-animation-system)
11. [Local Storage & Persistence](#11-local-storage--persistence)
12. [Settings & Customisation](#12-settings--customisation)
13. [Build & Packaging](#13-build--packaging)
14. [File & Folder Structure](#14-file--folder-structure)
15. [Claude Starter Prompts](#15-claude-starter-prompts)

---

## 1. Vision & Philosophy

**DevOS** is a personal operating system for developers and CS students. It is a single desktop app that replaces the scattered chaos of Notion tabs, GitHub graphs, random to-do lists, and course bookmarks — with one unified, beautiful, gamified workspace.

### Core Principles

| Principle | What it means |
|---|---|
| **Minimal surface, maximum depth** | Every visible element earns its place. No decorative chrome, no onboarding wizards, no bloat. |
| **Frosted glass aesthetic** | Dark base (#0a0a0f), translucent layered panels, ambient orb lighting, no harsh borders. Feels like a premium native app. |
| **Gamified but not juvenile** | XP, levels, and streaks use the same dopamine loop as games but styled with restraint. Numbers, not cartoon icons. |
| **Local-first** | All data lives on the user's machine in SQLite. No accounts, no cloud sync in v1, no network dependency. |
| **Keyboard-native** | Every critical action reachable via keyboard shortcut. Mouse is optional. |
| **Opinionated defaults** | The app decides how things are structured. Users fill in content, not configuration. |

---

## 2. Target User

**Primary:** CS students and junior developers (18–26) who are actively building projects, taking courses, and trying to break into the industry.

**Pain points addressed:**
- Projects are scattered across GitHub, Notion, and memory
- No single place tracks what technologies they actually know vs. claim to know
- Course progress lives across 4 platforms with no unified view
- Time is poorly planned — reactive not intentional
- No feedback loop showing growth over time (GitHub graph only shows commits, not learning)

---

## 3. Tech Stack

### Desktop Framework
```
Tauri 2.x (Rust + WebView2 on Windows)
```
Why: ~5MB binary (vs Electron's 150MB), near-instant startup, native OS notification API, SQLite via Tauri plugin, file system access without browser restrictions.

### Frontend
```
React 18 + TypeScript + Vite
```

### Styling
```
CSS Modules + CSS custom properties (design tokens)
No Tailwind — hand-crafted design system for full control over the frosted glass aesthetic
```

### Animation
```
Framer Motion 11
```
Why: declarative exit/enter animations, layout animations, gesture support. Used for page transitions, card reveals, progress fills, notification toasts.

### Charts & Visualisation
```
Recharts (radar chart, progress arcs)
Custom SVG for heatmap calendar
```

### Database
```
SQLite via @tauri-apps/plugin-sql
```

### Icons
```
Lucide React (consistent, minimal, tree-shakeable)
```

### Notifications (native)
```
@tauri-apps/plugin-notification
```

### Build / Package
```
Tauri bundler → .msi installer for Windows
```

---

## 4. Architecture Overview

```
DevOS/
├── src-tauri/               ← Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs          ← App entry, window config, system tray
│   │   ├── commands/        ← Tauri commands (DB queries exposed to frontend)
│   │   │   ├── projects.rs
│   │   │   ├── courses.rs
│   │   │   ├── timetable.rs
│   │   │   ├── xp.rs
│   │   │   └── notifications.rs
│   │   └── db/
│   │       ├── schema.sql   ← SQLite schema (run on first launch)
│   │       └── migrations/  ← Future schema migrations
│   └── tauri.conf.json
│
└── src/                     ← React frontend
    ├── main.tsx
    ├── App.tsx              ← Root, router, theme provider
    ├── design/
    │   ├── tokens.css       ← All CSS custom properties
    │   └── globals.css      ← Base resets, scrollbar, selection
    ├── shell/
    │   ├── Sidebar.tsx      ← Collapsible icon sidebar
    │   ├── Topbar.tsx       ← Page title, XP chip, filters
    │   └── Shell.tsx        ← Layout wrapper
    ├── modules/
    │   ├── projects/
    │   ├── stack/
    │   ├── courses/
    │   ├── timetable/
    │   └── settings/
    ├── components/          ← Shared UI primitives
    │   ├── GlassCard.tsx
    │   ├── ProgressBar.tsx
    │   ├── StatusPill.tsx
    │   ├── XPChip.tsx
    │   ├── Toast.tsx
    │   └── RadarChart.tsx
    ├── store/               ← Zustand stores
    │   ├── xp.store.ts
    │   ├── projects.store.ts
    │   ├── courses.store.ts
    │   └── timetable.store.ts
    ├── hooks/
    │   ├── useAnimatedMount.ts
    │   ├── useXP.ts
    │   └── useNotifications.ts
    └── lib/
        ├── db.ts            ← Tauri SQL wrapper
        ├── xp.ts            ← XP calculation logic
        └── dates.ts         ← Date helpers
```

---

## 5. Design System

### Colour Tokens

```css
/* Base */
--bg-base:        #0a0a0f;
--bg-panel:       rgba(255, 255, 255, 0.04);
--bg-panel-hover: rgba(255, 255, 255, 0.06);
--bg-input:       rgba(255, 255, 255, 0.06);

/* Borders */
--border-subtle:  rgba(255, 255, 255, 0.07);
--border-mid:     rgba(255, 255, 255, 0.12);
--border-strong:  rgba(255, 255, 255, 0.20);

/* Text */
--text-primary:   rgba(255, 255, 255, 0.88);
--text-secondary: rgba(255, 255, 255, 0.45);
--text-muted:     rgba(255, 255, 255, 0.25);

/* Accent — Purple (primary brand) */
--accent-purple:  #7f77dd;
--accent-purple-dim: rgba(127, 119, 221, 0.15);
--accent-purple-text: #c4bef8;

/* Accent — Teal (success, active) */
--accent-teal:    #1d9e75;
--accent-teal-dim: rgba(29, 158, 117, 0.12);
--accent-teal-text: #5dcaa5;

/* Accent — Blue (info, courses) */
--accent-blue:    #378add;
--accent-blue-dim: rgba(55, 138, 221, 0.12);
--accent-blue-text: #85b7eb;

/* Accent — Coral (warnings, paused) */
--accent-coral:   #d85a30;
--accent-coral-dim: rgba(216, 90, 48, 0.12);
--accent-coral-text: #f0997b;

/* Amber (XP, streaks) */
--accent-amber:   #ba7517;
--accent-amber-dim: rgba(186, 117, 23, 0.12);
--accent-amber-text: #fac775;
```

### Typography

```css
--font-display: 'DM Sans', sans-serif;       /* headings, numbers */
--font-body:    'IBM Plex Sans', sans-serif; /* UI labels, body */
--font-mono:    'IBM Plex Mono', monospace;  /* tech stack tags, XP numbers */
```

Load via Fontsource (bundled, no network):
```
npm install @fontsource/dm-sans @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
```

### Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `--text-2xl` | 28px | 700 | Stat numbers (XP, counts) |
| `--text-xl` | 20px | 600 | Page headings |
| `--text-lg` | 15px | 600 | Card titles, nav labels |
| `--text-md` | 13px | 500 | Body, list items |
| `--text-sm` | 11px | 500 | Labels, badges, subtitles |
| `--text-xs` | 10px | 600 | ALL CAPS section headers |

### Spacing Scale

```
4px · 8px · 12px · 16px · 20px · 24px · 32px · 48px
```

### Border Radius

```css
--radius-sm:  6px;   /* pills, small tags */
--radius-md:  10px;  /* buttons, chips */
--radius-lg:  14px;  /* cards, panels */
--radius-xl:  20px;  /* modal, large panels */
```

### Glass Card

The primary surface component. All module content lives in `GlassCard`.

```css
.glass-card {
  background: var(--bg-panel);
  border: 0.5px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 18px 20px;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.glass-card:hover {
  background: var(--bg-panel-hover);
  border-color: var(--border-mid);
}
```

### Ambient Orbs

Three absolutely-positioned blurred circles in the app background. They animate slowly (12–18s loops) to give the background a living quality without being distracting.

```
Orb A: 320×320px, rgba(99,60,180,.18),  top-left,     12s ease-in-out infinite
Orb B: 260×260px, rgba(29,158,117,.12), bottom-right, 15s ease-in-out infinite
Orb C: 200×200px, rgba(55,138,221,.10), top-right,    18s ease-in-out infinite (reverse)
```

---

## 6. Module Specifications

---

### 6.1 Projects Hub

**Purpose:** Single source of truth for every project the user is working on, has worked on, or plans to work on.

#### Views
- **All projects** (default) — sorted by last modified
- **Active** — status = active or building
- **Shipped** — completed/released projects
- **Archived** — abandoned or paused

#### Project Card (list row)
Each project displays:
- Coloured icon (auto-assigned from tech stack, user-overridable)
- Project name (editable inline on double-click)
- Tech stack tags (comma-separated, pill display)
- Progress bar (manually set 0–100%, or auto-computed from linked course modules)
- Status pill: `ACTIVE` · `BUILDING` · `SHIPPED` · `PAUSED` · `PLANNED`
- Last updated date

#### Project Detail (slide-in panel)
Clicking a project opens a right-side panel (not a new page — no navigation cost) with:
- Full description (markdown-rendered textarea)
- Tech stack (editable multi-tag input)
- GitHub / live URL links
- Linked courses (course modules that feed into this project)
- Pattern vault entries tagged to this project
- XP earned from this project
- Timeline: created → milestones → shipped

#### Add Project
Keyboard shortcut `N` opens a minimal modal:
```
Name _______________
Stack ______________  (comma-separated, shows autocomplete from stack radar)
Status [dropdown]
```
One click / Enter to save. XP awarded: +50 for creating, +100 for shipping.

#### XP Events (Projects)
| Action | XP |
|---|---|
| Create project | +50 |
| Set status → Active | +25 |
| Reach 50% progress | +75 |
| Set status → Shipped | +200 |
| Add GitHub link | +15 |
| Add live URL | +15 |
| Log a pattern from this project | +10 |

---

### 6.2 Stack Radar

**Purpose:** Visual, honest map of the user's technical skills — not a self-reported CV line, but evidence-weighted skill tracking.

#### Radar Chart
- Hexagonal SVG radar chart, 6 axes (top 6 technologies by XP)
- Animated fill on load (0 → actual value, 0.6s ease-out)
- Axes: TypeScript · React · Python · and 3 most-used from project stack tags
- Axes update dynamically as XP changes
- Click any axis label to jump to that skill's detail

#### Skill List
Below the radar, every tracked technology in a sortable table:

| Column | Detail |
|---|---|
| Name | Technology name |
| XP | Total XP earned from projects + courses using this tech |
| Confidence | Auto-computed from XP (Beginner / Learning / Comfortable / Fluent / Expert) |
| Level badge | Colour-coded pill |
| Projects | Count of projects using this tech |
| Courses | Count of courses covering this tech |
| Progress bar | XP / next confidence threshold |

#### Confidence Thresholds (XP-based)
```
Beginner:    0   – 149 XP
Learning:    150 – 399 XP
Comfortable: 400 – 799 XP
Fluent:      800 – 1499 XP
Expert:      1500+ XP
```

#### Adding a Skill
Skills are added automatically when:
- A project is created with that tech in the stack
- A course is added that maps to a tech tag
- User manually adds via `+ Add skill` button

Skills cannot be deleted, only reset (admin action in settings).

---

### 6.3 Courses Tracker

**Purpose:** Unified view of every course the user is taking or has taken, across any platform, with real progress tracking and XP rewards.

#### Course Entry Fields
```
Title            (text)
Platform         (Udemy / YouTube / Official Docs / Book / Other)
URL              (optional)
Total modules    (number — sets the progress denominator)
Completed modules (number — drives the % and progress bar)
Tech tags        (links to stack radar)
Status           (In Progress / Completed / Dropped / Planned)
Notes            (markdown textarea)
```

#### Course List Layout
Grouped by status. Each row:
- Platform icon (auto from URL domain, fallback to generic)
- Title
- Sub-label: platform · module count
- Animated progress bar
- Percentage (right-aligned, bold, accent colour)
- On hover: shows `Mark +1 module` quick action button

#### Mark +1 Module
Single click increments `completed_modules` by 1, triggers:
- Progress bar animation
- XP award (+25 XP)
- Check if course is now 100% → trigger completion notification

#### Completion Flow
When a course hits 100%:
1. Status auto-updates to `Completed`
2. Native OS notification fires: "Course complete: [name]"
3. XP awarded: +150 bonus
4. Celebration animation: brief particle burst on the row (CSS confetti, no library)
5. Card moves to "Completed" section with a checkmark

#### XP Events (Courses)
| Action | XP |
|---|---|
| Add a course | +20 |
| Complete a module | +25 |
| Reach 50% | +50 bonus |
| Complete course | +150 bonus |
| Add course notes | +10 |

---

### 6.4 Timetable & Focus Planner

**Purpose:** Daily intentional scheduling — not a calendar, but a focused view of today and this week, with Pomodoro-style session logging.

#### Views
- **Today** (default) — time blocks for the current day
- **Week** — 7-column grid, one column per day
- **Focus** — full-screen Pomodoro timer mode

#### Time Block Entry
Each block has:
```
Start time    (HH:MM, 15-min increments)
Duration      (15 / 30 / 45 / 60 / 90 / 120 min)
Title         (text — what you're working on)
Type          Deep Work / Learning / Admin / Break
Linked project (optional — connects to Projects Hub)
```

Block types render with distinct left-border accent colours:
- Deep Work → purple (`#7f77dd`)
- Learning → blue (`#378add`)
- Admin → teal (`#1d9e75`)
- Break → muted gray (dashed border)

#### Focus Mode (Pomodoro)
Keyboard shortcut `F` enters full-screen focus mode:
- Selected block fills the screen
- Countdown timer (25 min default, configurable to 45/60)
- Minimal UI: time remaining, block title, pause/stop
- On completion: XP awarded (+30), session logged, short-break prompt

#### Weekly Focus Split
Pie/bar chart showing actual time split across block types for the week. Updates live as blocks are completed.

#### XP Events (Timetable)
| Action | XP |
|---|---|
| Add a time block | +5 |
| Complete a focus session | +30 |
| Complete full day (all blocks done) | +50 |
| 5-day planning streak | +100 |

---

### 6.5 Gamification Engine

**Purpose:** The invisible layer that turns every user action into progress. Designed to be felt, not seen — rewards appear naturally, never interrupt.

#### XP System

All XP events (defined per module above) feed into a single global XP total stored in SQLite. The XP chip in the topbar always shows the current total.

#### Level System

```
Level 1:   0    – 499  XP  (Initiate)
Level 2:   500  – 1249 XP  (Builder)
Level 3:   1250 – 2499 XP  (Engineer)
Level 4:   2500 – 4499 XP  (Architect)
Level 5:   4500 – 7499 XP  (Senior)
Level 6:   7500 – 11999 XP (Principal)
Level 7:   12000+ XP        (Legend)
```

Level names are shown in the profile sidebar section and on the user's stats card.

#### Level-Up Event
When the XP threshold is crossed:
1. Topbar XP chip briefly pulses (CSS animation)
2. Native OS notification: "Level up → [Level Name]"
3. New theme unlocked (if applicable — see Settings)

#### Streak System

A streak is maintained per category:
- **Daily coding streak** — requires at least one completed focus session (Deep Work or Learning) per day
- **Course streak** — at least one module completed per day
- **Planning streak** — timetable for the day created before 10:00 AM

Streaks stored in SQLite with last-completed date. On app open, if `last_date < today - 1`, streak resets to 0.

**Streak levels:**
```
3  days  → Kindling  (no visual change)
7  days  → Flame     (orange dot on streak counter)
14 days  → Inferno   (pulsing amber dot)
30 days  → Legendary (animated amber ring)
```

**Streak protection:** Once per week, the user can use a "rest day" token to prevent a streak from breaking. Token is auto-granted every Monday at 00:00.

#### Badges

Badges are earned once and stored permanently. They appear in the Profile section.

| Badge | Condition |
|---|---|
| First Ship | Ship first project |
| Stack Expander | Add 5+ technologies to Stack Radar |
| Course Finisher | Complete first course |
| Course Machine | Complete 5 courses |
| Deep Worker | Log 10 focus sessions |
| Streak Flame | Reach 7-day daily streak |
| Architect | Reach Level 4 |
| Legend | Reach Level 7 |
| Planner | Create timetable 5 days in a row |
| Stack Fluent | Reach Fluent in any technology |

---

### 6.6 Notification System

Notifications are **native OS notifications** via `@tauri-apps/plugin-notification`. They appear in the Windows notification centre, not inside the app (to respect the minimal aesthetic).

#### Notification Events

| Trigger | Message |
|---|---|
| Course module completed (+25 XP) | "Module done. +25 XP → [course name]" |
| Course completed | "[Course name] complete. +150 XP · Level [N]" |
| Streak at risk (20:00 if nothing logged) | "Streak at risk — [N] days. Log a session before midnight." |
| Streak broken | "Streak reset. Start fresh tomorrow." |
| Level up | "Level up → [Level Name]. [N] XP total." |
| Project shipped | "[Project name] shipped. +200 XP." |
| Focus session complete | "Session done. +30 XP · Take a break." |
| Weekly recap (Sunday 20:00) | "This week: [N] XP · [N] modules · [N] focus sessions." |

#### Notification Permissions
On first launch, Tauri requests OS notification permission. If denied, notifications are silently skipped (no fallback in-app popups — keeps the UI clean).

#### Notification Schedule
Streak-at-risk and weekly recap are scheduled using Tauri's `plugin-cron` or a simple interval check on app focus/open.

---

## 7. Navigation & Shell

### Sidebar

Slim sidebar, 56px collapsed, 188px expanded on hover.

```
[Logo]         ← 32px square, gradient purple-teal, "D" letter

[Grid icon]    Projects
[Radar icon]   Stack radar
[List icon]    Courses
[Calendar icon] Timetable

[spacer]

[Person icon]  Profile
```

- Active item: `background: var(--accent-purple-dim); color: var(--accent-purple-text)`
- Hover transition: `width 0.28s cubic-bezier(0.4, 0, 0.2, 1)`
- Labels: `opacity: 0; transform: translateX(-6px)` collapsed → `opacity: 1; translateX(0)` expanded
- No tooltip needed — labels appear on hover

### Topbar

52px fixed height. Contains:
- Page title (left)
- XP chip (right) — always visible, pulsing dot
- Context filters (right of XP) — change per active module

### Page Transitions

Framer Motion `AnimatePresence` wrapping each module view:
```jsx
initial:  { opacity: 0, y: 10 }
animate:  { opacity: 1, y: 0 }
exit:     { opacity: 0, y: -6 }
transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] }
```

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` | Go to Projects |
| `2` | Go to Stack Radar |
| `3` | Go to Courses |
| `4` | Go to Timetable |
| `N` | New item (context-sensitive) |
| `F` | Enter Focus mode |
| `Esc` | Close panel / exit focus |
| `Cmd/Ctrl + ,` | Open Settings |

---

## 8. Data Models

### SQLite Schema

```sql
-- XP and gamification
CREATE TABLE user_stats (
  id            INTEGER PRIMARY KEY DEFAULT 1,
  total_xp      INTEGER NOT NULL DEFAULT 0,
  level         INTEGER NOT NULL DEFAULT 1,
  rest_tokens   INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Projects
CREATE TABLE projects (
  id            TEXT PRIMARY KEY,         -- nanoid
  name          TEXT NOT NULL,
  description   TEXT,
  status        TEXT NOT NULL DEFAULT 'planned',  -- planned|active|building|shipped|paused
  progress      INTEGER NOT NULL DEFAULT 0,       -- 0–100
  stack_tags    TEXT NOT NULL DEFAULT '[]',       -- JSON array of strings
  github_url    TEXT,
  live_url      TEXT,
  icon_color    TEXT,                             -- hex accent colour
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Skills (Stack Radar)
CREATE TABLE skills (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  xp            INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Courses
CREATE TABLE courses (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  platform        TEXT NOT NULL DEFAULT 'other',
  url             TEXT,
  total_modules   INTEGER NOT NULL DEFAULT 1,
  done_modules    INTEGER NOT NULL DEFAULT 0,
  status          TEXT NOT NULL DEFAULT 'in_progress',  -- in_progress|completed|dropped|planned
  tech_tags       TEXT NOT NULL DEFAULT '[]',
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Time blocks
CREATE TABLE time_blocks (
  id            TEXT PRIMARY KEY,
  date          TEXT NOT NULL,    -- YYYY-MM-DD
  start_time    TEXT NOT NULL,    -- HH:MM
  duration_min  INTEGER NOT NULL DEFAULT 30,
  title         TEXT NOT NULL,
  type          TEXT NOT NULL DEFAULT 'deep_work',  -- deep_work|learning|admin|break
  project_id    TEXT,
  completed     INTEGER NOT NULL DEFAULT 0,  -- 0|1 boolean
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Focus sessions (logged Pomodoros)
CREATE TABLE focus_sessions (
  id            TEXT PRIMARY KEY,
  block_id      TEXT,
  duration_min  INTEGER NOT NULL,
  completed_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (block_id) REFERENCES time_blocks(id)
);

-- Streaks
CREATE TABLE streaks (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL UNIQUE,  -- coding|course|planning
  current       INTEGER NOT NULL DEFAULT 0,
  longest       INTEGER NOT NULL DEFAULT 0,
  last_date     TEXT,   -- YYYY-MM-DD
  flame_level   TEXT NOT NULL DEFAULT 'none'  -- none|kindling|flame|inferno|legendary
);

-- Badges
CREATE TABLE badges (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  earned_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- XP log (audit trail)
CREATE TABLE xp_log (
  id            TEXT PRIMARY KEY,
  amount        INTEGER NOT NULL,
  reason        TEXT NOT NULL,
  source_id     TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 9. State Management

Use **Zustand** for all client state. Each store mirrors one domain.

```ts
// xp.store.ts
interface XPStore {
  totalXP: number
  level: number
  levelName: string
  addXP: (amount: number, reason: string, sourceId?: string) => Promise<void>
  refresh: () => Promise<void>
}

// projects.store.ts
interface ProjectsStore {
  projects: Project[]
  selected: Project | null
  filter: 'all' | 'active' | 'shipped' | 'paused'
  load: () => Promise<void>
  create: (data: CreateProjectInput) => Promise<void>
  update: (id: string, data: Partial<Project>) => Promise<void>
  setSelected: (p: Project | null) => void
}

// courses.store.ts — similar pattern

// timetable.store.ts — similar pattern
```

All stores call Tauri commands via `invoke()` which query SQLite. Stores are the single source of truth — no local component state for persisted data.

---

## 10. Animation System

### Principles
1. Animations enhance **transitions and feedback**, never decorate idle state (except ambient orbs)
2. Duration budget: micro (100ms), standard (200–300ms), cinematic (600–900ms, only for progress fills and level-up)
3. All animations respect `prefers-reduced-motion`

### Standard Motion Tokens

```ts
// tokens in framer-motion format
export const transitions = {
  page:    { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  card:    { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
  spring:  { type: 'spring', stiffness: 320, damping: 28 },
  slow:    { duration: 0.7,  ease: [0.4, 0, 0.2, 1] },
}

export const variants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -6 },
  },
  stagger: {
    visible: { transition: { staggerChildren: 0.06 } },
  },
}
```

### Key Animation Moments

| Moment | Animation |
|---|---|
| Module navigation | `fadeUp` page transition, 220ms |
| Card list on load | Staggered `fadeUp`, 60ms delay per card |
| Progress bar fill | `width: 0 → N%`, 900ms ease-out, on mount |
| XP chip on gain | Scale pulse 1→1.12→1, 300ms |
| Level up | XP chip glow + scale, 600ms, then native notification |
| Course completion | Row checkmark scales in, brief confetti (CSS), 400ms |
| Streak broken | Shake animation on streak counter, 300ms |
| Sidebar expand | `width` transition, 280ms cubic-bezier |
| Panel slide-in | `x: 40 → 0`, 240ms, backdrop fades in |

---

## 11. Local Storage & Persistence

- **All persistent data:** SQLite via `@tauri-apps/plugin-sql`
- **App preferences** (theme, sidebar state, last viewed module): `@tauri-apps/plugin-store` (JSON file in AppData)
- **No cloud sync in v1.** Roadmap for v2: optional Dropbox/iCloud sync of the SQLite file.

### Backup
Settings page includes "Export data" → exports the SQLite file to a user-chosen path. "Import data" restores from backup.

---

## 12. Settings & Customisation

Settings are accessible via `Cmd/Ctrl + ,` or sidebar profile section.

### Available Settings

**Appearance**
- Theme: Default Dark / Midnight Blue / Forest / Monochrome (unlocked by level)
- Sidebar: Always expanded / Auto-collapse

**Focus / Pomodoro**
- Default session length: 25 / 45 / 60 min
- Break reminder: On / Off
- Sound on completion: On / Off (system bell)

**Notifications**
- Streak at risk: On / Off
- XP gains: On / Off
- Weekly recap: On / Off
- Recap time: HH:MM selector

**Gamification**
- Show XP numbers: On / Off (Off hides numbers, keeps progress bars)
- Show level: On / Off

**Data**
- Export database
- Import database
- Reset all data (confirmation required)

**Unlockable Themes** (by level)
- Level 1: Default Dark (always available)
- Level 3: Midnight Blue
- Level 5: Forest
- Level 7: Monochrome

---

## 13. Build & Packaging

### Development

```bash
npm run tauri dev
```

### Production Build (Windows)

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/msi/DevOS_1.0.0_x64_en-US.msi`

### Tauri Configuration (`tauri.conf.json`)

Key settings:
```json
{
  "app": {
    "windows": [{
      "title": "DevOS",
      "width": 1200,
      "height": 760,
      "minWidth": 900,
      "minHeight": 600,
      "decorations": false,
      "transparent": true,
      "vibrancy": "dark"
    }]
  },
  "bundle": {
    "identifier": "com.devos.app",
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"]
  }
}
```

`decorations: false` removes the native Windows titlebar — DevOS renders its own custom titlebar (drag region + min/max/close buttons).

### Custom Titlebar

A thin 32px bar at the top of the window:
- `data-tauri-drag-region` attribute for window dragging
- Custom min / max / close SVG buttons (right-aligned)
- App name `DevOS` in the centre (very faint, muted)

---

## 14. File & Folder Structure

```
devos/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── icons/
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       └── commands/
│           ├── mod.rs
│           ├── projects.rs
│           ├── courses.rs
│           ├── timetable.rs
│           ├── xp.rs
│           └── notifications.rs
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── design/
│   │   ├── tokens.css
│   │   └── globals.css
│   ├── shell/
│   │   ├── Shell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── modules/
│   │   ├── projects/
│   │   │   ├── ProjectsView.tsx
│   │   │   ├── ProjectRow.tsx
│   │   │   ├── ProjectPanel.tsx
│   │   │   └── NewProjectModal.tsx
│   │   ├── stack/
│   │   │   ├── StackView.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   └── SkillRow.tsx
│   │   ├── courses/
│   │   │   ├── CoursesView.tsx
│   │   │   ├── CourseRow.tsx
│   │   │   └── NewCourseModal.tsx
│   │   ├── timetable/
│   │   │   ├── TimetableView.tsx
│   │   │   ├── TimeBlock.tsx
│   │   │   ├── FocusMode.tsx
│   │   │   └── WeekView.tsx
│   │   └── settings/
│   │       └── SettingsView.tsx
│   ├── components/
│   │   ├── GlassCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatusPill.tsx
│   │   ├── XPChip.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   └── ConfirmDialog.tsx
│   ├── store/
│   │   ├── xp.store.ts
│   │   ├── projects.store.ts
│   │   ├── courses.store.ts
│   │   └── timetable.store.ts
│   ├── hooks/
│   │   ├── useAnimatedMount.ts
│   │   ├── useXP.ts
│   │   ├── useStreaks.ts
│   │   └── useKeyboard.ts
│   └── lib/
│       ├── db.ts
│       ├── xp.ts
│       ├── streaks.ts
│       ├── nanoid.ts
│       └── dates.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

*DevOS Product Specification v1.0 — Harsha Reddy*
*Built with Tauri + React + TypeScript*
