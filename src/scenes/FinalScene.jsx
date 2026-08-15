import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import SceneTransition from '../components/SceneTransition';
import CuteBunny from '../components/CuteBunny';
import TypewriterText from '../components/TypewriterText';
import ParticleBackground from '../components/ParticleBackground';
import { birthdayData } from '../data/birthdayData';

export default function FinalScene({ onRestart }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [showBirthday, setShowBirthday] = useState(false);
  const [showClosing, setShowClosing] = useState(false);
  const [showFlowers, setShowFlowers] = useState(false);
  const { finale } = birthdayData;

  useEffect(() => {
    // Moon rise animation with GSAP
    gsap.fromTo(
      '.moon-element',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
    );

    gsap.fromTo(
      '.cloud-element',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 0.6, duration: 3, ease: 'power1.out', stagger: 0.5, delay: 1 }
    );
  }, []);

  const handleLineComplete = () => {
    if (lineIndex < finale.lines.length - 1) {
      setTimeout(() => setLineIndex((i) => i + 1), 1200);
    } else {
      setTimeout(() => {
        setShowFlowers(true);
        setTimeout(() => setShowBirthday(true), 800);
      }, 1500);
    }
  };

  useEffect(() => {
    if (showBirthday) {
      setTimeout(() => setShowClosing(true), 1500);
    }
  }, [showBirthday]);

  return (
    <SceneTransition className="bg-night overflow-hidden">
      <ParticleBackground variant="night" density={50} />

      {/* Stars overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-moonlight rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="moon-element absolute top-12 right-8 md:top-16 md:right-16 z-10">
        <motion.div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-moonlight shadow-glow relative"
          animate={{ boxShadow: ['0 0 20px rgba(245,230,255,0.3)', '0 0 40px rgba(245,230,255,0.5)', '0 0 20px rgba(245,230,255,0.3)'] }}
            transition={{ duration: 3, repeat: 0 }}
        >
          <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-lavender/20" />
          <div className="absolute bottom-3 right-4 w-2 h-2 rounded-full bg-lavender/15" />
        </motion.div>
      </div>

      {/* Clouds */}
      <div className="cloud-element absolute top-20 left-4 opacity-60">
        <Cloud />
      </div>
      <div className="cloud-element absolute top-32 right-1/4 opacity-40">
        <Cloud small />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-end h-full pb-8 px-4">
        {/* Messages */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 min-h-[30vh]">
          {lineIndex >= 0 && !showBirthday && (
            <motion.p
              key={lineIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-handwritten text-xl md:text-2xl text-moonlight/90 max-w-sm text-shadow-soft"
            >
              <TypewriterText
                text={finale.lines[lineIndex]}
                speed={40}
                onComplete={handleLineComplete}
              />
            </motion.p>
          )}

          {showBirthday && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.h1
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: 0 }}
                className="font-handwritten text-2xl md:text-4xl text-petal text-shadow-soft"
              >
                {finale.birthday}
              </motion.h1>

              {showClosing && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body text-sm md:text-base text-moonlight/70 max-w-xs leading-relaxed"
                >
                  {finale.closing}
                </motion.p>
              )}
            </motion.div>
          )}
        </div>

        {/* Bottom flowers blooming */}
        {showFlowers && (
          <div className="flex gap-3 mb-4">
            {['🌸', '🌷', '🌻', '🌹', '🌺'].map((f, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.2, type: 'spring' }}
                className="text-2xl"
              >
                {f}
              </motion.span>
            ))}
          </div>
        )}

        {/* Bunny sitting under moon */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mb-4"
        >
          <CuteBunny size={100} sitting showWave={false} />
        </motion.div>

        {/* Glowing particles at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-petal/40"
              style={{ left: `${i * 10 + 5}%`, bottom: `${Math.random() * 30}px` }}
              animate={{ opacity: [0, 0.8, 0], y: [0, -20, 0] }}
              transition={{
                duration: 3,
                repeat: 0,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Replay button */}
        {showClosing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95, rotate: -180 }}
            onClick={onRestart}
            className="mt-4 px-6 py-3 rounded-full bg-moonlight/10 border border-moonlight/20 text-moonlight/80 font-display text-sm backdrop-blur-sm active:scale-95 transition-transform min-h-[44px]"
          >
            {finale.replay}
          </motion.button>
        )}
      </div>
    </SceneTransition>
  );
}

function Cloud({ small = false }) {
  const s = small ? 0.6 : 1;
  return (
    <div className="flex items-center" style={{ transform: `scale(${s})` }}>
      <div className="w-10 h-6 bg-moonlight/15 rounded-full" />
      <div className="w-14 h-8 bg-moonlight/20 rounded-full -ml-4" />
      <div className="w-10 h-6 bg-moonlight/15 rounded-full -ml-4" />
    </div>
  );
}
