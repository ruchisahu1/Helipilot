import { type FC } from 'react';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

export const Radar: FC = () => {
    const { gameState } = useGame();
    const { flightData, waypoints, targetWaypointIndex } = gameState;

    // Scale mapping for the radar (e.g., 5000m range)
    const range = 5000;
    const size = 200; // px
    const center = size / 2;

    const toRadarCoord = (pos: { x: number; y: number }) => {
        // Offset by helicopter position
        const dx = pos.x - flightData.position.x;
        const dy = pos.y - flightData.position.y;

        // Scale and flip Y for screen space (radar uses Cartesian)
        // We'll keep it Cartesian for the radar map: Up is +Y
        return {
            x: center + (dx / range) * center,
            y: center - (dy / range) * center
        };
    };

    return (
        <div className="cockpit-panel p-4 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tactical Map</span>
                <span className="text-[9px] font-mono text-blue-500">{range}M RANGE</span>
            </div>

            <div
                className="relative bg-slate-950 rounded-full border border-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)] overflow-hidden"
                style={{ width: size, height: size }}
            >
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <div className="w-full h-px bg-slate-400" />
                    <div className="h-full w-px bg-slate-400" />
                    <div className="absolute inset-0 rounded-full border border-slate-400" />
                    <div className="absolute inset-[25%] rounded-full border border-slate-400" />
                    <div className="absolute inset-[50%] rounded-full border border-slate-400" />
                </div>

                {/* Waypoints */}
                {waypoints.map((wp, i) => {
                    const dx = wp.x - flightData.position.x;
                    const dy = wp.y - flightData.position.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const coords = toRadarCoord(wp);
                    const isTarget = i === targetWaypointIndex;

                    if (dist > range) {
                        if (!isTarget) return null;
                        // Draw pointer on the edge
                        const angle = Math.atan2(dx, dy);
                        const edgeX = center + Math.sin(angle) * (center - 10);
                        const edgeY = center - Math.cos(angle) * (center - 10);
                        return (
                            <div
                                key={wp.id}
                                className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-blue-400"
                                style={{
                                    left: edgeX,
                                    top: edgeY,
                                    transform: `translate(-50%, -50%) rotate(${angle * 180 / Math.PI}deg)`
                                }}
                            />
                        );
                    }

                    return (
                        <div
                            key={wp.id}
                            className={cn(
                                "absolute w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 transition-colors duration-500",
                                wp.isReached ? "border-emerald-500/30 bg-emerald-500/10" :
                                    (isTarget ? "border-blue-400 bg-blue-400/20 animate-pulse scale-125" : "border-slate-600")
                            )}
                            style={{ left: coords.x, top: coords.y }}
                        >
                            {isTarget && (
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold whitespace-nowrap text-blue-400 uppercase">
                                    {wp.label}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Helicopter Icon (Center) */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ transform: `translate(-50%, -50%) rotate(${flightData.heading}deg)` }}
                >
                    <div className="w-1 h-3 bg-white rounded-full shadow-[0_0_8px_white]" />
                    <div className="w-4 h-0.5 bg-white -mt-2" />
                </div>

                {/* Scan Line effect */}
                <div className="absolute inset-0 rounded-full border-2 border-slate-400/5 animate-[radar-scan_4s_linear_infinite]" />
            </div>

            <style>{`
                @keyframes radar-scan {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div className="mt-2 flex justify-between w-full text-[9px] font-mono text-slate-500">
                <span>N</span>
                <span>E</span>
                <span>S</span>
                <span>W</span>
            </div>
        </div>
    );
};
