# DevOS Architecture

## System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DEVOS APPLICATION                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                              PRESENTATION LAYER                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐   │  │
│  │  │                            SHELL CONTAINER                                  │   │  │
│  │  │   ┌──────────┐    ┌───────────────────────────────────────────────────┐    │   │  │
│  │  │   │ Custom   │    │                    TOPBAR                          │    │   │  │
│  │  │   │ Titlebar │    │  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │    │   │  │
│  │  │   │ ─ ─ □ ✕  │    │  │Page Title│  │ XP Chip  │  │ Context Filters│    │    │   │  │
│  │  │   └──────────┘    │  │ (dynamic)│  │⚡ 2,450  │  │[All][Active]...│    │    │   │  │
│  │  │                   │  └──────────┘  └──────────┘  └───────────────┘    │    │   │  │
│  │  │   ┌──────────┐    └───────────────────────────────────────────────────┘    │   │  │
│  │  │   │ SIDEBAR  │                                                              │   │  │
│  │  │   │          │    ┌───────────────────────────────────────────────────┐    │   │  │
│  │  │   │ ┌──────┐ │    │                  MAIN CONTENT AREA                 │    │   │  │
│  │  │   │ │ Logo │ │    │   ╔══════════════════════════════════════════╗    │    │   │  │
│  │  │   │ │  D   │ │    │   ║           ACTIVE MODULE VIEW              ║    │    │   │  │
│  │  │   │ └──────┘ │    │   ║                                           ║    │    │   │  │
│  │  │   │          │    │   ║  ┌─────────────────────────────────────┐  ║    │    │   │  │
│  │  │   │ ●────────│    │   ║  │                                     │  ║    │    │   │  │
│  │  │   │ Projects │    │   ║  │         GLASS CARD GRID             │  ║    │    │   │  │
│  │  │   │ ○────────│    │   ║  │                                     │  ║    │    │   │  │
│  │  │   │ Stack    │    │   ║  │    ┌───────┐ ┌───────┐ ┌───────┐   │  ║    │    │   │  │
│  │  │   │ ○────────│    │   ║  │    │ Card  │ │ Card  │ │ Card  │   │  ║    │    │   │  │
│  │  │   │ Courses  │    │   ║  │    │   1   │ │   2   │ │   3   │   │  ║    │    │   │  │
│  │  │   │ ○────────│    │   ║  │    └───────┘ └───────┘ └───────┘   │  ║    │    │   │  │
│  │  │   │ Timetable│    │   ║  │                                     │  ║    │    │   │  │
│  │  │   │          │    │   ║  └─────────────────────────────────────┘  ║    │    │   │  │
│  │  │   │          │    │   ║                                           ║    │    │   │  │
│  │  │   │ ─────────│    │   ╚══════════════════════════════════════════╝    │    │   │  │
│  │  │   │          │    │                                                    │    │   │  │
│  │  │   │ ○────────│    │   ┌───────────────────────────────────────────┐   │    │   │  │
│  │  │   │ Profile  │    │   │              SLIDE-IN PANEL               │   │    │   │  │
│  │  │   │ ○────────│    │   │        (Project/Course Details)           │   │    │   │  │
│  │  │   │ Settings │    │   └───────────────────────────────────────────┘   │    │   │  │
│  │  │   └──────────┘    └───────────────────────────────────────────────────┘    │   │  │
│  │  └─────────────────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐   │  │
│  │  │                         AMBIENT BACKGROUND LAYER                            │   │  │
│  │  │      ◉ Orb A (purple)            ◉ Orb C (blue)                             │   │  │
│  │  │          320px                       200px                                   │   │  │
│  │  │                      ◉ Orb B (teal)                                         │   │  │
│  │  │                          260px                                               │   │  │
│  │  └─────────────────────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND (React)                                      │
│                                                                                          │
│  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐               │
│  │    UI COMPONENTS  │    │   ZUSTAND STORES  │    │      HOOKS        │               │
│  │                   │    │                   │    │                   │               │
│  │  GlassCard        │◄──►│  xp.store.ts      │◄──►│  useXP()         │               │
│  │  ProgressBar      │    │  projects.store   │    │  useStreaks()    │               │
│  │  StatusPill       │    │  courses.store    │    │  useKeyboard()   │               │
│  │  XPChip           │    │  timetable.store  │    │  useAnimatedMount│               │
│  │  RadarChart       │    │                   │    │                   │               │
│  └───────────────────┘    └─────────┬─────────┘    └───────────────────┘               │
│                                     │                                                    │
│                                     │ invoke()                                           │
│                                     ▼                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              TAURI BRIDGE (IPC)                                   │   │
│  │   @tauri-apps/api/tauri.invoke('command_name', { payload })                       │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                              │
                                              │ Tauri Commands
                                              ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    BACKEND (Rust/Tauri)                                  │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              TAURI COMMANDS (src/commands/)                       │   │
