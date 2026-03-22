# DevOS Execution Plan

## Overview

**Target:** Windows-only desktop app with 8+ week timeline
**First Module:** Projects Hub
**First Run:** Single welcome modal

---

## Tech Stack (Confirmed)

| Layer | Technology | Why |
|-------|------------|-----|
| Desktop Runtime | Tauri 2.x | 5MB binary, native performance, SQLite built-in |
| Frontend | React 18 + TypeScript | Modern, type-safe, excellent tooling |
| Build | Vite | Instant HMR, fast builds |
| State | Zustand | Minimal boilerplate, excellent TS support |
| Styling | CSS Modules + Custom Properties | Full control for frosted glass aesthetic |
| Animation | Framer Motion 11 | Declarative, layout animations, gestures |
| Charts | Recharts + Custom SVG | Radar chart, progress arcs |
| Icons | Lucide React | Consistent, tree-shakeable |
| Database | SQLite via @tauri-apps/plugin-sql | Local-first, zero network dependency |
| Fonts | Fontsource (bundled) | DM Sans, IBM Plex Sans/Mono |

---

## Phase Breakdown

```
Week 1-2    ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░  Foundation & Shell
Week 3-4    ░░░░░░░░░░░░░░░░░░░░████████████████████░░░░  Projects Hub
Week 5      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████  Gamification Engine
Week 6      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Stack Radar
Week 7      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Courses Tracker
Week 8      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Timetable & Focus
Week 9+     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  Polish & Package
```

---

## Phase 1: Foundation & Shell (Week 1-2)

### Goals
- Tauri project scaffolding with SQLite
- Design system (tokens, fonts, glass effect)
- App shell (titlebar, sidebar, topbar)
- Routing and page transitions
- Welcome modal

### Tasks

#### Day 1-2: Project Scaffolding
```
□ Initialize Tauri 2.x + React + TypeScript + Vite
□ Configure tauri.conf.json (frameless window, transparent)
□ Set up folder structure per spec
□ Install dependencies:
  - @tauri-apps/plugin-sql
  - @tauri-apps/plugin-notification
  - @tauri-apps/plugin-store
  - framer-motion
  - recharts
  - lucide-react
  - zustand
  - nanoid
  - @fontsource/dm-sans
  - @fontsource/ibm-plex-sans
  - @fontsource/ibm-plex-mono
□ Configure TypeScript paths
□ Create SQLite schema + init on first launch
```

#### Day 3-4: Design System
```
□ Create tokens.css with all design tokens:
  - Colors (base, text, borders, accents)
  - Typography scale
  - Spacing scale
  - Border radius
  - Shadows
  - Transitions
□ Create globals.css:
  - CSS reset
  - Scrollbar styling
  - Selection styling
  - Reduced motion query
□ Import fonts via Fontsource
□ Build GlassCard component
□ Build ProgressBar component (animated)
□ Build StatusPill component
□ Build XPChip component
□ Build Toast component
```

#### Day 5-7: App Shell
```
□ Custom titlebar with drag region + window controls
□ Sidebar component:
  - Collapsed (56px) / Expanded (188px) states
  - Hover-triggered expansion
  - Navigation items with icons
  - Active state indicator
  - Label fade animation
□ Topbar component:
  - Page title (dynamic)
  - XP chip (always visible)
  - Context filters (module-specific)
□ Ambient orbs background (3 animated blurs)
□ Set up React Router
□ AnimatePresence page transitions
□ Keyboard navigation (1-4 for modules, Cmd+,)
```

#### Day 8-10: Rust Backend Setup
```
□ Configure Tauri SQL plugin
□ Create database initialization command
□ Set up commands module structure:
  - src-tauri/src/commands/mod.rs
  - src-tauri/src/commands/projects.rs (stub)
  - src-tauri/src/commands/xp.rs (stub)
□ Create AppState with database pool
□ Implement schema migration on first launch
□ Test database operations
```

### Deliverable
A working app shell with:
- Glassmorphic sidebar that expands on hover
- Custom titlebar with min/max/close
- Animated page transitions between placeholder views
- Design system fully implemented

---

## Phase 2: Projects Hub (Week 3-4)

### Goals
- Full CRUD for projects
- Project list with filters
- Project detail panel
- XP integration

### Tasks

#### Day 1-3: Projects Backend
```
□ Implement Rust commands:
  - get_projects(filter: Option<String>)
  - get_project(id: String)
  - create_project(data: CreateProjectInput)
  - update_project(id: String, data: UpdateProjectInput)
  - delete_project(id: String)
□ Implement project filtering (all/active/shipped/paused)
□ Add nanoid generation for IDs
□ Test all commands via Tauri invoke
```

#### Day 4-6: Projects Store & UI
```
□ Create projects.store.ts with Zustand:
  - projects: Project[]
  - selected: Project | null
  - filter: 'all' | 'active' | 'shipped' | 'paused'
  - load(), create(), update(), setSelected()
□ Build ProjectsView.tsx:
  - Filter tabs (All / Active / Shipped / Archived)
  - Empty state for no projects
□ Build ProjectRow.tsx:
  - Colored icon (based on stack)
  - Name (inline editable)
  - Stack tags (pill display)
  - Progress bar
  - Status pill
  - Last updated date
  - Staggered entrance animation
□ Build TagInput.tsx (reusable):
  - Comma-separated input
  - Autocomplete from existing tags
  - Pill display for tags
```

