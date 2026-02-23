import { useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';

export const useKeyboardControls = () => {
    const { setCyclic } = useGame();
    const keysPressed = useRef<Record<string, boolean>>({});

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                keysPressed.current[key] = true;
                updateCyclic();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                keysPressed.current[key] = false;
                updateCyclic();
            }
        };

        const updateCyclic = () => {
            let x = 0;
            let y = 0;

            if (keysPressed.current['w']) y += 0.5;
            if (keysPressed.current['s']) y -= 0.5;
            if (keysPressed.current['a']) x -= 0.5;
            if (keysPressed.current['d']) x += 0.5;

            // Simple additive logic for now, could be smoothed
            setCyclic(x, y);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [setCyclic]);
};
