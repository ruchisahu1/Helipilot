import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { Power } from 'lucide-react';

interface CockpitSwitchProps {
    label: string;
    isOn: boolean;
    onToggle: () => void;
    disabled?: boolean;
    variant?: 'default' | 'warning' | 'danger';
}

export const CockpitSwitch: FC<CockpitSwitchProps> = ({
    label,
    isOn,
    onToggle,
    disabled = false,
    variant = 'default'
}) => {
    const variantColors = {
        default: isOn ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-slate-700',
        warning: isOn ? 'bg-amber-500 shadow-amber-500/50' : 'bg-slate-700',
        danger: isOn ? 'bg-rose-500 shadow-rose-500/50' : 'bg-slate-700',
    };

    return (
        <div className="flex flex-col items-center gap-2 group">
            <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-tighter text-center h-4">
                {label}
            </span>
            <button
                onClick={onToggle}
                disabled={disabled}
                className={cn(
                    "relative w-12 h-20 rounded-lg p-1 transition-all duration-300 flex flex-col justify-between items-center border-[3px] border-slate-800 shadow-lg active:scale-95",
                    isOn ? variantColors[variant] : "bg-slate-800",
                    disabled && "opacity-40 cursor-not-allowed"
                )}
            >
                <div className={cn(
                    "w-full h-8 rounded-md mb-auto transition-all duration-300 flex items-center justify-center",
                    isOn ? "bg-emerald-500/20 text-emerald-400" : "text-slate-600"
                )}>
                    <Power size={14} className={cn(isOn && "drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]")} />
                </div>

                <div className={cn(
                    "w-8 h-8 rounded-full transition-all duration-500 transform border-2 border-slate-950",
                    isOn ? "translate-y-[-4px] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" : "translate-y-[4px] bg-slate-600 shadow-inner"
                )} />

                <div className="text-[8px] font-bold text-slate-500 mt-auto">
                    {isOn ? "ON" : "OFF"}
                </div>
            </button>
        </div>
    );
};