#### Day 7-9: Project Detail Panel
```
□ Build ProjectPanel.tsx (slide-in from right):
  - Entry animation (x: 40 → 0)
  - Backdrop overlay (click to close)
  - Escape key to close
□ Panel sections:
  - Header (name, status dropdown, icon)
  - Description (markdown textarea)
  - Tech stack (TagInput)
  - Links (GitHub, live URL)
  - XP earned display
  - Timeline (created → shipped)
□ Build MarkdownEditor.tsx:
  - Basic markdown preview
  - Auto-save on blur
```

#### Day 10-12: New Project Modal + Polish
```
□ Build NewProjectModal.tsx:
  - Triggered by 'N' key
  - Minimal form: Name, Stack, Status
  - Stack autocomplete from stack radar
  - Enter to save
□ Integrate XP awards:
  - +50 XP on create
  - +25 XP on active
  - +200 XP on shipped
  - +15 XP on adding links
□ Add status change animations
□ Test all interactions end-to-end
```

### Deliverable
Fully functional Projects Hub with:
- Create/read/update projects
- Filter views
- Slide-in detail panel
- XP integration
- Keyboard shortcuts

---

## Phase 3: Gamification Engine (Week 5)

### Goals
- Global XP system
- Level progression
- Streaks
- Badges

### Tasks

#### Day 1-2: XP System
```
□ Implement Rust commands:
  - get_user_stats() → (total_xp, level, streaks)
  - add_xp(amount, reason, source_id)
  - get_xp_log(limit) → XPLogEntry[]
□ Create xp.store.ts:
  - totalXP, level, levelName
  - addXP(amount, reason, sourceId)
  - refresh()
□ Build level calculation logic:
  - Level thresholds (per spec)
  - Level name mapping
□ Build XP chip animations:
  - Count-up animation
  - Scale pulse on gain
□ Implement level-up detection:
  - Glow effect
  - Native OS notification
```

#### Day 3-4: Streaks
```
□ Implement streak commands:
  - get_streaks() → Streak[]
  - update_streak(type: 'coding' | 'course' | 'planning')
  - check_streak_status() (called on app open)
□ Streak logic:
  - Increment if last_date === yesterday or today
  - Reset if last_date < yesterday - 1
  - Flame level calculation
□ Rest day token:
  - Auto-grant every Monday
  - Consume to prevent streak break
□ Streak at risk notification (8:00 PM check)
```

#### Day 5-6: Badges
```
□ Implement badge commands:
  - get_badges() → Badge[]
  - award_badge(slug)
  - check_badge_eligibility(action)
□ Badge awarding logic for each badge:
  - First Ship (project shipped)
  - Stack Expander (5+ skills)
  - Course Finisher (first course complete)
  - etc.
□ Build Badge.tsx component
□ Badge notification on earn
```

### Deliverable
Complete gamification engine:
- XP awards from all actions
- Level progression with notifications
- Streak tracking with protection
- Badge system

---

## Phase 4: Stack Radar (Week 6)

### Goals
- Skills tracking
- Radar chart visualization
- Confidence levels

### Tasks

#### Day 1-2: Skills Backend
```
□ Implement Rust commands:
  - get_skills() → Skill[]
  - add_skill(name)
  - add_skill_xp(name, amount)
  - get_top_skills(limit: 6) → for radar
□ Auto-create skills:
  - When project created with new tech
  - When course added with new tech
□ Confidence calculation:
  - Based on XP thresholds per spec
```

#### Day 3-4: Radar Chart
```
□ Build RadarChart.tsx (SVG):
  - Hexagonal shape
  - 6 axes (top skills by XP)
  - Animated fill on mount (0 → value)
  - Axis labels (clickable)
  - Hover tooltips
□ Responsive sizing
□ Empty state (fewer than 3 skills)
```

#### Day 5-6: Stack View
```
□ Build StackView.tsx:
  - Radar chart section
  - Skill list section
□ Build SkillRow.tsx:
  - Name
  - XP total
  - Confidence level badge
  - Projects count
  - Courses count
  - Progress to next level
□ Sorting (by XP, name, confidence)
□ Manual skill add button
```

### Deliverable
Stack Radar view with:
- Dynamic radar chart
- Skill list with confidence levels
- Auto-population from projects/courses

---

## Phase 5: Courses Tracker (Week 7)

### Goals
- Course CRUD
- Module progress tracking
- Completion flow

### Tasks

#### Day 1-2: Courses Backend
```
□ Implement Rust commands:
  - get_courses(filter)
  - create_course(data)
  - update_course(id, data)
  - mark_module(id) → increments done_modules
  - delete_course(id)
□ Completion detection:
  - Auto-set status to 'completed' at 100%
```

