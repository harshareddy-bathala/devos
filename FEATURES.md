# DevOS Features Guide

This document explains the key features implemented in DevOS, particularly focusing on the gamification system and project tracking.

## Table of Contents

1. [XP System & Gamification](#xp-system--gamification)
2. [Milestone-Based Progress Tracking](#milestone-based-progress-tracking)
3. [Project Status Workflow](#project-status-workflow)
4. [User Experience Enhancements](#user-experience-enhancements)

---

## XP System & Gamification

### How XP Works

DevOS uses a gamification system to reward you for building, learning, and shipping projects. Experience Points (XP) are awarded for meaningful actions throughout your development journey.

### XP Awards

| Action | XP Earned | When It's Awarded |
|--------|-----------|-------------------|
| Create a project | +50 XP | When you create a new project |
| Set project to Active | +25 XP | First time you mark a project as active |
| Set project to Building | +15 XP | First time you mark a project as building |
| Ship a project | +200 XP | First time you mark a project as shipped |

### XP Deduplication System

**Important:** XP awards are **one-time per milestone** for each project. The system uses smart deduplication to ensure you can't game the system.

#### How Deduplication Works:

- Each XP award is tied to a specific project (via `sourceId`) and action (via `reason`)
- When you earn XP, it's logged in the database with these identifiers
- Before awarding XP, the system checks if you've already earned it for that specific project action
- This prevents duplicate XP awards if you toggle project status back and forth

#### Example Scenario:

```
Project: "DevOS App"

Day 1: Set status to "Active" → +25 XP awarded ✓
Day 2: Set status to "Building" → +15 XP awarded ✓
Day 3: Set status to "Active" again → No XP (already earned for active) ✗
Day 4: Set status to "Shipped" → +200 XP awarded ✓
```

**Why this matters:** The XP system rewards forward progress, not status changes. Once you've achieved a milestone (like making a project active), you've earned that XP forever for that project.

### Level System

XP contributes to your overall level, which reflects your developer journey:

- **Level 1:** Novice (0-249 XP)
- **Level 2:** Builder (250-1249 XP)
- **Level 3:** Engineer (1250-2499 XP)
- **Level 4:** Architect (2500-4499 XP)
- **Level 5:** Senior (4500-7499 XP)
- **Level 6:** Principal (7500-11999 XP)
- **Level 7:** Legend (12000+ XP)

---

## Milestone-Based Progress Tracking

### Overview

DevOS uses a **milestone-based system** for tracking project completion. Instead of manually entering percentages, you break your project into concrete milestones and check them off as you complete them.

### How It Works

1. **Automatic Progress Calculation**
   - Project progress is calculated automatically based on completed milestones
   - Each milestone has a "weight" (percentage contribution to overall progress)
   - When you toggle a milestone as complete, progress updates instantly

2. **Default Milestones**
   - When you open a project for the first time, DevOS seeds default milestones:
     - Planning & Design (25%)
     - Core Implementation (35%)
     - Testing & Refinement (20%)
     - Documentation & Polish (20%)

3. **Custom Milestones**
   - You can add your own milestones with custom weights
   - Delete milestones you don't need
   - Adjust weights to reflect your project's priorities

### Using Milestones

#### To Add a Milestone:
1. Open the project panel (click on a project)
2. Scroll to the "Progress" section
3. Enter milestone title (e.g., "Set up CI/CD pipeline")
4. Set the weight (default: 20%)
5. Click "Add"

#### To Complete a Milestone:
1. Click the checkbox next to the milestone
2. Progress bar updates automatically
3. The project's overall progress percentage is recalculated

#### Example Milestone Setup:

```
Project: "Portfolio Website v3"

Milestones:
□ Design mockups in Figma (15%)
□ Set up Next.js project (10%)
☑ Build homepage components (20%) ← Completed
□ Add blog functionality (25%)
□ Deploy to Vercel (15%)
□ Add analytics & SEO (15%)

Current Progress: 20%
```

### Benefits Over Manual Percentages

- **No guesswork:** Break projects into concrete tasks
- **Better tracking:** See exactly what's left to do
- **Motivation:** Satisfying to check off milestones
- **Automatic calculation:** No mental math required
- **Historical record:** See what you've completed at a glance

---

## Project Status Workflow

### Status Types

- **Planned:** Ideas and future projects
- **Active:** Currently prioritized and being worked on
- **Building:** In active implementation/coding
- **Shipped:** Completed and deployed/released
- **Paused:** Temporarily on hold

### Recommended Workflow

```
Planned → Active → Building → Shipped
              ↓         ↓
            Paused ←---→
```

### Tips for Status Management

1. **Keep "Active" focused:** Only mark 1-3 projects as active at a time
2. **Use "Building" for execution:** Move to building when you're writing code
3. **Ship early:** Mark as shipped when deployed, even if not "perfect"
4. **Pause wisely:** Use paused for projects you'll return to, not abandoned ones

---

## User Experience Enhancements

### Spell Check Support

The project description textarea supports native spell-check:

- **Enabled by default:** Misspelled words are underlined
- **Right-click to correct:** Context menu shows suggestions
- **Works in Tauri:** Native browser spell-check is fully functional

### Empty States

Each project filter has contextual empty states:

- **Clear messaging:** Tells you what projects appear in each view
- **Helpful CTAs:** Guides you to create projects
- **Keyboard shortcut hints:** Shows you can press `N` to create quickly

### Animations & Polish

- **Smooth transitions:** Everything feels fluid and responsive
- **Micro-interactions:** Buttons lift on hover, checkboxes pop when checked
- **Staggered loading:** Project cards animate in sequence
- **Floating icons:** Empty state icons gently float for visual interest
- **Progress animations:** Progress bars fill with smooth easing

---

## Frequently Asked Questions

### Why don't I get XP when I change status back and forth?

The XP system rewards **forward progress milestones**, not status changes. Once you've achieved a milestone (like marking a project active or shipped), you've earned that XP permanently for that project. This prevents gaming the system while still rewarding genuine progress.

### How do I track progress without typing percentages?

Use the milestone system! Add milestones for your project's key phases, set their weights, and check them off as you complete them. Progress calculates automatically.

### Can I edit milestone weights after creating them?

Currently, you can delete a milestone and create a new one with a different weight. Direct editing may be added in a future update.

### What if my milestones don't add up to 100%?

That's okay! The system normalizes milestone weights proportionally. If your milestones total 80%, completing all of them will show 100% progress.

### Do I lose XP if I delete a project?

No. XP is permanently added to your total and cannot be removed. Deleting a project only removes the project data, not your earned XP.

---

## Tips for Maximum Productivity

1. **Create projects immediately:** Get +50 XP and establish tracking
2. **Break into milestones early:** Set clear goals before coding
3. **Mark status changes honestly:** Let the system track your workflow
4. **Ship frequently:** The +200 XP for shipping motivates completion
5. **Use paused status:** Don't feel bad about pausing projects—life happens!
6. **Focus on 1-2 active projects:** Avoid context-switching overhead
7. **Review regularly:** Check your progress weekly to stay motivated

---

## Roadmap & Future Features

Potential enhancements being considered:

- [ ] XP multipliers for streak days
- [ ] Badges for achievements
- [ ] Project time tracking
- [ ] Milestone templates by project type
- [ ] Export project reports
- [ ] GitHub integration for auto-progress

---

**Last Updated:** 2026-03-22
**DevOS Version:** Phase 1 & 2 Complete

For more information, see:
- [Product Specification](./DevOS_ProductSpec.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Execution Plan](./EXECUTION_PLAN.md)
