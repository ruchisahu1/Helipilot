import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { useSound } from '@/contexts/SoundContext';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { CockpitSwitch } from '@/components/game/CockpitSwitch';
import { DigitalGauge } from '@/components/game/DigitalGauge';
import { AIAssistant, type AIMessage } from '@/components/game/AIAssistant';
import { PreflightChecklist } from '@/components/game/PreflightChecklist';
import { type HelicopterCockpit } from '@/types/game-types';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    RotateCcw,
    Volume2,
    VolumeX,
    ShieldAlert,
    Info
} from 'lucide-react';

export const Level1: FC = () => {
    useKeyboardControls();
    const navigate = useNavigate();
    const { gameState, toggleSwitch, setCollective, resetGame } = useGame();
    const {
        soundEnabled,
        toggleSound,
        playToggleSound,
        startEngineSound,
        startRotorSound,
        stopSounds
    } = useSound();

    const { cockpit, flightData } = gameState;

    const preflightComplete =
        cockpit.battery &&
        cockpit.fuelPumps &&
        !cockpit.rotorBrake &&
        flightData.rotorRPM > 95 &&
        !cockpit.parkingBrake &&
        cockpit.avionics;

    const [aiMessages, setAiMessages] = useState<AIMessage[]>([
        {
            id: '1',
            type: 'info',
            message: 'Welcome, Pilot. We are on the pad. Begin pre-flight checks. I will monitor systems.',
            timestamp: new Date(),
        },
    ]);

    const [milestones, setMilestones] = useState({
        switchesReady: false,
        checklistComplete: false
    });

    // Dynamic AI Guidance
    useEffect(() => {
        const switchesReady = cockpit.battery && cockpit.fuelPumps && cockpit.engineStarter && !cockpit.rotorBrake;

        if (switchesReady && !milestones.switchesReady) {
            setAiMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    type: 'info',
                    message: 'Systems nominal. RPM low. Increase collective carefully to ~30% to stabilize rotor speed.',
                    timestamp: new Date()
                }
            ]);
            setMilestones(prev => ({ ...prev, switchesReady: true }));
        }

        if (preflightComplete && !milestones.checklistComplete) {
            setAiMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    type: 'success',
                    message: 'Checklist 100% complete. Flight computer synchronized. Initiate hover when ready.',
                    timestamp: new Date()
                }
            ]);
            setMilestones(prev => ({ ...prev, checklistComplete: true }));
        }
    }, [cockpit, preflightComplete, milestones]);

    // Sync sounds with cockpit state
    useEffect(() => {
        if (cockpit.battery && cockpit.fuelPumps && cockpit.engineStarter) {
            startEngineSound(flightData.engineRPM);
        }

        if (flightData.rotorRPM > 0) {
            startRotorSound(flightData.rotorRPM);
        }

        if (!cockpit.battery) {
            stopSounds();
        }

        return () => {
            stopSounds();
        };
    }, [cockpit, flightData.engineRPM, flightData.rotorRPM, stopSounds]);

    const handleToggle = (key: keyof HelicopterCockpit) => {
        playToggleSound(!cockpit[key]);
        toggleSwitch(key);
    };


    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
            {/* HUD / Glass Background effect */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col h-screen max-h-screen">
                {/* Header */}
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                            <ShieldAlert className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">HeliPilot <span className="text-blue-500 not-italic">v1.0</span></h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MISSION: ENGINE START & STABILITY</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSound}
                            className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-90"
                        >
                            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <button
                            onClick={resetGame}
                            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-600 transition-all active:scale-90"
                        >
                            <RotateCcw size={16} />
                            Reset Mission
                        </button>
                    </div>
                </header>

                {/* Main Cockpit Layout */}
                <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">

                    {/* Left Panel: Systems & Intelligence */}
                    <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
                        <div className="flex-1 min-h-0">
                            <AIAssistant messages={aiMessages} />
                        </div>
                        <PreflightChecklist cockpit={cockpit} checklist={gameState.checklist} />
                    </div>

                    {/* Center Panel: Primary Flight Display (PFD) */}
                    <div className="lg:col-span-6 flex flex-col gap-6">
                        <div className="flex-1 bg-slate-950 border-4 border-slate-900 rounded-2xl p-8 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="w-full h-full border-t border-b border-white/20 my-10" />
                            </div>

                            <div className="relative h-full flex flex-col items-center justify-center">
                                <div className="flex justify-between w-full mb-12 px-6">
                                    <DigitalGauge label="Altitude" value={Math.round(flightData.altitude)} unit="FT" status={flightData.altitude < 10 ? 'normal' : 'warning'} />
                                    <DigitalGauge label="Rotor RPM" value={Math.round(flightData.rotorRPM)} unit="%" status={flightData.rotorRPM < 90 ? 'danger' : 'normal'} />
                                    <DigitalGauge label="Airspeed" value={Math.round(flightData.airspeed)} unit="KTS" />
                                </div>

                                {/* Horizon replacement for now */}
                                <div className="w-64 h-64 rounded-full border-2 border-slate-800 flex items-center justify-center relative">
                                    <div className="w-full h-0.5 bg-slate-700 absolute" />
                                    <div className="text-[10px] absolute top-4 text-slate-600 font-bold tracking-widest uppercase">Stability Monitor</div>
                                    <div className={cn(
                                        "w-12 h-12 bg-blue-500/20 border-2 border-blue-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                                    )} style={{
                                        transform: `translate(${flightData.cyclic.x * 20}px, ${flightData.cyclic.y * 20}px)`
                                    }} />
                                </div>

                                <div className="flex gap-4 mt-12 w-full justify-center">
                                    <DigitalGauge label="Vertical Speed" value={Math.round(flightData.verticalSpeed)} unit="FPM" />
                                    <DigitalGauge label="Torque" value={Math.round(flightData.torque)} unit="%" />
                                    <DigitalGauge label="Fuel" value={Math.round(flightData.fuel)} unit="%" status={flightData.fuel < 20 ? 'danger' : 'normal'} />
                                </div>
                            </div>
                        </div>

                        {/* OverHead Panel (Switches) */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-2xl">
                            <div className="flex flex-wrap justify-center gap-6">
                                <CockpitSwitch label="Battery" isOn={cockpit.battery} onToggle={() => handleToggle('battery')} />
                                <CockpitSwitch label="Fuel Pumps" isOn={cockpit.fuelPumps} onToggle={() => handleToggle('fuelPumps')} />
                                <CockpitSwitch label="Rotor Brake" isOn={cockpit.rotorBrake} onToggle={() => handleToggle('rotorBrake')} variant="danger" />
                                <CockpitSwitch label="Starter" isOn={cockpit.engineStarter} onToggle={() => handleToggle('engineStarter')} variant="warning" />
                                <CockpitSwitch label="Avionics" isOn={cockpit.avionics} onToggle={() => handleToggle('avionics')} />
                                <CockpitSwitch label="Nav Lights" isOn={cockpit.navLights} onToggle={() => handleToggle('navLights')} />
                                <CockpitSwitch label="Parking Brake" isOn={cockpit.parkingBrake} onToggle={() => handleToggle('parkingBrake')} variant="danger" />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Mission Status & Controls */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex-1">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <Info size={16} />
                                <h3 className="text-xs font-extrabold uppercase tracking-widest">Mission Status</h3>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-mono">
                                {gameState.missionStatus}
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                    <span>Collective Control</span>
                                    <span className="text-blue-500 font-mono text-xs">{flightData.collective}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={flightData.collective}
                                    onChange={(e) => setCollective(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <p className="text-[9px] text-slate-600 font-medium">Controls vertical lift and rotor pitch.</p>
                            </div>

                            <button
                                onClick={() => navigate('/level2')}
                                disabled={!preflightComplete}
                                className={cn(
                                    "w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 flex items-center justify-center gap-2",
                                    preflightComplete
                                        ? "bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 active:scale-95"
                                        : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                                )}
                            >
                                {preflightComplete ? "Initiate Hover" : "Checklist Incomplete"}
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
