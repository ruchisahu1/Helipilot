# HeliPilot: Development & Modding Guide

This guide explains how to modify the game mechanics, design, and content for HeliPilot.

## 🛠️ Project Structure

- `src/pages/`: Contains the main game levels (`Level1.tsx`, `Level2.tsx`).
- `src/data/`: Static data like mission scenarios (`scenarios.ts`).
- `src/components/game/`: Reusable UI components like gauges, switches, and HUD elements.
- `src/contexts/`: Global state management for game progress and sound.

---

## 🎮 Level 2 Mechanics (Scenario-based)

Level 2 is designed as a "Tactical Decision" engine. The code for this is in `src/pages/Level2.tsx`.

### Changing the Difficulty
To make the game harder or easier, you can adjust these constants in `Level2.tsx`:

- **Decision Timer**: Change the initial `20` in `useState(20)` (Line 203) to increase/decrease time per scenario.
- **Scoring Penalty**: In `handleActionSelect` (Line 246), change `prev - 25` to adjust how much safety score is lost per mistake.
- **Victory Threshold**: In `isMissionSuccess` (Line 251), change `safetyScore > 50` to set a stricter passing grade.

### Changing Navigation Targets
To change where buttons take the user (e.g., going home instead of to the next level):
1. Import `useNavigate` from `react-router-dom` (already at the top of Level pages).
2. Use the `navigate('/')` function inside a button's `onClick` handler.
   - Example: `onClick={() => navigate('/')}` takes the user to the home page.
   - Example: `onClick={() => navigate('/level2')}` takes the user to Level 2.

---

## 🎨 Visual Design & Aesthetics

The game uses **Tailwind CSS** for layout and **Lucide React** for icons.

### Modifying Cockpit Styles
Most of the Level 2 design is defined in the `<style>` block at the top of the component:
- `.cockpit-card`: Adjust background blur and transparency.
- `.choice-card`: Modify hover effects and selection colors (Green/Red).

### Background Animation
The "Hovering" effect is a CSS animation:
- **Speed**: Change the `20s` in `animate-[slide_20s_linear_infinite]` to speed up or slow down the flight visual.
- **Texture**: You can swap the URL in the background image to change the atmosphere (e.g., from stardust to clouds).

---

## 🏗️ Core Game Engine (Physics)

For levels that use manual flight (like Level 1), the physics calculations are centralized in `src/contexts/GameContext.tsx`.

- **Gravity & Lift**: Look for the `Vertical physics` section in the `setInterval` loop.
- **Drift & Momentum**: Look for the `Horizontal physics` section where `velocity` and `drag` are calculated.
- **Arcade Damping**: Adjust the `activeDrag` (Line 126) to make the helicopter stop faster when you release the keys.
