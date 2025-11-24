# Habit.exe | Design System & Aesthetics

The UI language is "Retro-Minimalist CRT". It simulates a monochrome monitor from the early 80s.

## 1. Typography
*   **Font Family:** `Fira Code` (Monospace).
*   **Case:** Strictly **lowercase** for all UI elements, system logs, and inputs.
*   **Exceptions:** Rank Titles (e.g., `WARLORD I`) and Alert Headers are **UPPERCASE** to denote authority/system warnings.

## 2. Color Palette & Theming
We rely on CSS variables defined in `index.html`.

| Variable | Dark Mode (Default) | Light Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--bg-color` | `#080808` (Almost Black) | `#e0e0e0` (Light Grey) | Backgrounds |
| `--text-color` | `#e5e5e5` (Phosphor White) | `#1a1a1a` (Ink Black) | Main text, borders |
| `--input-bg` | `#000000` (True Black) | `#f5f5f5` (Paper White) | Input fields, module backgrounds |

*   **Accent Color:** Red (`#ef4444`) is used *only* for:
    *   Missed habits.
    *   "Unlog" actions (destructive).
    *   System Errors.
    *   Decaying trends.

## 3. Visual Effects (The "Glow")
To mimic CRT phosphors, we do not use flat colors. We use `text-shadow`.

*   **Standard Glow:** `text-shadow: 0 0 2px var(--glow-color);` (Applied globally).
*   **High Intensity:** Active elements get a stronger shadow: `0 0 3px var(--glow-strong), 0 0 8px var(--glow-color)`.
*   **Pulse:** Critical alerts use `animate-pulse` combined with the shadow.

## 4. Components

### CRT Overlay
A stateless component that sits on top of the app (`z-50`) with `pointer-events-none`.
1.  **Scanlines:** CSS linear-gradients.
2.  **Vignette:** Radial gradient to darken corners (curved screen illusion).
3.  **Flicker:** A very low opacity white animation to simulate 60Hz hum.

### ASCII Visuals
Wherever possible, use text characters instead of SVG graphs.
*   **Progress Bars:** `[======----]`
*   **Trend Lines:** `_ _ - ^ |`

## 5. Writing Style (Copy)
The app speaks like a computer.
*   *Bad:* "You successfully added a habit!"
*   *Good:* "new directive initialized."
*   *Bad:* "You lost a streak."
*   *Good:* "action reversed // streak reset."
