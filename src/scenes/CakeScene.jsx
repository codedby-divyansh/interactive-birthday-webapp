import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player/youtube'; // 1. Imported the player
import SceneTransition from '../components/SceneTransition';
import BirthdayCake from '../components/BirthdayCake';
import TypewriterText from '../components/TypewriterText';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function CakeScene({ onNext }) {
  const [phase, setPhase] = useState(0);
  const [wishMade, setWishMade] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // 2. Added state for music
  const { cake } = birthdayData;

  return (
    <SceneTransition className="bg-gradient-to-b from-cream via-blush/20 to-lavender/30">
      <ParticleBackground variant="day" density={20} />

      {/* 3. Added the hidden YouTube player */}
      <div style={{ display: 'none' }}>
        <ReactPlayer
          url="https://youtu.be/5u4xTa3LR2U"
          playing={isMusicPlaying}
          volume={1.0}
          width="0px"
          height="0px"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md">
        {phase >= 0 && !wishMade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="font-body text-night/60 mb-2">
              <TypewriterText
                text={cake.beforeWish}
                speed={40}
                onComplete={() => setTimeout(() => setPhase(1), 300)}
              />
            </p>
          </motion.div>
        )}

        {phase >= 1 && !wishMade && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-handwritten text-2xl text-softpurple text-shadow-soft"
          >
            {cake.makeWish}
          </motion.p>
        )}

        <BirthdayCake
          candleCount={cake.candleCount}
          onAllBlown={() => {
            setWishMade(true);
            setIsMusicPlaying(true); // 4. Triggers the music when candles are blown
          }}
        />

        {!wishMade && phase >= 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-night/40 font-body"
          >
            tap each candle ✨
          </motion.p>
        )}

        <AnimatePresence>
          {wishMade && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="flex flex-col items-center gap-4"
            >
              <motion.h2
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: 0 }}
                className="font-handwritten text-2xl md:text-3xl text-petal text-center text-shadow-soft px-4"
              >
                {cake.birthdayMessage}
              </motion.h2>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="cute-button"
              >
                {cake.moreButton}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SceneTransition>
  );
}