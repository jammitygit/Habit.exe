# Project: Habit.exe | Idea Inbox & MVP Roadmap

## 1. Project Identity
**Habit.exe** is a retro-minimalist, gamified habit tracker designed to look and feel like a legacy CRT terminal interface. It differentiates itself from standard productivity apps by focusing on "tactical" aesthetic, high-contrast visuals, and a deep ranking system.

**Core Philosophy:**
*   **Aesthetic:** Terminal/Code-editor chic.
*   **Interaction:** Keyboard-centric feel, distinct "click" actions, reversible logic.
*   **Gamification:** Military-style ranking (Recruit to Warlord) based on XP accumulation.

---

## 2. Current MVP Status (What Works)
The current build is a functional Single Page Application (SPA) with the following features:

### Core Loop
*   **Habit Logging:** Toggle habits for the current day.
*   **Reversible Logic:** "Unlogging" a habit removes XP and the history entry (undo).
*   **XP System:** Fixed XP per log, penalties for unlogging.
*   **Streak System:** Visual counters + XP Multipliers (1.2x) for streaks > 7 days.

### Progression
*   **Rank System:** 30-tier military rank system (Recruit I -> Warlord III).
*   **Progress Visualization:** "Status Module" with ASCII progress bars and clickable Rank Roadmap modal.
*   **Efficiency Metrics:** 90-day and All-time efficiency percentages.

### Visualization & UI
*   **Heatmaps:** 14-day mini-heatmap per habit + 90-day expanded modal view.
*   **Trend Lines:** ASCII-style (`_ _ - ^`) trend indicators.
*   **CRT Effects:** Scanlines, screen curvature, vignetting, and phosphor glow.
*   **Theming:** Full Light/Dark mode support (inverts CRT phosphor colors).

### Data & Intelligence
*   **Persistence:** JSON Export/Import system for manual backups.
*   **AI Integration:** Google Gemini integration for "Tactical Analysis" of habit performance.
*   **System Log:** Scrolling terminal log for user feedback and immersion.

---

## 3. Idea Inbox (Future Roadmap)

### Immediate Priority (v1.1)
*   [ ] **Local Storage:** Auto-save state to browser `localStorage` so data persists on refresh without manual export.
*   [ ] **Sound Effects:** 8-bit/mechanical keyboard sounds on click/hover.
*   [ ] **Mobile Optimization:** Refine the Rank Roadmap and Modal touch targets for mobile.

### Medium Term (v1.5)
*   [ ] **Habit Categories:** Group habits (e.g., Physical, Neural, Tactical).
*   [ ] **Boss Battles:** Random events where you need X amount of XP in a day to "defeat" a boss.
*   [ ] **Keyboard Shortcuts:** `j`/`k` to navigate habits, `Space` to log.

### Long Term / Moonshots
*   [ ] **Backend Sync:** Optional Supabase/Firebase integration for cross-device sync.
*   [ ] **Multiplayer Squads:** "Join a Platoon" to track collective XP with friends.
*   [ ] **Desktop App:** Electron wrapper to run as a native widget on desktop.