│  │                                                                                   │   │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │   │
│  │   │  projects.rs    │  │   courses.rs    │  │  timetable.rs   │                  │   │
│  │   │                 │  │                 │  │                 │                  │   │
│  │   │  get_projects() │  │  get_courses()  │  │  get_blocks()   │                  │   │
│  │   │  create_project │  │  create_course  │  │  create_block   │                  │   │
│  │   │  update_project │  │  update_course  │  │  complete_block │                  │   │
│  │   │  delete_project │  │  mark_module()  │  │  start_session  │                  │   │
│  │   └─────────────────┘  └─────────────────┘  └─────────────────┘                  │   │
│  │                                                                                   │   │
│  │   ┌─────────────────┐  ┌─────────────────┐                                       │   │
│  │   │     xp.rs       │  │ notifications.rs │                                       │   │
│  │   │                 │  │                 │                                        │   │
│  │   │  add_xp()       │  │  send_native()  │                                        │   │
│  │   │  get_stats()    │  │  schedule()     │                                        │   │
│  │   │  check_level()  │  │  weekly_recap() │                                        │   │
│  │   │  update_streak()│  │                 │                                        │   │
│  │   └─────────────────┘  └─────────────────┘                                       │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
│                                              │                                           │
│                                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              DATA LAYER (SQLite)                                  │   │
│  │                                                                                   │   │
│  │   devos.db (AppData/Local/com.devos.app/)                                        │   │
│  │                                                                                   │   │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │   │
│  │   │  user_stats  │  │   projects   │  │    skills    │  │   courses    │        │   │
│  │   │  ─────────── │  │  ─────────── │  │  ─────────── │  │  ─────────── │        │   │
│  │   │  total_xp    │  │  id          │  │  id          │  │  id          │        │   │
│  │   │  level       │  │  name        │  │  name        │  │  title       │        │   │
│  │   │  rest_tokens │  │  status      │  │  xp          │  │  platform    │        │   │
│  │   └──────────────┘  │  progress    │  │  created_at  │  │  total_mod   │        │   │
│  │                     │  stack_tags  │  └──────────────┘  │  done_mod    │        │   │
│  │   ┌──────────────┐  └──────────────┘                    │  tech_tags   │        │   │
│  │   │ time_blocks  │                                      └──────────────┘        │   │
│  │   │ ─────────────│  ┌──────────────┐  ┌──────────────┐                          │   │
│  │   │ id           │  │   streaks    │  │   badges     │  ┌──────────────┐        │   │
│  │   │ date         │  │  ─────────── │  │  ─────────── │  │   xp_log     │        │   │
│  │   │ start_time   │  │  type        │  │  slug        │  │  ─────────── │        │   │
│  │   │ duration_min │  │  current     │  │  earned_at   │  │  amount      │        │   │
│  │   │ title        │  │  longest     │  └──────────────┘  │  reason      │        │   │
│  │   │ type         │  │  last_date   │                    │  source_id   │        │   │
│  │   │ project_id   │  │  flame_level │  ┌──────────────┐  │  created_at  │        │   │
│  │   │ completed    │  └──────────────┘  │focus_sessions│  └──────────────┘        │   │
│  │   └──────────────┘                    │  ─────────── │                          │   │
│  │                                       │  block_id    │                          │   │
│  │                                       │  duration_min│                          │   │
│  │                                       │  completed_at│                          │   │
│  │                                       └──────────────┘                          │   │
│  └──────────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Module Relationship Diagram

