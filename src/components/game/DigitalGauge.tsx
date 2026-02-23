import { type FC } from 'react';
import { cn } from '@/lib/utils'; // I'll need to create this util or just use template literals

interface DigitalGaugeProps {
    label: string;
    value: string | number;
    unit?: string;
    status?: 'normal' | 'warning' | 'danger';
    className?: string;
}

export const DigitalGauge: FC<DigitalGaugeProps> = ({
    label,
    value,
    unit = '',
    status = 'normal',
    className
}) => {
    const statusColors = {
        normal: 'text-green-400',
        warning: 'text-yellow-400',
        danger: 'text-red-500 animate-pulse',
    };

    return (
        <div className={cn("bg-black/80 border border-slate-700 p-3 rounded-md shadow-inner flex flex-col items-center justify-center min-w-[100px]", className)}>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-bold">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className={cn("text-2xl font-mono leading-none", statusColors[status])}>
                    {value}
                </span>
                <span className="text-xs text-slate-500 font-mono">{unit}</span>
            </div>
        </div>
    );
};
