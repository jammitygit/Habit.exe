# Habit.exe | Technical Architecture

## 1. Tech Stack Choices

### Frontend Framework: React (TypeScript)
*   **Decision:** React was chosen for its component-based architecture, making it easy to encapsulate UI elements like `HabitHeatmap` or `RankDisplay`.
*   **Language:** TypeScript is strictly enforced to ensure type safety, particularly for the `Habit`, `HabitLog`, and `UserStats` interfaces.

### Styling: Tailwind CSS
*   **Decision:** Utility-first CSS allows for rapid iteration of the retro aesthetic without fighting a component library's defaults.
*   **Configuration:** Custom colors (`crt-black`, `crt-white`) and CSS variables are defined in `index.html` to handle the global "Glow" effects and Light/Dark mode switching efficiently.

### State Management: React `useState` (Lifted)
*   **Decision:** Currently, the app uses a monolithic state approach in `App.tsx`.
*   **Reasoning:** For an MVP, passing props down is sufficient. As the app grows, this should be refactored into a `HabitContext` to prevent prop drilling (specifically for the Modals).

### AI Integration: Google GenAI SDK
*   **Decision:** Direct client-side integration via `@google/genai`.
*   **Security Note:** Currently relies on `process.env.API_KEY`. In a production web deployment, this would need a proxy server to hide the key, but for a local/MVP tool, direct calls are acceptable.

---

## 2. Data Model

### Habits & History
We opted for a "Log-based" history system rather than a "Calendar-based" one.
*   **Structure:** `Habit` object contains a `history` array of `HabitLog` objects.
*   **Benefit:** Sparse storage. We only store days where actions occurred, rather than 365 null entries.
*   **Drawback:** Calculating streaks requires iterating/sorting dates, but manageable for client-side datasets.

### XP & Ranking
*   **XP:** A simple integer counter.
*   **Ranks:** Calculated dynamically. We do *not* store the user's rank in the DB. We store `XP`, and the `getRank(xp)` function determines the title on render. This allows us to rebalance the Rank Curve in `constants.ts` without migrating database schemas.

---

## 3. Directory Structure

```text
/
├── components/         # UI Components
│   ├── CRTOverlay.tsx  # The visual filter layer
│   ├── HabitTrend.tsx  # ASCII logic for trends
│   └── ...
├── services/
│   └── geminiService.ts # AI API abstraction
├── docs/               # Documentation
├── App.tsx             # Main Logic Controller
├── constants.ts        # Game balance (XP rates, Rank thresholds)
├── types.ts            # TypeScript Interfaces
└── index.html          # Entry point + Global CSS Variables
```

## 4. Key Architectural Decisions

1.  **Offline-First via File I/O:**
    We decided against a database for the MVP. Instead, we use a robust `JSON` import/export system. This mimics "saving a game file," fitting the retro theme and respecting user privacy/data ownership.

2.  **CSS Variables for Theming:**
    Instead of Tailwind's `dark:` classes, we use CSS variables (`--bg-color`, `--text-color`) toggled via a body class. This ensures that *canvas* elements or complex gradients (like the CRT Overlay) allow the theme to pass through without complex conditional logic in JS.