```
                              ┌─────────────────────┐
                              │   GAMIFICATION      │
                              │      ENGINE         │
                              │                     │
                              │  ┌───────────────┐  │
                              │  │  XP System    │  │
                              │  │  ─────────    │  │
                              │  │  +50 create   │  │
                              │  │  +200 ship    │  │
                              │  │  +25 module   │  │
                              │  │  +30 focus    │  │
                              │  └───────┬───────┘  │
                              │          │          │
                              │  ┌───────▼───────┐  │
                              │  │  Level System │  │
                              │  │  ─────────    │  │
                              │  │  L1: Initiate │  │
                              │  │  L7: Legend   │  │
                              │  └───────┬───────┘  │
                              │          │          │
                              │  ┌───────▼───────┐  │
                              │  │    Badges     │  │
                              │  │  ─────────    │  │
                              │  │  First Ship   │  │
                              │  │  Stack Fluent │  │
                              │  └───────────────┘  │
                              └─────────┬───────────┘
                                        │
              ┌──────────────┬──────────┴──────────┬──────────────┐
              │              │                     │              │
              ▼              ▼                     ▼              ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   PROJECTS HUB   │ │   STACK RADAR    │ │  COURSES TRACKER │ │    TIMETABLE     │
│                  │ │                  │ │                  │ │                  │
│ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌──────────────┐ │ │ ┌──────────────┐ │
│ │  Project     │ │ │ │ Radar Chart  │ │ │ │   Course     │ │ │ │  Time Block  │ │
│ │    Card      │ │ │ │   (Top 6)    │ │ │ │    Row       │ │ │ │              │ │
│ │              │ │ │ │              │ │ │ │              │ │ │ │ ┌──────────┐ │ │
│ │  ○ Name      │ │ │ │      ◇       │ │ │ │ ◉ Title     │ │ │ │ │Deep Work │ │ │
│ │  ○ Stack     │─┼─┼─│►    ╱ ╲     │ │ │ │ ○ Platform  │ │ │ │ │Learning  │ │ │
│ │  ○ Progress  │ │ │ │   ◇───◇     │ │ │ │ ▓▓▓▓░░ 67%  │ │ │ │ │Admin     │ │ │
│ │  ○ Status    │ │ │ │    ╲ ╱      │ │ │ │ ○ Tech Tags │─┼─│ │ │Break     │ │ │
│ │              │ │ │ │      ◇       │ │ │ │              │ │ │ │ └──────────┘ │ │
│ └──────────────┘ │ │ └──────┬───────┘ │ │ └──────────────┘ │ │ └──────────────┘ │
│                  │ │        │         │ │                  │ │                  │
│ ┌──────────────┐ │ │ ┌──────▼───────┐ │ │ [Mark +1 Module] │ │ ┌──────────────┐ │
│ │Detail Panel  │ │ │ │  Skill List  │ │ │        │         │ │ │  Focus Mode  │ │
│ │              │ │ │ │              │ │ │        │ +25 XP  │ │ │              │ │
│ │ Description  │ │ │ │ TS  ▓▓▓▓░   │ │ │        ▼         │ │ │   25:00      │ │
│ │ Timeline     │ │ │ │ React ▓▓▓░░ │ │ │ [100% Complete]  │ │ │   ─────      │ │
│ │ Linked Items │◄┼─┼─│ Python ▓▓░░░│◄┼─┼─│   +150 XP       │ │ │  ▶ Pause     │ │
│ │ XP Earned    │ │ │ │ Go  ▓░░░░   │ │ │                  │ │ │  ■ Stop      │ │
│ └──────────────┘ │ │ └──────────────┘ │ │                  │ │ │              │ │
│                  │ │                  │ │                  │ │ │  +30 XP/done │ │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘ └──────┬─────────┘
         │                    │                    │                  │
         │    stack_tags      │    tech_tags       │    project_id    │
         └────────────────────┴────────────────────┴──────────────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │  STREAKS SYSTEM   │
                              │                   │
                              │  coding ──► 🔥 7d │
                              │  course ──► 🔥 3d │
                              │ planning ──► 🔥 5d│
                              └───────────────────┘
```

---

## Component Hierarchy

