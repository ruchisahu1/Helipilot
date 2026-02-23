import { createContext, useContext, useState, type ReactNode } from 'react';
import { useCockpitSounds } from '@/hooks/useCockpitSounds';

interface SoundContextType {
    soundEnabled: boolean;
    toggleSound: () => void;
    playToggleSound: (isOn: boolean) => void;
    playWarningSound: (severity?: 'info' | 'warning' | 'danger') => void;
    startEngineSound: (rpm: number) => void;
    startRotorSound: (rpm: number) => void;
    stopSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const sounds = useCockpitSounds();

    const toggleSound = () => setSoundEnabled((prev) => !prev);

    const playToggleSound = (isOn: boolean) => {
        if (soundEnabled) sounds.playToggleSound(isOn);
    };

    const playWarningSound = (severity?: 'info' | 'warning' | 'danger') => {
        if (soundEnabled) sounds.playWarningSound(severity);
    };

    const startEngineSound = (rpm: number) => {
        if (soundEnabled) sounds.startEngineSound(rpm);
    };

    const startRotorSound = (rpm: number) => {
        if (soundEnabled) sounds.startRotorSound(rpm);
    };

    const stopSounds = () => {
        sounds.stopSounds();
    };

    return (
        <SoundContext.Provider
            value={{
                soundEnabled,
                toggleSound,
                playToggleSound,
                playWarningSound,
                startEngineSound,
                startRotorSound,
                stopSounds,
            }}
        >
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
}
