import { useState } from 'react';
import { motion } from 'framer-motion';
import SceneTransition from '../components/SceneTransition';
import FlowerGarden from '../components/FlowerGarden';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function GardenScene({ onNext }) {
  const [showContinue, setShowContinue] = useState(false);
  const { garden } = birthdayData;

  return (
    <SceneTransition className="bg-gradient-to-b from-green-50/50 via-cream to-lavender/20 !overflow-y-auto">
      <ParticleBackground variant="day" density={15} />

      {/* Grass at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-200/30 to-transparent pointer-events-none" />

      <div className="relative z-10 py-8 w-full">
        <FlowerGarden
          flowers={garden.flowers}
          title={garden.title}
          onAllVisited={() => setShowContinue(true)}
        />

        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8 pb-16"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="cute-button"
            >
              Continue 💌
            </motion.button>
          </motion.div>
        )}

        {!showContinue && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-sm text-night/40 mt-6 font-body"
          >
            tap each flower to bloom 🌸
          </motion.p>
        )}
      </div>
    </SceneTransition>
  );
}
