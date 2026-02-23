import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import {
    type HelicopterCockpit,
    type HelicopterFlightData,
    type HeliGameState,
} from '@/types/game-types';

interface GameContextType {
    gameState: HeliGameState;
    toggleSwitch: (key: keyof HelicopterCockpit) => void;
    setCollective: (value: number) => void;
    setCyclic: (x: number, y: number) => void;
    completePhase: () => void;
    resetGame: () => void;
    updateFlightData: (data: Partial<HelicopterFlightData>) => void;
}

const initialCockpit: HelicopterCockpit = {
    battery: false,
    avionics: false,
    fuelPumps: false,
    engineStarter: false,
    rotorBrake: true,
    navLights: false,
    landingLights: false,
    antiIce: false,
    parkingBrake: true,
};

const initialFlightData: HelicopterFlightData = {
    altitude: 0,
    airspeed: 0,
    verticalSpeed: 0,
    heading: 0,
    fuel: 100,
    torque: 0,
    rotorRPM: 0,
    engineRPM: 0,
    collective: 0,
    cyclic: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
};

const initialGameState: HeliGameState = {
    phase: 'startup',
    cockpit: initialCockpit,
    flightData: initialFlightData,
    checklist: {
        battery: false,
        fuelPumps: false,
        rotorBrake: false,
        engineStart: false,
        avionics: false,
        readyToHover: false,
    },
    missionStatus: "Prepare for engine startup.",
    waypoints: [
        { id: '1', label: 'Departure Pad', x: 0, y: 0, altitude: 0, radius: 10, isReached: true },
        { id: '2', label: 'Checkpoint Bravo', x: 500, y: 200, altitude: 200, radius: 50, isReached: false },
        { id: '3', label: 'Terminal Pad', x: 1000, y: 100, altitude: 0, radius: 20, isReached: false },
    ],
    targetWaypointIndex: 1,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameState, setGameState] = useState<HeliGameState>(initialGameState);

    // Simulation loop for RPMs and basic physics
    useEffect(() => {
        const timer = setInterval(() => {
            setGameState(prev => {
                let { cockpit, flightData, waypoints, targetWaypointIndex } = prev;
                let newFlightData = { ...flightData };
                let newWaypoints = [...waypoints];
                let newTargetIndex = targetWaypointIndex;

                // Adjust constants for 30Hz simulation (orig was 10Hz)
                // We divide previous increments by ~3
                const dtFactor = 0.33;

                // Engine and Rotor logic
                if (cockpit.engineStarter && cockpit.battery && cockpit.fuelPumps && newFlightData.fuel > 0) {
                    newFlightData.engineRPM = Math.min(100, newFlightData.engineRPM + (2 * dtFactor));
                } else if (!cockpit.engineStarter || newFlightData.fuel <= 0) {
                    newFlightData.engineRPM = Math.max(0, newFlightData.engineRPM - (1 * dtFactor));
                }

                if (newFlightData.engineRPM > 20 && !cockpit.rotorBrake) {
                    newFlightData.rotorRPM = Math.min(newFlightData.engineRPM, newFlightData.rotorRPM + (1.5 * dtFactor));
                } else {
                    newFlightData.rotorRPM = Math.max(0, newFlightData.rotorRPM - (cockpit.rotorBrake ? (5 * dtFactor) : (0.5 * dtFactor)));
                }

                // Torque logic
                if (newFlightData.rotorRPM > 0) {
                    newFlightData.torque = (newFlightData.collective * 0.8) + (newFlightData.rotorRPM * 0.2);
                } else {
                    newFlightData.torque = 0;
                }

                // Vertical physics - Arcade Stability
                if (newFlightData.rotorRPM > 90) {
                    // 50% collective is now "Neutral Hover"
                    // Altitude will hold much more stable
                    const hoverPoint = 50;
                    const verticalForce = (newFlightData.collective - hoverPoint) / 10;
                    newFlightData.verticalSpeed = verticalForce;
                    newFlightData.altitude = Math.max(0, newFlightData.altitude + (newFlightData.verticalSpeed * dtFactor));
                } else {
                    newFlightData.verticalSpeed = 0;
                    newFlightData.altitude = Math.max(0, newFlightData.altitude - (2 * dtFactor));
                }

                // Horizontal physics - Arcade Mode with Active Braking
                if (newFlightData.altitude > 0.5) {
                    const isInputActive = Math.abs(newFlightData.cyclic.x) > 0.01 || Math.abs(newFlightData.cyclic.y) > 0.01;

                    const forceMultiplier = 1.5 * dtFactor;
                    const accelerationX = newFlightData.cyclic.x * forceMultiplier;
                    const accelerationY = newFlightData.cyclic.y * forceMultiplier;

                    // Stronger damping when NO input is provided (Active Braking)
                    const activeDrag = 0.85;
                    const cruisingDrag = 0.94;
                    const currentDrag = isInputActive ? cruisingDrag : activeDrag;

                    newFlightData.velocity.x = (newFlightData.velocity.x + accelerationX) * currentDrag;
                    newFlightData.velocity.y = (newFlightData.velocity.y + accelerationY) * currentDrag;

                    // Hard stop at very low speeds to prevent microscopic drifting
                    if (!isInputActive && Math.abs(newFlightData.velocity.x) < 0.05) newFlightData.velocity.x = 0;
                    if (!isInputActive && Math.abs(newFlightData.velocity.y) < 0.05) newFlightData.velocity.y = 0;

                    const maxVel = 40;
                    const currentVel = Math.sqrt(Math.pow(newFlightData.velocity.x, 2) + Math.pow(newFlightData.velocity.y, 2));
                    if (currentVel > maxVel) {
                        const ratio = maxVel / currentVel;
                        newFlightData.velocity.x *= ratio;
                        newFlightData.velocity.y *= ratio;
                    }

                    newFlightData.position.x += newFlightData.velocity.x;
                    newFlightData.position.y += newFlightData.velocity.y;

                    newFlightData.airspeed = currentVel * 3;

                    if (currentVel > 0.1) {
                        newFlightData.heading = (Math.atan2(newFlightData.velocity.x, newFlightData.velocity.y) * 180 / Math.PI + 360) % 360;
                    }
                } else {
                    newFlightData.velocity = { x: 0, y: 0 };
                    newFlightData.airspeed = 0;
                }

                // Waypoint logic
                const target = newWaypoints[newTargetIndex];
                if (target && !target.isReached) {
                    const dist = Math.sqrt(
                        Math.pow(newFlightData.position.x - target.x, 2) +
                        Math.pow(newFlightData.position.y - target.y, 2)
                    );
                    const altDist = Math.abs(newFlightData.altitude - target.altitude);

                    if (dist < Math.max(target.radius, 100) && altDist < 100) {
                        newWaypoints[newTargetIndex] = { ...target, isReached: true };
                        if (newTargetIndex < newWaypoints.length - 1) {
                            newTargetIndex++;
                        }
                    }
                }

                return {
                    ...prev,
                    flightData: newFlightData,
                    waypoints: newWaypoints,
                    targetWaypointIndex: newTargetIndex
                };
            });
        }, 33); // 30Hz

        return () => clearInterval(timer);
    }, []);

    const toggleSwitch = (key: keyof HelicopterCockpit) => {
        setGameState(prev => ({
            ...prev,
            cockpit: { ...prev.cockpit, [key]: !prev.cockpit[key] }
        }));
    };

    const setCollective = (value: number) => {
        setGameState(prev => ({
            ...prev,
            flightData: { ...prev.flightData, collective: value }
        }));
    };

    const setCyclic = (x: number, y: number) => {
        setGameState(prev => ({
            ...prev,
            flightData: { ...prev.flightData, cyclic: { x, y } }
        }));
    };

    const updateFlightData = (data: Partial<HelicopterFlightData>) => {
        setGameState(prev => ({
            ...prev,
            flightData: { ...prev.flightData, ...data }
        }));
    };

    const completePhase = () => {
        // Logic to advance phase
    };

    const resetGame = () => setGameState(initialGameState);

    return (
        <GameContext.Provider value={{
            gameState,
            toggleSwitch,
            setCollective,
            setCyclic,
            completePhase,
            resetGame,
            updateFlightData
        }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
}
