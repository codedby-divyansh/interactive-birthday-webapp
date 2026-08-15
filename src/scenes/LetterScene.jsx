import { useState } from 'react';
import { motion } from 'framer-motion';
import SceneTransition from '../components/SceneTransition';
import Envelope from '../components/Envelope';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function LetterScene({ onNext }) {
  const [letterOpened, setLetterOpened] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const { letter } = birthdayData;

  return (
    <SceneTransition className="bg-gradient-to-b from-blush/30 via-cream to-lavender/20">
      <ParticleBackground variant="day" density={20} />

      <div className="relative z-10 flex flex-col items-center">
        <Envelope
          prompt={letter.prompt}
          message={letter.message}
          onOpen={() => {
            setLetterOpened(true);
            setTimeout(() => setCanContinue(true), 4000);
          }}
        />

        {canContinue && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className="cute-button mt-8"
          >
            Next surprise →
          </motion.button>
        )}

        {letterOpened && !canContinue && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-xs text-night/30 mt-4 font-body"
          >
            reading...
          </motion.p>
        )}
      </div>
    </SceneTransition>
  );
}
