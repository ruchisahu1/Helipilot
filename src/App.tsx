import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/contexts/GameContext';
import { SoundProvider } from '@/contexts/SoundContext';
import { Intro } from '@/pages/Intro';
import { Level1 } from '@/pages/Level1';
import { Level2 } from '@/pages/Level2';

export default function App() {
  return (
    <Router basename="/user/gamified/Helicopter-Pilot">
      <GameProvider>
        <SoundProvider>
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/level1" element={<Level1 />} />
            <Route path="/level2" element={<Level2 />} />
            {/* Future levels will be added here */}
          </Routes>
        </SoundProvider>
      </GameProvider>
    </Router>
  );
}
