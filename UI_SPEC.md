# DevOS UI/UX Design Specification

## Visual Identity

### The Aesthetic: "Luminous Void"

DevOS inhabits a space between operating system and ambient art. The interface emerges from darkness like bioluminescent creatures in the deep ocean — panels glow faintly, transitions ripple outward, and color appears only where attention is needed.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│      "Software should feel like a place you want to be,                         │
│       not a tool you have to use."                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Color System

### Base Palette

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              THE VOID                                            │
│                                                                                  │
│    #0a0a0f  ████████████████████████████████████████████  Base Background       │
│                                                                                  │
│    The foundation. Not pure black (#000) — that's harsh.                        │
│    This has a subtle blue-violet tint that makes it feel                        │
│    less like staring at absence and more like gazing into space.                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Glass Layers

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TRANSPARENCY STACK                                     │
│                                                                                  │
│   Layer 0 (Void)        #0a0a0f           Solid base                            │
│                         ▼                                                        │
│   Layer 1 (Panel)       rgba(255,255,255,0.04)  ░░░░░░░░░░  Cards, sidebar      │
│                         ▼                                                        │
│   Layer 2 (Hover)       rgba(255,255,255,0.06)  ░░░░░░░░░░  Interaction state   │
│                         ▼                                                        │
│   Layer 3 (Active)      rgba(255,255,255,0.08)  ░░░░░░░░░░  Selected items      │
│                         ▼                                                        │
│   Layer 4 (Elevated)    rgba(255,255,255,0.10)  ░░░░░░░░░░  Modals, panels      │
│                                                                                  │
│   Each layer adds 2% white. Never go above 10% — preserve the void.             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Accent Colors (Semantic)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ACCENT SPECTRUM                                     │
│                                                                                  │
│   ╔═══════════╗                                                                  │
│   ║  PURPLE   ║  #7f77dd  ████████  Brand / Primary / Navigation                │
│   ║           ║                     "The creative spark"                        │
│   ╚═══════════╝                                                                  │
│        │                                                                         │
│        └─► Dim:  rgba(127,119,221,0.15)  Background tint                        │
│        └─► Text: #c4bef8                 Readable on dark                       │
│                                                                                  │
│   ╔═══════════╗                                                                  │
│   ║   TEAL    ║  #1d9e75  ████████  Success / Active / Completion               │
│   ║           ║                     "Growth and progress"                       │
│   ╚═══════════╝                                                                  │
│        │                                                                         │
│        └─► Dim:  rgba(29,158,117,0.12)                                          │
│        └─► Text: #5dcaa5                                                        │
│                                                                                  │
│   ╔═══════════╗                                                                  │
│   ║   BLUE    ║  #378add  ████████  Info / Learning / Courses                   │
│   ║           ║                     "Knowledge and clarity"                     │
│   ╚═══════════╝                                                                  │
│        │                                                                         │
│        └─► Dim:  rgba(55,138,221,0.12)                                          │
│        └─► Text: #85b7eb                                                        │
│                                                                                  │
│   ╔═══════════╗                                                                  │
│   ║  CORAL    ║  #d85a30  ████████  Warning / Paused / Attention                │
│   ║           ║                     "Pause and consider"                        │
│   ╚═══════════╝                                                                  │
│        │                                                                         │
│        └─► Dim:  rgba(216,90,48,0.12)                                           │
│        └─► Text: #f0997b                                                        │
│                                                                                  │
│   ╔═══════════╗                                                                  │
│   ║  AMBER    ║  #ba7517  ████████  XP / Streaks / Rewards                      │
│   ║           ║                     "Achievement and fire"                      │
│   ╚═══════════╝                                                                  │
│        │                                                                         │
│        └─► Dim:  rgba(186,117,23,0.12)                                          │
│        └─► Text: #fac775                                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Typography

### Font Stack

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TYPE HIERARCHY                                      │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  DM SANS                                                                │   │
│   │  ══════════════════════════════════════════════════════════════════    │   │
│   │                                                                          │   │
│   │  Used for: Display text, headings, large numbers                        │   │
│   │  Feel: Geometric, confident, modern                                     │   │
│   │                                                                          │   │
│   │  2,450 XP                                                               │   │
│   │  ▲ This number should feel substantial                                  │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  IBM PLEX SANS                                                          │   │
│   │  ══════════════════════════════════════════════════════════════════    │   │
│   │                                                                          │   │
│   │  Used for: Body text, labels, descriptions                              │   │
│   │  Feel: Technical but warm, readable at small sizes                      │   │
│   │                                                                          │   │
│   │  Complete the "Advanced TypeScript Patterns" course to unlock           │   │
│   │  ▲ Should feel like documentation you want to read                      │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │  IBM PLEX MONO                                                          │   │
│   │  ══════════════════════════════════════════════════════════════════    │   │
│   │                                                                          │   │
│   │  Used for: Tech tags, code references, XP numbers in chips              │   │
│   │  Feel: Code-confident, precise                                          │   │
│   │                                                                          │   │
│   │  TypeScript  React  Node.js                                             │   │
│   │  ▲ These should look like they belong in a terminal                     │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Type Scale

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   2XL   28px / 700   ████████████████████████████   Stat numbers, XP totals    │
│                                                                                  │
│   XL    20px / 600   ████████████████████          Page headings               │
│                                                                                  │
│   LG    15px / 600   ██████████████                Card titles, nav items      │
│                                                                                  │
│   MD    13px / 500   ████████████                  Body text, descriptions     │
│                                                                                  │
│   SM    11px / 500   ██████████                    Labels, metadata            │
│                                                                                  │
│   XS    10px / 600   ████████  ALL CAPS            Section headers             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Gallery

### GlassCard

The fundamental surface. Everything lives on glass.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   NORMAL STATE                                                                   │
│   ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐       │
│   ╎                                                                     ╎       │
│   ╎   background: rgba(255, 255, 255, 0.04)                            ╎       │
│   ╎   border: 0.5px solid rgba(255, 255, 255, 0.07)                    ╎       │
│   ╎   border-radius: 14px                                               ╎       │
│   ╎   backdrop-filter: blur(16px)                                       ╎       │
│   ╎   padding: 18px 20px                                                ╎       │
│   ╎                                                                     ╎       │
│   └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘       │
│               ▲ Border barely visible — like frost on glass                     │
│                                                                                  │
│   HOVER STATE                                                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐       │
│   │                                                                     │       │
│   │   background: rgba(255, 255, 255, 0.06)   ← +2%                    │       │
│   │   border: 0.5px solid rgba(255, 255, 255, 0.12)  ← brighter        │       │
│   │   transition: 0.2s ease                                             │       │
│   │                                                                     │       │
│   └─────────────────────────────────────────────────────────────────────┘       │
│               ▲ Subtle lift without shadow — glass brightens                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### StatusPill

Compact status indicators. Color + text for quick scanning.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   Status Pills                                                                   │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │ ╭───────────────╮│   ACTIVE                                                 │
│   │ │    ACTIVE     ││   bg: rgba(29, 158, 117, 0.12)                          │
│   │ ╰───────────────╯│   text: #5dcaa5                                         │
│   └──────────────────┘   border-radius: 6px, padding: 4px 10px                 │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │ ╭───────────────╮│   BUILDING                                               │
│   │ │   BUILDING    ││   bg: rgba(127, 119, 221, 0.15)                         │
│   │ ╰───────────────╯│   text: #c4bef8                                         │
│   └──────────────────┘                                                          │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │ ╭───────────────╮│   SHIPPED                                                │
│   │ │    SHIPPED    ││   bg: rgba(55, 138, 221, 0.12)                          │
│   │ ╰───────────────╯│   text: #85b7eb                                         │
│   └──────────────────┘   Checkmark icon prefix                                  │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │ ╭───────────────╮│   PAUSED                                                 │
│   │ │    PAUSED     ││   bg: rgba(216, 90, 48, 0.12)                           │
│   │ ╰───────────────╯│   text: #f0997b                                         │
│   └──────────────────┘                                                          │
│                                                                                  │
│   ┌──────────────────┐                                                          │
│   │ ╭───────────────╮│   PLANNED                                                │
│   │ │   PLANNED     ││   bg: rgba(255, 255, 255, 0.06)                         │
│   │ ╰───────────────╯│   text: rgba(255, 255, 255, 0.45)                       │
│   └──────────────────┘   Dashed border variant                                  │
│                                                                                  │
│   Font: IBM Plex Sans, 11px, weight 600, ALL CAPS                               │
│   Letter-spacing: 0.5px                                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### ProgressBar

The soul of DevOS. Progress should feel alive.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   PROGRESS BAR ANATOMY                                                           │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────┐           │
│   │                                                                 │           │
│   │   Track (background)                                            │           │
│   │   ════════════════════════════════════════════════════════════  │           │
│   │   bg: rgba(255, 255, 255, 0.06)                                 │           │
│   │   height: 6px                                                   │           │
│   │   border-radius: 3px (fully rounded)                            │           │
│   │                                                                 │           │
│   │   Fill (foreground)                                             │           │
│   │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                    │           │
│   │   bg: linear-gradient(90deg, #7f77dd 0%, #9d97e8 100%)         │           │
│   │   ▲ Subtle gradient makes it feel dimensional                   │           │
│   │                                                                 │           │
│   └─────────────────────────────────────────────────────────────────┘           │
│                                                                                  │
│   ANIMATION                                                                      │
│                                                                                  │
│   On mount:  width: 0% → actual%                                                 │
│   Duration:  900ms                                                               │
│   Easing:    cubic-bezier(0.16, 1, 0.3, 1)  ← "ease-out-expo"                  │
│              Fast start, gentle landing                                          │
│                                                                                  │
│   On update: animate from previous width to new width                            │
│   Duration:  400ms                                                               │
│                                                                                  │
│   100% COMPLETION VARIANT                                                        │
│   ═══════════════════════════════════════════════════════════════════           │
│   Fill color shifts: purple → teal                                               │
│   Subtle pulse animation (1 cycle)                                               │
│   Glow: box-shadow: 0 0 12px rgba(29, 158, 117, 0.4)                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### XPChip

The ever-present reward anchor.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   XP CHIP VARIANTS                                                               │
│                                                                                  │
│   ╔═══════════════════════════════════════════════════════════════════════════╗ │
│   ║                                                                           ║ │
│   ║   IDLE STATE                                                              ║ │
│   ║   ┌─────────────────────────┐                                             ║ │
│   ║   │  ⚡ 2,450               │   bg: rgba(186, 117, 23, 0.12)             ║ │
│   ║   │     ▲                   │   text: #fac775                            ║ │
│   ║   └─────│───────────────────┘   font: IBM Plex Mono, 13px                ║ │
│   ║         │                       border-radius: 10px                       ║ │
│   ║         └── Lightning bolt icon (Lucide: Zap)                             ║ │
│   ║              stroke-width: 2                                              ║ │
│   ║                                                                           ║ │
│   ╠═══════════════════════════════════════════════════════════════════════════╣ │
│   ║                                                                           ║ │
│   ║   GAIN STATE (+25 XP)                                                     ║ │
│   ║   ┌─────────────────────────┐                                             ║ │
│   ║   │  ⚡ 2,450 → 2,475       │   Number animates (count-up)               ║ │
│   ║   │         ●               │   Chip pulses: scale 1 → 1.12 → 1          ║ │
│   ║   └─────────│───────────────┘   Duration: 300ms                          ║ │
│   ║             │                   Easing: spring(320, 28)                   ║ │
│   ║             └── Pulsing dot indicator                                     ║ │
│   ║                                                                           ║ │
│   ╠═══════════════════════════════════════════════════════════════════════════╣ │
│   ║                                                                           ║ │
│   ║   LEVEL UP STATE                                                          ║ │
│   ║   ┌─────────────────────────┐                                             ║ │
│   ║   │  ⚡ 2,500               │   Glow ring appears:                        ║ │
│   ║   │  ◉━━━━━━━━━━━━━━━━━━━◉  │   box-shadow: 0 0 20px #fac775            ║ │
│   ║   └─────────────────────────┘   animation: pulse 600ms × 3               ║ │
│   ║                                                                           ║ │
│   ║   Level badge below chip briefly expands to show:                         ║ │
│   ║   "LEVEL 3 → ENGINEER"                                                    ║ │
│   ║                                                                           ║ │
│   ╚═══════════════════════════════════════════════════════════════════════════╝ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## View Mockups

### Projects Hub

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ─ □ ✕                           DevOS                                           │
├──────┬──────────────────────────────────────────────────────────────────────────┤
│      │  Projects                                    ⚡ 2,450  [All ▾]           │
│  D   ├──────────────────────────────────────────────────────────────────────────┤
│      │                                                                          │
│ ────►│  ┌─────────────────────────────────────────────────────────────────────┐│
│ ●    │  │ ◉  DevOS                                                            ││
│ Proj │  │    TypeScript · React · Tauri                                       ││
│      │  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  68%        BUILDING           ││
│ ○    │  │                                            Updated 2 hours ago       ││
│Stack │  └─────────────────────────────────────────────────────────────────────┘│
│      │                                                                          │
│ ○    │  ┌─────────────────────────────────────────────────────────────────────┐│
│Course│  │ ◉  Portfolio v3                                                     ││
│      │  │    Next.js · Framer Motion · Vercel                                 ││
│ ○    │  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%  ✓ SHIPPED            ││
│ Time │  │                                            Updated 5 days ago        ││
│      │  └─────────────────────────────────────────────────────────────────────┘│
│      │                                                                          │
│      │  ┌─────────────────────────────────────────────────────────────────────┐│
│ ─────│  │ ◉  CLI Todo App                                                     ││
│      │  │    Rust · SQLite                                                     ││
│ ○    │  │    ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░  25%           ACTIVE        ││
│Profile│ │                                            Updated yesterday         ││
│      │  └─────────────────────────────────────────────────────────────────────┘│
│      │                                                                          │
│      │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐│
│      │  ╎ ◯  ML Image Classifier                                              ╎│
│      │  ╎    Python · TensorFlow                                               ╎│
│      │  ╎    ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   0%            PLANNED         ╎│
│      │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘│
│      │                                      ▲ Planned items have dashed borders │
│      │                                                                          │
│      │                         Press N to add a project                         │
│      │                                                                          │
└──────┴──────────────────────────────────────────────────────────────────────────┘

Project Icon Colors (auto-assigned by primary stack item):
  TypeScript → #3178c6
  React      → #61dafb
  Python     → #3776ab
  Rust       → #ce422b
  Go         → #00add8
  Node.js    → #539e43
```

### Stack Radar

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ─ □ ✕                           DevOS                                           │
├──────┬──────────────────────────────────────────────────────────────────────────┤
│      │  Stack Radar                                 ⚡ 2,450                     │
│  D   ├──────────────────────────────────────────────────────────────────────────┤
│      │                                                                          │
│ ○    │              TypeScript                                                  │
│ Proj │                   ╱╲                                                     │
│      │                  ╱  ╲                                                    │
│ ────►│       React    ╱    ╲    Python                                         │
│ ●    │               ╱ ████ ╲                                                   │
│Stack │              ╱████████╲                                                  │
│      │             ╱██████████╲                                                 │
│ ○    │       ◇────██████████████────◇                                          │
│Course│     Node   ╲██████████╱   Rust                                          │
│      │             ╲████████╱                                                   │
│ ○    │              ╲ ████ ╱                                                    │
│ Time │               ╲    ╱                                                     │
│      │                ╲  ╱                                                      │
│      │                 ╲╱                                                       │
│ ─────│                 Go                                                       │
│      │                                                                          │
│ ○    │  ┌─────────────────────────────────────────────────────────────────────┐│
│Profile│ │  SKILL              XP      LEVEL           PROJECTS   COURSES       ││
│      │  ├─────────────────────────────────────────────────────────────────────┤│
│      │  │  TypeScript         892     ▓▓▓▓▓▓░░ FLUENT      4         2        ││
│      │  │  React              654     ▓▓▓▓░░░░ COMFY       3         1        ││
│      │  │  Python             312     ▓▓░░░░░░ LEARNING    2         1        ││
│      │  │  Node.js            245     ▓▓░░░░░░ LEARNING    2         0        ││
│      │  │  Rust               187     ▓░░░░░░░ BEGINNER    1         1        ││
│      │  │  Go                  60     ░░░░░░░░ BEGINNER    1         0        ││
│      │  └─────────────────────────────────────────────────────────────────────┘│
│      │                                                                          │
│      │                                            [+ Add Skill]                 │
│      │                                                                          │
└──────┴──────────────────────────────────────────────────────────────────────────┘

Confidence Level Colors:
  BEGINNER    → gray (muted)
  LEARNING    → blue
  COMFORTABLE → teal
  FLUENT      → purple
  EXPERT      → amber (gold)
```

### Focus Mode

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                              Deep Work Session                                  │
│                                                                                 │
│                         ┌─────────────────────────┐                             │
│                         │                         │                             │
│                         │        18:42            │                             │
│                         │                         │                             │
│                         │   ████████████░░░░░░░   │                             │
│                         │                         │                             │
│                         └─────────────────────────┘                             │
│                                                                                 │
│                          Building DevOS Projects Hub                            │
│                               Linked: DevOS                                     │
│                                                                                 │
│                                                                                 │
│                          ╭─────╮         ╭─────╮                                │
│                          │  ▐▐ │         │  ■  │                                │
│                          │Pause│         │Stop │                                │
│                          ╰─────╯         ╰─────╯                                │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                         Press ESC to exit focus mode                            │
│                                                                                 │
│                                                                                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

Timer Typography:
  Font: DM Sans
  Size: 72px
  Weight: 700
  Color: #ffffff (full white in focus mode)

Ambient orbs in background are dimmed to 30% opacity
No sidebar or topbar — complete focus
```

---

## Animation Choreography

### Card Entrance Stagger

```
Cards enter in sequence, creating a "waterfall" effect that draws the eye
down the list. Each card's entrance is offset by 60ms.

    Time 0ms     Time 60ms    Time 120ms   Time 180ms
    ┌─────────┐
    │ Card 1  │  ┌─────────┐
    │ ▲       │  │ Card 2  │  ┌─────────┐
    │ │       │  │ ▲       │  │ Card 3  │  ┌─────────┐
    │ │       │  │ │       │  │ ▲       │  │ Card 4  │
    └─┼───────┘  └─┼───────┘  └─┼───────┘  └─────────┘
      │ fade+     │ fade+      │ fade+
      │ rise      │ rise       │ rise

Each card: opacity 0→1, y: 10px→0, duration 180ms
Easing: [0.4, 0, 0.2, 1] (Material Design standard)
```

### Level Up Sequence

```
Timeline of the level-up celebration:

0ms      ├─► XP crosses threshold (e.g., 1250 = Level 3)
         │
50ms     ├─► XP chip number finishes counting up
         │
100ms    ├─► Amber glow ring fades in
         │   box-shadow: 0 0 0 → 0 0 20px #fac775
         │
200ms    ├─► Chip scale: 1 → 1.15
         │   └─► Level badge text changes: "2" → "3"
         │       └─► Color shifts to level 3 color
         │
400ms    ├─► Chip scale: 1.15 → 1.08 (settle)
         │
600ms    ├─► Glow ring pulses (opacity 0.8 → 0.4 → 0.8)
         │   └─► Repeats 3 times
         │
800ms    ├─► Native OS notification fires:
         │   "Level up → Engineer. 1,250 XP total."
         │
2000ms   └─► Glow fades out, chip returns to normal
             box-shadow: 20px → 0
```

### Sidebar Expansion

```
Collapsed (56px)              Expanding                    Expanded (188px)

┌──────┐                      ┌──────────────┐             ┌──────────────────┐
│      │                      │              │             │                  │
│  ●   │    ─────────►        │ ● Pro...     │   ───►      │ ●  Projects      │
│      │    (0ms-140ms)       │              │  (140ms-    │                  │
│  ○   │                      │ ○ Sta...     │   280ms)    │ ○  Stack         │
│      │                      │              │             │                  │
│  ○   │                      │ ○ Cou...     │             │ ○  Courses       │
│      │                      │              │             │                  │
└──────┘                      └──────────────┘             └──────────────────┘

Width transition: 280ms, cubic-bezier(0.4, 0, 0.2, 1)

Label animation (per item, staggered 30ms):
  - Collapsed: opacity: 0, translateX: -6px
  - Expanded:  opacity: 1, translateX: 0
  - Duration:  180ms
  - Delay:     based on item index × 30ms
```

---

## Empty States

Every empty state is an invitation, not a dead end.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECTS EMPTY STATE                                │
│                                                                                  │
│                                                                                  │
│                                    ◇                                             │
│                                   ╱ ╲                                            │
│                                  ╱   ╲                                           │
│                                 ╱  ┌┐ ╲                                          │
│                                ◇───┤├───◇                                        │
│                                 ╲  └┘ ╱                                          │
│                                  ╲   ╱                                           │
│                                   ╲ ╱                                            │
│                                    ◇                                             │
│                                                                                  │
│                           No projects yet                                        │
│                                                                                  │
│                    Every great build starts with pressing N                      │
│                                                                                  │
│                          ╭─────────────────────╮                                 │
│                          │   Create Project    │                                 │
│                          │        (N)          │                                 │
│                          ╰─────────────────────╯                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

Empty state principles:
1. Minimal illustration (geometric, not cartoon)
2. Encouraging but not cheesy copy
3. Clear single action
4. Keyboard shortcut shown
```

---

## Microinteractions

### Button Hover

```css
/* Restrained but alive */
.button {
  transition: transform 0.15s ease, background 0.15s ease;
}
.button:hover {
  transform: translateY(-1px);  /* Subtle lift, not bounce */
  background: var(--bg-panel-hover);
}
.button:active {
  transform: translateY(0);
  transition-duration: 0.05s;
}
```

### Input Focus

```css
/* Glow that doesn't distract */
.input {
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input:focus {
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px var(--accent-purple-dim);
  outline: none;
}
```

### Checkbox Toggle

```
Unchecked              Checking                  Checked

  ┌────────┐           ┌────────┐               ┌────────┐
  │        │    →      │   ╲    │      →        │   ✓    │
  │        │           │    ╲   │               │        │
  └────────┘           └────────┘               └────────┘

  border: subtle       checkmark draws          bg: accent-teal-dim
                       in with spring           border: accent-teal
                       animation (200ms)
```

---

## Responsive Behavior

DevOS is a desktop app with defined minimum dimensions, but should gracefully handle window resizing.

```
Minimum:  900 × 600px
Optimal:  1200 × 760px
Large:    1400 × 900px

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│   900px wide                      →                    1400px wide              │
│                                                                                 │
│   ┌────┬────────────────────┐         ┌────┬────────────────────────────────┐  │
│   │    │                    │         │    │                                │  │
│   │ 56 │  Content area      │         │ 56 │  More breathing room           │  │
│   │    │  fills remaining   │         │    │  Cards can show more detail    │  │
│   │    │                    │         │    │                                │  │
│   └────┴────────────────────┘         └────┴────────────────────────────────┘  │
│                                                                                 │
│   Sidebar never auto-expands at larger sizes (users control via hover)         │
│   Content area stretches, maintaining padding proportions                       │
│   Cards maintain max-width of ~800px for readability                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

*DevOS UI/UX Specification v1.0*
*Colors, typography, and interactions crafted for the "Luminous Void" aesthetic*
