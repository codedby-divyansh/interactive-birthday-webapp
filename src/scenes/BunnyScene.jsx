import { useState } from 'react';
import { motion } from 'framer-motion';
import { CinematicTransition } from '../components/SceneTransition';
import CuteBunny from '../components/CuteBunny';
import TypewriterText from '../components/TypewriterText';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function BunnyScene({ onNext }) {
  const [phase, setPhase] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const { bunny } = birthdayData;

  const handleNext = () => {
    setTransitioning(true);
    setTimeout(onNext, 800);
  };

  return (
    <CinematicTransition direction="up">
      <div className="absolute inset-0 bg-gradient-to-b from-lavender/40 via-cream to-blush/30">
        <ParticleBackground variant="day" density={25} />
      </div>

      <motion.div
        animate={transitioning ? { scale: 0.5, opacity: 0, y: -100 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <CuteBunny size={140} onTap={() => {}} />

        {phase >= 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-handwritten text-2xl md:text-3xl text-softpurple text-center text-shadow-soft max-w-xs"
          >
            <TypewriterText
              text={bunny.greeting}
              speed={45}
              onComplete={() => setTimeout(() => setPhase(1), 500)}
            />
          </motion.p>
        )}

        {phase >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-base text-night/60 text-center max-w-xs"
          >
            <TypewriterText
              text={bunny.followUp}
              speed={35}
              delay={200}
              onComplete={() => setTimeout(() => setPhase(2), 400)}
            />
          </motion.p>
        )}

        {phase >= 2 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={transitioning}
            className="cute-button"
          >
            {bunny.buttonText}
          </motion.button>
        )}
      </motion.div>
    </CinematicTransition>
  );
}