#### Day 3-4: Courses UI
```
□ Build CoursesView.tsx:
  - Grouped by status (In Progress / Completed / Planned / Dropped)
  - Group headers with counts
□ Build CourseRow.tsx:
  - Platform icon
  - Title
  - Platform + module count subtitle
  - Animated progress bar
  - Percentage (bold, colored)
  - Hover: "Mark +1" button
□ Mark +1 interaction:
  - Optimistic update
  - Progress bar animation
  - +25 XP award
```

#### Day 5-6: Course Completion + Modal
```
□ Build completion flow:
  - Auto status change
  - Checkmark animation
  - CSS confetti burst
  - +150 XP bonus
  - Native notification
  - Move to Completed section
□ Build NewCourseModal.tsx:
  - Title, Platform (dropdown), URL
  - Total modules
  - Tech tags
□ Link tech tags to Stack Radar
```

### Deliverable
Courses Tracker with:
- Course list grouped by status
- Quick module marking
- Completion celebrations
- XP integration

---

## Phase 6: Timetable & Focus (Week 8)

### Goals
- Time block scheduling
- Today / Week views
- Pomodoro focus mode

### Tasks

#### Day 1-2: Timetable Backend
```
□ Implement Rust commands:
  - get_blocks(date) → TimeBlock[]
  - get_week_blocks(start_date) → grouped
  - create_block(data)
  - update_block(id, data)
  - complete_block(id)
  - log_focus_session(block_id, duration)
```

#### Day 3-4: Today View
```
□ Build TimetableView.tsx:
  - View switcher (Today / Week)
  - Date navigation
□ Build TodayView.tsx:
  - Time column (6 AM - 12 AM)
  - Block slots
□ Build TimeBlock.tsx:
  - Left border by type (color-coded)
  - Title, time, duration
  - Linked project indicator
  - Click to edit
□ Add block modal:
  - Start time, duration, title
  - Type selector
  - Project link (optional)
```

#### Day 5-6: Focus Mode
```
□ Build FocusMode.tsx (fullscreen):
  - Triggered by 'F' key
  - Selected block fills screen
  - Large countdown timer
  - Block title
  - Pause / Stop controls
  - Minimal, distraction-free UI
□ Timer logic:
  - Configurable duration (25/45/60)
  - Audio cue on completion (system bell)
  - +30 XP on complete
  - Session logged to focus_sessions
□ Break reminder prompt
```

#### Day 7: Week View + Polish
```
□ Build WeekView.tsx:
  - 7-column grid
  - Day headers with dates
  - Compact block display
  - Click to view day
□ Weekly focus split chart:
  - Pie/bar chart
  - By block type
  - Animate on load
```

### Deliverable
Timetable with:
- Daily/weekly scheduling
- Full-screen focus mode
- Session logging
- Time analytics

---

## Phase 7: Polish & Package (Week 9+)

### Goals
- Settings page
- Welcome modal
- Performance optimization
- Windows installer

### Tasks

#### Settings
```
□ Build SettingsView.tsx with sections:
  - Appearance (theme, sidebar)
  - Focus (duration, break, sound)
  - Notifications (toggles for each type)
  - Gamification (show/hide XP, levels)
  - Data (export, import, reset)
□ Theme switching (unlockable by level)
□ Persist settings via @tauri-apps/plugin-store
```

#### Welcome Modal
```
□ Build WelcomeModal.tsx:
  - Show on first launch only
  - Brief intro to DevOS
  - Keyboard shortcuts highlight
  - "Get Started" dismisses permanently
  - Clean, minimal design
```

#### Notifications
```
□ Schedule streak-at-risk (8 PM daily)
□ Weekly recap (Sunday 8 PM)
□ Handle notification permissions
```

#### Polish
```
□ Loading states for all data fetches
□ Error handling with toast notifications
□ Empty states for all modules
□ Reduced motion support
□ Accessibility audit (keyboard nav, focus rings)
□ Performance profiling
□ Memory leak checks
```

#### Packaging
```
□ Configure MSI installer
□ App icon (32x32, 128x128, icon.ico)
□ Installer graphics
□ Test clean install on Windows
□ Test upgrade path
□ Create release build
```

### Deliverable
Production-ready Windows installer with:
- All features polished
- Settings complete
- Notifications working
- Clean install experience

---

## Success Metrics (v1)

| Metric | Target |
|--------|--------|
| Cold start time | < 1.5 seconds |
| Installer size | < 10 MB |
| Memory usage (idle) | < 80 MB |
| XP gain latency | < 100ms perceived |
| Page transition | < 250ms |
| Database operations | < 50ms |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Tauri 2.x breaking changes | Pin exact versions, test early |
| SQLite performance | Use indexes, batch writes |
| Framer Motion bundle size | Tree-shake unused features |
| Windows notification quirks | Early testing, graceful fallback |
| Design drift | Weekly design review against spec |

---

## Definition of Done (Per Feature)

- [ ] Matches design spec visually
- [ ] Animations are smooth (60fps)
- [ ] Keyboard navigation works
- [ ] XP integration complete
- [ ] Empty states implemented
- [ ] Error states handled
- [ ] TypeScript has no errors
- [ ] Works on Windows 10/11

---

*DevOS Execution Plan v1.0*
*Estimated: 9+ weeks to production*