```
App.tsx
├── ThemeProvider
│   └── KeyboardProvider
│       └── Shell.tsx
│           ├── CustomTitlebar.tsx
│           │   ├── DragRegion
│           │   └── WindowControls (min/max/close)
│           │
│           ├── Sidebar.tsx
│           │   ├── Logo.tsx
│           │   ├── NavItem.tsx (×5)
│           │   └── ProfileButton.tsx
│           │
│           ├── Topbar.tsx
│           │   ├── PageTitle.tsx
│           │   ├── XPChip.tsx
│           │   │   ├── XPNumber
│           │   │   ├── LevelBadge
│           │   │   └── PulseDot
│           │   └── ContextFilters.tsx
│           │
│           ├── AmbientOrbs.tsx
│           │   ├── Orb (purple)
│           │   ├── Orb (teal)
│           │   └── Orb (blue)
│           │
│           └── MainContent.tsx
│               └── AnimatePresence
│                   ├── ProjectsView.tsx
│                   │   ├── ProjectList.tsx
│                   │   │   └── ProjectRow.tsx (×N)
│                   │   │       ├── ProjectIcon
│                   │   │       ├── StackTags
│                   │   │       ├── ProgressBar
│                   │   │       └── StatusPill
│                   │   ├── ProjectPanel.tsx (slide-in)
│                   │   │   ├── MarkdownEditor
│                   │   │   ├── TagInput
│                   │   │   └── Timeline
│                   │   └── NewProjectModal.tsx
│                   │
│                   ├── StackView.tsx
│                   │   ├── RadarChart.tsx (SVG)
│                   │   └── SkillTable.tsx
│                   │       └── SkillRow.tsx (×N)
│                   │
│                   ├── CoursesView.tsx
│                   │   ├── CourseGroup.tsx (by status)
│                   │   │   └── CourseRow.tsx (×N)
│                   │   └── NewCourseModal.tsx
│                   │
│                   ├── TimetableView.tsx
│                   │   ├── TodayView.tsx
│                   │   │   └── TimeBlock.tsx (×N)
│                   │   ├── WeekView.tsx
│                   │   └── FocusMode.tsx (fullscreen)
│                   │       ├── Timer
│                   │       ├── BlockTitle
│                   │       └── Controls
│                   │
│                   └── SettingsView.tsx
│                       ├── AppearanceSettings
│                       ├── FocusSettings
│                       ├── NotificationSettings
│                       └── DataSettings

Shared Components (src/components/)
├── GlassCard.tsx          ← Primary container
├── ProgressBar.tsx        ← Animated fill bar
├── StatusPill.tsx         ← ACTIVE | SHIPPED | etc
├── XPChip.tsx             ← Topbar XP display
├── Badge.tsx              ← Achievement badge
├── Toast.tsx              ← Notification toast
├── ConfirmDialog.tsx      ← Destructive action confirm
├── Modal.tsx              ← Base modal wrapper
├── TagInput.tsx           ← Comma-separated tag input
├── MarkdownEditor.tsx     ← Notes/description editor
└── EmptyState.tsx         ← No items placeholder
```

---

## Animation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ANIMATION TIMELINE                           │
└─────────────────────────────────────────────────────────────────────┘

App Launch
    │
    ├─► [0ms]     Shell mounts, base layout renders
    │
    ├─► [50ms]    Ambient orbs begin slow animation (12-18s loops)
    │
    ├─► [100ms]   Sidebar slides in from left
    │                 x: -56 → 0, opacity: 0 → 1, duration: 280ms
    │
    ├─► [150ms]   Topbar fades in
    │                 opacity: 0 → 1, y: -8 → 0, duration: 220ms
    │
    ├─► [200ms]   Page content begins stagger animation
    │                 ┌────────────────────────────────────┐
    │                 │  Card 1  ┌─────────────────────────────
    │                 │    │     │  Card 2  ┌──────────────────
    │                 │    │     │    │     │  Card 3  ┌───────
    │                 │    ▼     │    ▼     │    │     │
    │                 │  +60ms   │  +60ms   │    ▼     │
    │                 │          │          │  +60ms   │
    │                 └──────────┴──────────┴──────────┴───────
    │                 Each card: opacity: 0 → 1, y: 10 → 0
    │
    └─► [500ms]   XP chip pulses once (scale: 1 → 1.08 → 1)


Navigation (Projects → Stack)
    │
    ├─► [0ms]     Current page exit animation begins
    │                 opacity: 1 → 0, y: 0 → -6, duration: 140ms
    │
    ├─► [160ms]   Exit complete, new page enters
    │                 opacity: 0 → 1, y: 10 → 0, duration: 220ms
    │
    └─► [220ms]   New content stagger begins


XP Gain Event
    │
    ├─► [0ms]     Action completed (module marked, project created)
    │
    ├─► [50ms]    XP chip number animates
    │                 ┌──────────────────────────┐
    │                 │  2425 → 2450             │
    │                 │  (count up animation)    │
    │                 │  duration: 400ms         │
    │                 └──────────────────────────┘
    │
    ├─► [100ms]   Chip pulse begins
    │                 scale: 1 → 1.12 → 1
    │                 duration: 300ms
    │                 ease: spring(320, 28)
    │
    └─► [200ms]   Glow effect fades (box-shadow)


Level Up Event
    │
    ├─► [0ms]     XP threshold crossed
    │
    ├─► [50ms]    XP chip enters "glow mode"
    │                 ┌──────────────────────────────────┐
    │                 │  Amber glow ring appears         │
    │                 │  box-shadow: 0 0 20px #fac775  │
    │                 │  animation: pulse 600ms 3x       │
    │                 └──────────────────────────────────┘
    │
    ├─► [100ms]   Level badge animates
    │                 scale: 1 → 1.2 → 1
    │                 color transition to new level color
    │
    ├─► [600ms]   Native OS notification fires
    │                 "Level up → Engineer. 1,250 XP total."
    │
    └─► [1500ms]  Glow effect fades to normal state


