import { type FC, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    BookOpen,
    Shield,
    Zap,
    Droplets,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Info,
    Clock,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/contexts/SoundContext';

import { SCENARIOS } from '@/data/scenarios';

export const Level2: FC = () => {
    const navigate = useNavigate();
    const { stopSounds, playWarningSound } = useSound();
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [safetyScore, setSafetyScore] = useState(100);
    const [accuracy, setAccuracy] = useState(100);
    const [handledCount, setHandledCount] = useState(0);
    const [timer, setTimer] = useState(20);
    const [isGameOver, setIsGameOver] = useState(false);
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Play emergency sound when a new scenario starts
    useEffect(() => {
        if (isGameOver || showFeedback) return;

        const priorityMap: Record<string, 'info' | 'warning' | 'danger'> = {
            'LOW': 'info',
            'MEDIUM': 'warning',
            'HIGH': 'danger'
        };

        const severity = priorityMap[SCENARIOS[currentScenarioIndex].priority] || 'warning';
        playWarningSound(severity);
    }, [currentScenarioIndex, playWarningSound, isGameOver, showFeedback]);

    const currentScenario = SCENARIOS[currentScenarioIndex];

    const handleNextScenario = useCallback(() => {
        if (currentScenarioIndex < SCENARIOS.length - 1) {
            setCurrentScenarioIndex(prev => prev + 1);
            setSelectedActionId(null);
            setShowFeedback(false);
            setTimer(20);
        } else {
            setIsGameOver(true);
        }
    }, [currentScenarioIndex]);

    useEffect(() => {
        // Ensure all previous engine sounds are stopped when entering Level 2
        stopSounds();
        return () => stopSounds();
    }, [stopSounds]);

    useEffect(() => {
        if (isGameOver || showFeedback) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    // Time out counts as a fail for the scenario
                    handleActionSelect('timeout', false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isGameOver, showFeedback]);

    const handleActionSelect = (actionId: string, isCorrect: boolean) => {
        if (selectedActionId) return;

        setSelectedActionId(actionId);
        setShowFeedback(true);
        setHandledCount(prev => prev + 1);

        if (!isCorrect) {
            setSafetyScore(prev => Math.max(0, prev - 25));
            setAccuracy(prev => Math.max(0, prev - (100 / SCENARIOS.length)));
        }
    };

    const isMissionSuccess = handledCount === SCENARIOS.length && safetyScore > 50;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans overflow-hidden select-none relative">
            {/* Background Animation (Hovering effect) */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse" />
                {/* Simulated clouds/motion */}
                <div className="absolute top-0 left-0 w-full h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[slide_20s_linear_infinite]" />
            </div>

            <style>{`
                @keyframes slide {
                    from { transform: translateY(0); }
                    to { transform: translateY(-50%); }
                }
                .cockpit-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .progress-segment {
                    height: 6px;
                    flex: 1;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                }
                .progress-segment.filled {
                    background: #3b82f6;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                }
                .choice-card {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.2s ease;
                }
                .choice-card:hover:not(:disabled) {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: rgba(59, 130, 246, 0.5);
                    transform: translateX(4px);
                }
                .choice-card.selected-correct {
                    border-color: #10b981;
                    background: rgba(16, 185, 129, 0.1);
                }
                .choice-card.selected-wrong {
                    border-color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }
            `}</style>

            <header className="relative z-10 flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded flex items-center justify-center">
                        <AlertTriangle className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-widest text-white uppercase italic">Level 2: In-Flight Emergency</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Handle the emergency situation!</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-white/10 rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-colors">
                    <BookOpen size={14} className="text-amber-500" />
                    Flight Manual
                </button>
            </header>

            <div className="relative z-10 grid grid-cols-12 gap-8 max-w-7xl mx-auto h-[700px]">
                {/* Left Side: Stats & Data */}
                <div className="col-span-3 flex flex-col gap-6">
                    {/* Mission Status */}
                    <div className="cockpit-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="flex items-center gap-1"><Shield size={10} /> Safety Score</span>
                                    <span>{safetyScore}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${safetyScore}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="flex items-center gap-1"><Zap size={10} /> Decision Accuracy</span>
                                    <span>{Math.round(accuracy)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${accuracy}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flight Data */}
                    <div className="cockpit-card p-5">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Flight Data</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-[9px] text-slate-500 block mb-1">ALTITUDE</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-mono text-cyan-400">FL350</span>
                                </div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded">
                                <span className="text-[9px] text-slate-500 block mb-1">SPEED</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-mono text-cyan-400">480</span>
                                    <span className="text-[9px] text-slate-600 font-bold">KTS</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[9px] text-slate-500 mb-1">
                                <span className="flex items-center gap-1"><Droplets size={10} /> Fuel Remaining</span>
                                <span>94%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[94%]" />
                            </div>
                        </div>
                    </div>

                    {/* Flight Progress */}
                    <div className="cockpit-card p-5 mt-auto">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Flight Progress</h3>
                        <div className="mb-6">
                            <div className="flex justify-between text-[9px] text-slate-500 mb-1 uppercase tracking-tight">
                                <span>Journey</span>
                                <span>{Math.round((handledCount / SCENARIOS.length) * 100)}%</span>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={cn("progress-segment", i < (handledCount / SCENARIOS.length) * 5 && "filled")} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-500 block mb-2 uppercase tracking-tight">Emergencies</span>
                            <div className="flex gap-2">
                                {SCENARIOS.map((_, i) => (
                                    <div key={i} className={cn(
                                        "w-8 h-2 rounded-sm",
                                        i < handledCount ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "bg-slate-800"
                                    )} />
                                ))}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2">{handledCount} of {SCENARIOS.length} handled</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Decision Terminal */}
                <div className="col-span-9">
                    <div className="h-full border border-red-500/20 bg-slate-950/40 rounded p-1">
                        <div className="h-full border border-red-500/10 rounded flex flex-col p-10 relative overflow-hidden">
                            {/* Decorative Grid Lines */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                <div className="h-full w-px bg-white absolute left-10" />
                                <div className="h-full w-px bg-white absolute right-10" />
                                <div className="w-full h-px bg-white absolute top-10" />
                                <div className="w-full h-px bg-white absolute bottom-10" />
                            </div>

                            {isGameOver ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    {isMissionSuccess ? (
                                        <div className="animate-in zoom-in duration-500">
                                            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/40 mb-6 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                            </div>
                                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Mission Success</h2>
                                            <p className="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-8">All emergencies handled with tactical precision</p>
                                            <button
                                                onClick={() => navigate('/')}
                                                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                                            >
                                                <Home size={18} />
                                                Return Home
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-in zoom-in duration-500">
                                            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/40 mb-6 mx-auto shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                                <XCircle className="w-12 h-12 text-red-400" />
                                            </div>
                                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Flight Failure</h2>
                                            <p className="text-red-400 font-bold uppercase tracking-widest text-sm mb-8">Airframe integrity compromised or safety standards not met</p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95"
                                            >
                                                Retry Mission
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-2 text-cyan-400">
                                            <Clock size={16} />
                                            <span className="text-xs font-bold uppercase tracking-[0.2em]">Decision Time</span>
                                        </div>
                                        <div className="flex-1 mx-6 h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full transition-all duration-1000",
                                                    timer < 10 ? "bg-red-500" : "bg-cyan-500"
                                                )}
                                                style={{ width: `${(timer / 20) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-mono text-xl text-white w-10 text-right">{timer}s</span>
                                    </div>

                                    <div className="mb-12">
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="w-14 h-14 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                                <Zap className="text-red-500 w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-red-600 text-[9px] font-black text-white px-2 py-0.5 rounded tracking-widest">{currentScenario.priority} PRIORITY</span>
                                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Incident #{currentScenarioIndex + 1}</span>
                                                </div>
                                                <h2 className="text-3xl font-bold text-white tracking-tight">{currentScenario.title}</h2>
                                            </div>
                                        </div>
                                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed mb-8">
                                            {currentScenario.description}
                                        </p>

                                        <div className="bg-amber-500/5 border-l-2 border-amber-500 p-4 rounded-r">
                                            <div className="flex items-center gap-2 mb-1 text-amber-500">
                                                <Info size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">AI Advisory</span>
                                            </div>
                                            <p className="text-amber-500/80 text-xs font-medium italic">
                                                {currentScenario.aiAdvisory}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Select your action:</h3>
                                        <div className="grid gap-3">
                                            {currentScenario.actions.map((action) => (
                                                <button
                                                    key={action.id}
                                                    disabled={!!selectedActionId}
                                                    onClick={() => handleActionSelect(action.id, action.isCorrect)}
                                                    className={cn(
                                                        "choice-card w-full p-4 rounded text-left group",
                                                        selectedActionId === action.id && (action.isCorrect ? "selected-correct" : "selected-wrong")
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between pointer-events-none">
                                                        <div>
                                                            <h4 className="text-white font-bold mb-1 group-hover:text-cyan-400 transition-colors">{action.label}</h4>
                                                            <p className="text-xs text-slate-500">{action.description}</p>
                                                        </div>
                                                        <ChevronRight className="text-slate-700 group-hover:text-cyan-500 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {showFeedback && (
                                        <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-300">
                                            <div className={cn(
                                                "p-4 rounded border flex items-center justify-between",
                                                SCENARIOS[currentScenarioIndex].actions.find(a => a.id === selectedActionId)?.isCorrect
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                    : "bg-red-500/10 border-red-500/30 text-red-400"
                                            )}>
                                                <p className="text-sm font-bold">
                                                    {SCENARIOS[currentScenarioIndex].actions.find(a => a.id === selectedActionId)?.feedback || "Time expired. Critical stability loss."}
                                                </p>
                                                <button
                                                    onClick={handleNextScenario}
                                                    className="px-6 py-2 bg-slate-800 text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors"
                                                >
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
