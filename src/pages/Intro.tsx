import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '@/contexts/SoundContext';
import {
    Play,
    ShieldAlert,
    Zap,
    Info,
    ChevronRight,
    Target,
    Activity,
    Cpu
} from 'lucide-react';

export const Intro: FC = () => {
    const navigate = useNavigate();
    const { stopSounds } = useSound();

    useEffect(() => {
        stopSounds();
    }, [stopSounds]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans overflow-hidden selection:bg-blue-500/30 relative">
            {/* Background Hud Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto h-[calc(100vh-64px)] flex flex-col items-center justify-center">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                        <Activity className="text-blue-400 w-3 h-3 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Flight Ops Ready</span>
                    </div>

                    <h1 className="text-7xl font-black italic tracking-tighter uppercase text-white mb-4">
                        HeliPilot <span className="text-blue-500 not-italic">v1.2</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Experience advanced helicopter flight dynamics and emergency response tactical training.
                    </p>
                </div>

                {/* Objective Cards */}
                <div className="grid md:grid-cols-3 gap-6 w-full mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldAlert className="text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3 italic">Phase 01: Engine Mastery</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Complete the rigorous pre-flight protocol. Manage power distribution, fuel pumps, and rotor RPM to achieve a stable hover state.
                        </p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-all group">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="text-amber-500 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3 italic">Phase 02: In-Flight Ops</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Face high-stakes emergency scenarios. Evaluate sensor data and make tactical decisions under extreme pressure to ensure mission success.
                        </p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-2xl hover:border-cyan-500/30 transition-all group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="text-cyan-400 w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3 italic">Objective: Safety</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Maintain a 100% Safety Score. Every decision impacts airframe integrity and career progression. precision is paramount.
                        </p>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-500">
                    <button
                        onClick={() => navigate('/level1')}
                        className="group relative flex items-center gap-4 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95"
                    >
                        <Play size={20} className="fill-white" />
                        Enter Cockpit
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-blue-500/50" />
                            ASAS Flight Computer
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Info size={12} className="text-blue-500/50" />
                            Arcade Controls Active
                        </div>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="fixed top-8 left-8 p-1 border-l-2 border-t-2 border-white/10 w-32 h-32 pointer-events-none" />
            <div className="fixed bottom-8 right-8 p-1 border-r-2 border-b-2 border-white/10 w-32 h-32 pointer-events-none" />
        </div>
    );
};
