import { useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ParticleBackground from '../components/ParticleBackground';
import SceneTransition from '../components/SceneTransition';
import TypewriterText from '../components/TypewriterText';
import { birthdayData } from '../data/birthdayData';

export default function IntroScene({ onNext }) {
  const [phase, setPhase] = useState(0);
  const [burst, setBurst] = useState(null);
  const [clicked, setClicked] = useState(false);
  const { intro } = birthdayData;

  const handleClick = (e) => {
    if (clicked) return;
    setClicked(true);

    setBurst({ key: Date.now() });

    gsap.to('.intro-content', {
      scale: 1.1,
      rotation: 5,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'elastic.out(1, 0.5)',
      onComplete: () => {
        setTimeout(onNext, 400);
      },
    });
  };

  return (
    <SceneTransition className="bg-gradient-to-b from-blush via-cream to-lavender/30">
      <ParticleBackground variant="day" density={35} burst={burst} />

      <div className="intro-content relative z-10 flex flex-col items-center text-center gap-6 max-w-sm">
        {phase >= 0 && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-handwritten text-4xl md:text-5xl text-softpurple text-shadow-soft"
          >
            <TypewriterText
              text={intro.whisper}
              speed={60}
              onComplete={() => setTimeout(() => setPhase(1), 400)}
            />
          </motion.h1>
        )}

        {phase >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-lg text-night/60"
          >
            <TypewriterText
              text={intro.teaser}
              speed={40}
              delay={200}
              onComplete={() => setTimeout(() => setPhase(2), 300)}
            />
          </motion.p>
        )}

        {phase >= 2 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
            whileTap={{ scale: 0.9, rotate: 10 }}
            onClick={handleClick}
            disabled={clicked}
            className="cute-button mt-4"
          >
            {intro.buttonText}
          </motion.button>
        )}
      </div>
    </SceneTransition>
  );
}