Course Completion
    │
    ├─► [0ms]     Final module marked
    │
    ├─► [50ms]    Progress bar fills to 100%
    │                 width animation, duration: 900ms
    │
    ├─► [200ms]   Checkmark scales in
    │                 scale: 0 → 1, rotate: -45deg → 0
    │                 spring animation
    │
    ├─► [300ms]   Confetti burst (CSS particles)
    │                 ┌─────────────────────┐
    │                 │  ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦│
    │                 │    ↗ ↑ ↗ ↖ ↑ ↖     │
    │                 │                     │
    │                 │  Particle count: 12 │
    │                 │  Duration: 800ms    │
    │                 └─────────────────────┘
    │
    └─► [500ms]   Card moves to "Completed" section
                     layout animation via AnimatePresence
```

---

## State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ZUSTAND STATE FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────────────────┐
                         │        USER ACTION           │
                         │  (click, keyboard, timer)    │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 REACT COMPONENT                                  │
│                                                                                  │
│   CourseRow.tsx                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  const { markModule } = useCourseStore()                                │   │
│   │  const { addXP } = useXPStore()                                         │   │
│   │                                                                          │   │
│   │  async function handleMarkModule() {                                     │   │
│   │    await markModule(courseId)  // Updates course state                   │   │
│   │    await addXP(25, 'module_complete', courseId)  // Awards XP            │   │
│   │  }                                                                       │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────┬───────────────────────────────────────┘
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
    ┌───────────────────────────────┐           ┌───────────────────────────────┐
    │      courses.store.ts         │           │         xp.store.ts           │
    │                               │           │                               │
    │  markModule: async (id) => {  │           │  addXP: async (amt, reason) =>│
    │    // Optimistic update       │           │    // Update local state      │
    │    set(state => ({            │           │    set(state => ({            │
    │      courses: state.courses   │           │      totalXP: state.totalXP   │
    │        .map(c => c.id === id  │           │        + amount               │
    │          ? {...c, done: c.done│           │    }))                        │
    │            + 1}               │           │                               │
    │          : c)                 │           │    // Check level up          │
    │    }))                        │           │    if (newXP >= threshold) {  │
    │                               │           │      triggerLevelUp()         │
    │    // Persist to backend      │           │    }                          │
    │    await invoke('mark_module')│           │                               │
    │  }                            │           │    // Persist to backend      │
    │                               │           │    await invoke('add_xp')     │
    └───────────────┬───────────────┘           └───────────────┬───────────────┘
                    │                                           │
                    └─────────────────────┬─────────────────────┘
                                          │
                                          │ invoke('command', payload)
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TAURI COMMANDS (Rust)                              │
│                                                                                 │
│  #[tauri::command]                                                              │
│  async fn mark_module(db: State<DbPool>, id: String) -> Result<Course> {        │
│    sqlx::query("UPDATE courses SET done_modules = done_modules + 1...")         │
│      .execute(&*db).await?;                                                     │
│    // Return updated course                                                     │
│  }                                                                              │
│                                                                                 │
│  #[tauri::command]                                                              │
│  async fn add_xp(db: State<DbPool>, amount: i32, reason: String) -> Result<()>{ │
│    sqlx::query("UPDATE user_stats SET total_xp = total_xp + ?...")              │
│      .execute(&*db).await?;                                                     │
│    sqlx::query("INSERT INTO xp_log (amount, reason)...")  // Audit trail        │
│      .execute(&*db).await?;                                                     │
│  }                                                                              │
└─────────────────────────────────────────┬───────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   SQLite                                         │
│                                                                                  │
│    courses                          xp_log                     user_stats        │
│   ┌────────────────┐              ┌────────────────┐         ┌────────────────┐  │
│   │ id: "abc123"   │              │ id: "log789"   │         │ total_xp: 2475 │  │
│   │ done_modules:  │              │ amount: 25     │         │ level: 3       │  │
│   │   8 → 9        │              │ reason:        │         │                │  │
│   │ updated_at:    │              │  "module_done" │         │                │  │
│   │   NOW()        │              │ source_id:     │         │                │  │
│   └────────────────┘              │  "abc123"      │         └────────────────┘  │
│                                   └────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────────┘
```
