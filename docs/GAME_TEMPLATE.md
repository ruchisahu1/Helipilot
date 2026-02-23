# Simulation Game Template: The "Pilot" Blueprint

Use this guide as a technical blueprint to create new simulation-style games (e.g., **ShipPilot**, **TruckPilot**, **RoverPilot**) using the architecture established in HeliPilot.

---

## 🏗️ Core Architecture

This project uses a modular design that separates **State**, **Audio**, and **Content**.

### 1. Global State (`src/contexts/`)
- **GameContext**: Use this for continuous physics (Gravity, Velocity, RPM). 
  - *Tip*: For a ship, change Gravity to "Bouyancy" and Collective to "Engine Throttle".
- **SoundContext**: Manages the "Audio Lifecycle". Use this to ensure sounds start and stop correctly when navigating between menus and gameplay.

### 2. The Page Structure (`src/pages/`)
- **Intro.tsx**: The starting "Hangar/Dock" page. Focus on atmosphere and objectives.
- **Level 1 (The Training)**: A checklist-driven interactive tutorial.
  - *Engine*: Uses dynamic `useEffect` to "listen" to switch states.
  - *Logic*: All buttons are gated behind a `preflightComplete` logic check.
- **Level 2 (The Mission)**: A decision-making tactical engine.
  - *Engine*: A `setInterval` timer + a `SCENARIOS` array (see below).

### 3. Data-Driven Content (`src/data/`)
- **scenarios.ts**: The most important file. To change the game's story, you only need to update this array of objects.

---

## 🎨 Professional Aesthetics (Glass UI)

To keep the futuristic "HUD" look, reuse these CSS patterns found in `Level2.tsx`:

- **Backdrop Blur**: `backdrop-filter: blur(8px);` for cards.
- **Border Accents**: Use highly transparent borders (`rgba(255, 255, 255, 0.05)`) to create the glass effect.
- **Movement Animation**: Reuse the `@keyframes slide` logic to move a background texture. For a ship, use a **wave pattern** texture instead of stardust.

---

## 🛠️ Scaffolding a New Game (Step-by-Step)

If you are starting **ShipPilot** in a new directory:

1.  **Initialize**: `npx create-vite@latest ShipPilot --template react-ts`
2.  **Port Contexts**: Copy the `SoundContext.tsx` and `useCockpitSounds.ts`. They are the "logic brains" of the audio system.
3.  **Define Your Domain**:
    - Choose primary metrics (e.g., Depth, Heading, Knots).
    - Map your controls (e.g., W/S for Throttle, A/D for Rudder).
4.  **Create your Level 2 Scenarios**:
    ```typescript
    {
      id: 'engine-overheat',
      title: 'Main Boiler Overpressure',
      priority: 'HIGH',
      actions: [
        { label: 'Vent Steam', isCorrect: true, feedback: 'Pressure stabilized.' },
        { label: 'Increase Speed', isCorrect: false, feedback: 'Boiler explosion.' }
      ]
    }
    ```
5.  **Connect Routing**: Use `react-router-dom` to link your Intro, Level 1, and Level 2.

---

## 💡 Pro-Tip: The AI Instructor
Always include the `AIAssistant` component. It solves the biggest problem in simulation games: **"What do I do next?"** Trigger messages based on your `milestones` state in Level 1.
