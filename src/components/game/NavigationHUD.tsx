import { type FC } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Navigation, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavigationHUD: FC = () => {
    const { gameState } = useGame();
    const { waypoints, targetWaypointIndex, flightData } = gameState;
    const currentTarget = waypoints[targetWaypointIndex];

    if (!currentTarget) return null;

    const dx = currentTarget.x - flightData.position.x;
    const dy = currentTarget.y - flightData.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle to target relative to heading
    const angleToTarget = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
    const bearing = (angleToTarget - flightData.heading + 540) % 360 - 180;

    return (
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                <Navigation size={16} className="text-blue-400" />
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation Computer</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={14} className="text-emerald-400" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Next Objective</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">{currentTarget.label}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                        <span className="text-[9px] text-slate-500 block mb-1 uppercase">Dist</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-mono text-blue-400">{Math.round(distance)}</span>
                            <span className="text-[8px] text-blue-800">M</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                        <span className="text-[9px] text-slate-500 block mb-1 uppercase">Alt. Req</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-mono text-emerald-400">{currentTarget.altitude}</span>
                            <span className="text-[8px] text-emerald-800">FT</span>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded border border-white/5">
                        <span className="text-[9px] text-slate-500 block mb-1 uppercase">Brng</span>
                        <div className="flex items-baseline gap-1">
                            <span className={cn(
                                "text-sm font-mono",
                                Math.abs(bearing) < 10 ? "text-emerald-400" : "text-amber-400"
                            )}>
                                {Math.round(bearing)}°
                            </span>
                        </div>
                    </div>
                </div>

                {/* Compass visualizer */}
                <div className="relative h-6 bg-slate-900 rounded-full border border-white/5 overflow-hidden mt-2">
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] transition-all duration-300"
                        style={{ left: `${50 + (bearing / 180) * 50}%` }}
                    />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                </div>

                <div className="mt-4 pt-2 border-t border-white/5">
                    <span className="text-[9px] text-slate-500 block mb-2 font-bold italic">FLIGHT PLAN PROGRESS</span>
                    <div className="flex gap-1">
                        {waypoints.map((wp, idx) => (
                            <div
                                key={wp.id}
                                className={cn(
                                    "h-1.5 flex-1 rounded-full transition-colors",
                                    wp.isReached ? "bg-emerald-500" : (idx === targetWaypointIndex ? "bg-blue-500 animate-pulse" : "bg-slate-800")
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
