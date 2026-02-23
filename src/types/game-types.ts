export type Difficulty = 'easy' | 'normal' | 'hard';

export type GamePhase = 'startup' | 'hover' | 'flight' | 'landing' | 'success' | 'failure';

export interface HelicopterCockpit {
  battery: boolean;
  avionics: boolean;
  fuelPumps: boolean;
  engineStarter: boolean;
  rotorBrake: boolean;
  navLights: boolean;
  landingLights: boolean;
  antiIce: boolean;
  parkingBrake: boolean;
}

export interface Waypoint {
  id: string;
  label: string;
  x: number;
  y: number;
  altitude: number;
  radius: number;
  isReached: boolean;
}

export interface HelicopterFlightData {
  altitude: number;
  airspeed: number;
  verticalSpeed: number;
  heading: number;
  fuel: number;
  torque: number;
  rotorRPM: number;
  engineRPM: number;
  collective: number; // 0-100
  cyclic: { x: number; y: number }; // -1 to 1
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

export interface HeliGameState {
  phase: GamePhase;
  cockpit: HelicopterCockpit;
  flightData: HelicopterFlightData;
  checklist: Record<string, boolean>;
  missionStatus: string | null;
  waypoints: Waypoint[];
  targetWaypointIndex: number;
}

export type HelicopterAction =
  | { type: 'TOGGLE_SWITCH'; key: keyof HelicopterCockpit }
  | { type: 'SET_COLLECTIVE'; value: number }
  | { type: 'SET_CYCLIC'; x: number; y: number }
  | { type: 'UPDATE_FLIGHT_DATA'; data: Partial<HelicopterFlightData> }
  | { type: 'SET_PHASE'; phase: GamePhase }
  | { type: 'RESET_GAME' };
