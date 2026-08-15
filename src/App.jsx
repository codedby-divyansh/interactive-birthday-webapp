import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, VolumeX } from 'lucide-react';
import { birthdayData } from './data/birthdayData';
import IntroScene from './scenes/IntroScene';
import BunnyScene from './scenes/BunnyScene';
import CakeScene from './scenes/CakeScene';
import GardenScene from './scenes/GardenScene';
import LetterScene from './scenes/LetterScene';
import GameScene from './scenes/GameScene';
import FinalScene from './scenes/FinalScene';

const SCENES = ['intro', 'bunny', 'cake', 'garden', 'letter', 'game', 'final'];

export default function App() {
  const [scene, setScene] = useState('intro');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef(null);

  const goToScene = useCallback((next) => {
    setHasInteracted(true);
    setScene(next);
  }, []);

  const restart = useCallback(() => {
    setScene('intro');
  }, []);

  const toggleMusic = useCallback(() => {
    if (!birthdayData.music.src) return;
    setMusicOn((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!audioRef.current || !birthdayData.music.src) return;
    if (musicOn) {
      audioRef.current.play().catch(() => setMusicOn(false));
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  const sceneIndex = SCENES.indexOf(scene);

  return (
    <div className="relative h-full w-full overflow-hidden bg-cream">
      {birthdayData.music.src && (
        <audio ref={audioRef} src={birthdayData.music.src} loop preload="auto" />
      )}

      <AnimatePresence mode="wait">
        {scene === 'intro' && (
          <IntroScene key="intro" onNext={() => goToScene('bunny')} />
        )}
        {scene === 'bunny' && (
          <BunnyScene key="bunny" onNext={() => goToScene('cake')} />
        )}
        {scene === 'cake' && (
          <CakeScene key="cake" onNext={() => goToScene('garden')} />
        )}
        {scene === 'garden' && (
          <GardenScene key="garden" onNext={() => goToScene('letter')} />
        )}
        {scene === 'letter' && (
          <LetterScene key="letter" onNext={() => goToScene('game')} />
        )}
        {scene === 'game' && (
          <GameScene key="game" onNext={() => goToScene('final')} />
        )}
        {scene === 'final' && (
          <FinalScene key="final" onRestart={restart} />
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 pointer-events-none">
        {SCENES.map((s, i) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= sceneIndex ? 'bg-petal scale-110' : 'bg-lavender/40'
            }`}
          />
        ))}
      </div>

      {/* Music toggle after first interaction */}
      {hasInteracted && birthdayData.music.src && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-cream/80 backdrop-blur-sm shadow-soft flex items-center justify-center border border-lavender/40 active:scale-95 transition-transform"
          aria-label={musicOn ? 'Mute music' : 'Play music'}
        >
          {musicOn ? (
            <Music className="w-5 h-5 text-softpurple" />
          ) : (
            <VolumeX className="w-5 h-5 text-softpurple/60" />
          )}
        </motion.button>
      )}
    </div>
  );
}
