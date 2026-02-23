import { useCallback, useRef } from 'react';

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

export function useCockpitSounds() {
    const engineOscillator = useRef<OscillatorNode | null>(null);
    const engineGain = useRef<GainNode | null>(null);
    const rotorOscillator = useRef<OscillatorNode | null>(null);
    const rotorGain = useRef<GainNode | null>(null);

    // Mechanical switch click
    const playToggleSound = useCallback((isOn: boolean) => {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(isOn ? 1200 : 800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(isOn ? 2400 : 400, ctx.currentTime + 0.02);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }, []);

    // Warning alarm (Aviation Master Caution style)
    const playWarningSound = useCallback((severity: 'info' | 'warning' | 'danger' = 'warning') => {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        const frequencies = {
            info: [880, 1100],
            warning: [660, 880],
            danger: [440, 554.37], // Tritone-ish discord
        };

        const freqs = frequencies[severity];
        const duration = severity === 'danger' ? 0.2 : 0.3;

        freqs.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = severity === 'danger' ? 'sawtooth' : 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const start = ctx.currentTime + i * (duration + 0.05);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.01);
            gain.gain.setValueAtTime(0.1, start + duration - 0.01);
            gain.gain.linearRampToValueAtTime(0, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }, []);

    // Helicopter Engine (Turbine Whine)
    const startEngineSound = useCallback((rpm: number = 0) => {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        if (!engineOscillator.current) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(50 + (rpm * 2), ctx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200 + (rpm * 5), ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1);

            osc.start();
            engineOscillator.current = osc;
            engineGain.current = gain;
        } else {
            // Update RPM based pitch
            engineOscillator.current.frequency.setTargetAtTime(50 + (rpm * 2), ctx.currentTime, 0.1);
        }
    }, []);

    // Rotor Blade Slap (Rhythmic modulation)
    const startRotorSound = useCallback((rpm: number = 0) => {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        if (!rotorOscillator.current) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(40, ctx.currentTime); // Low thud

            lfo.type = 'square';
            lfo.frequency.setValueAtTime((rpm / 100) * 10, ctx.currentTime); // Blade passing frequency

            lfoGain.gain.setValueAtTime(0.05, ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);

            osc.connect(gain);
            gain.connect(ctx.destination);

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);

            osc.start();
            lfo.start();
            rotorOscillator.current = osc;
            rotorGain.current = gain;
            (rotorOscillator.current as any)._lfo = lfo;
        } else {
            // Update rotor speed
            (rotorOscillator.current as any)._lfo.frequency.setTargetAtTime((rpm / 100) * 15, ctx.currentTime, 0.2);
        }
    }, []);

    const stopSounds = useCallback(() => {
        const ctx = getAudioContext();
        [engineGain, rotorGain].forEach(g => {
            if (g.current) g.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        });

        setTimeout(() => {
            engineOscillator.current?.stop();
            rotorOscillator.current?.stop();
            (rotorOscillator.current as any)?._lfo?.stop();
            engineOscillator.current = null;
            rotorOscillator.current = null;
        }, 600);
    }, []);

    return {
        playToggleSound,
        playWarningSound,
        startEngineSound,
        startRotorSound,
        stopSounds,
    };
}
