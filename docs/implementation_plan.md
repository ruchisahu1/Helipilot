# Implementation Plan - HeliPilot

HeliPilot is a helicopter simulation game built with React, Vite, and Tailwind CSS. It adapts the "AI Flight Commander" concept into a rotorcraft context, focusing on helicopter-specific startup procedures, hovering mechanics, and mission planning.

## Proposed Changes

### Project Initialization
- [NEW] Initialize a Vite + React + TypeScript project.
- [NEW] Configure Tailwind CSS and shadcn/ui.
- [NEW] Set up project structure: `src/components/game`, `src/contexts`, `src/hooks`, `src/pages`, `src/types`.

### Core Components Adaptation
- [NEW] **HeliCockpit**: Adapted cockpit layout with Collective and Cyclic visual controls.
- [NEW] **RotorIndicators**: Gauges for Rotor RPM, Torque, and Vertical Speed.
- [NEW] **HeliAI**: AI Assistant providing helicopter-specific checklists and warnings (e.g., "VRS risk", "Low Rotor RPM").

### Game Logic
- [NEW] **GameContext**: Manage helicopter state (Engine, Rotor, Collective, Cyclic, Avionics, etc.).
- [NEW] **SoundContext**: Cockpit sounds (Rotor blade slap, turbine whine, warnings).
- [NEW] **Level1**: Focused on "Pre-flight & Stability". Startup procedure followed by a guided hover session.

### Styling & Assets
- Use a high-end, dark-mode "Aviation" aesthetic with vibrant accents (green for OK, yellow for caution, red for danger).
- Use `lucide-react` for icons.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no TypeScript or build errors.
- (Optional) Implement unit tests for game state transitions in `GameContext`.

### Manual Verification
1.  **Startup Sequence**: Verify that clicking the "Battery" and "Engine Starter" switches triggers the engine sounds and enables other systems.
2.  **Pre-flight Checklist**: Verify that the AI Assistant correctly detects system states and marks checklist items as completed.
3.  **Hover Mechanic**: Test the visual feedback when adjusting the "Collective" control (simulating lift).
4.  **Responsive Design**: Ensure the cockpit layout scales correctly on different screen sizes.
