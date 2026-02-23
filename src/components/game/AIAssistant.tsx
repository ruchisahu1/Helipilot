import { useEffect, useRef, type FC } from 'react';
import { cn } from '@/lib/utils';
import { Bot, ChevronRight } from 'lucide-react';

export interface AIMessage {
    id: string;
    type: 'info' | 'warning' | 'danger' | 'success';
    message: string;
    timestamp: Date;
}

interface AIAssistantProps {
    messages: AIMessage[];
}

export const AIAssistant: FC<AIAssistantProps> = ({ messages }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const typeStyles = {
        info: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
        warning: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
        danger: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
        success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    };

    return (
        <div className="flex flex-col h-full bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bot size={18} className="text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heli-AI Pilot Assistant</h3>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-mono">LINK STABLE</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm scrollbar-thin scrollbar-thumb-slate-800"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "px-3 py-2 border-l-2 rounded-r animate-in fade-in slide-in-from-left-2 duration-300",
                            typeStyles[msg.type]
                        )}
                    >
                        <div className="flex items-start gap-2">
                            <ChevronRight size={12} className="mt-1 flex-shrink-0" />
                            <div>
                                <p className="leading-relaxed">{msg.message}</p>
                                <span className="text-[9px] opacity-40 block mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
