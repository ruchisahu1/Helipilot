import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, ClipboardList } from 'lucide-react';
import { type HelicopterCockpit } from '@/types/game-types';

interface PreflightChecklistProps {
    cockpit: HelicopterCockpit;
    checklist: Record<string, boolean>;
}

export const PreflightChecklist: FC<PreflightChecklistProps> = ({ cockpit }) => {
    const items = [
        { id: 'battery', label: 'Battery Power', isMet: cockpit.battery },
        { id: 'fuelPumps', label: 'Fuel Pumps', isMet: cockpit.fuelPumps },
        { id: 'rotorBrake', label: 'Rotor Brake Released', isMet: !cockpit.rotorBrake },
        { id: 'engineStart', label: 'Engine Starter Active', isMet: cockpit.engineStarter },
        { id: 'avionics', label: 'Avionics Master', isMet: cockpit.avionics },
        { id: 'parkingBrake', label: 'Parking Brake Off', isMet: !cockpit.parkingBrake },
    ];

    return (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <ClipboardList size={16} className="text-amber-400" />
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pre-Flight Checklist</h3>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center justify-between p-2 rounded transition-all duration-300",
                            item.isMet ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800/30 text-slate-500"
                        )}
                    >
                        <span className="text-xs font-mono font-medium">{item.label}</span>
                        {item.isMet ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                            <Circle size={14} className="text-slate-700" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 uppercase font-bold">Readiness</span>
                <div className="flex-1 mx-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(items.filter(i => i.isMet).length / items.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
