import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterText from './TypewriterText';

export default function Envelope({ prompt, message, onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [letterDone, setLetterDone] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => setShowLetter(true), 600);
    onOpen?.();
  };

  return (
    <div className="relative flex flex-col items-center">
      {!isOpen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-handwritten text-2xl text-softpurple mb-8 text-shadow-soft"
        >
          {prompt}
        </motion.p>
      )}

      {/* Floating hearts around letter */}
      {showLetter &&
        [...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-sm pointer-events-none"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            💗
          </motion.span>
        ))}

      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.button
            key="envelope"
            onClick={handleOpen}
            className="relative cursor-pointer touch-manipulation"
            whileTap={{ scale: 0.95 }}
            aria-label="Open letter"
          >
            {/* Envelope body */}
            <motion.div
              className="relative w-56 h-36 md:w-64 md:h-40"
              animate={isOpen ? { y: 20, opacity: 0.5 } : { y: [0, -4, 0] }}
              transition={
                isOpen
                  ? { duration: 0.5 }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              {/* Back */}
              <div className="absolute inset-0 bg-blush rounded-2xl border-2 border-petal/30 shadow-soft" />

              {/* Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-20 origin-top"
                style={{
                  clipPath: 'polygon(0 0, 50% 70%, 100% 0)',
                  background: '#FFD4E0',
                  borderRadius: '1rem 1rem 0 0',
                }}
                animate={isOpen ? { rotateX: 180, y: -10 } : { rotateX: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />

              {/* Front pocket */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 bg-petal/40 rounded-b-2xl"
                style={{ clipPath: 'polygon(0 30%, 50% 0, 100% 30%, 100% 100%, 0 100%)' }}
              />

              {/* Heart seal */}
              <motion.div
                className="absolute top-[38%] left-1/2 -translate-x-1/2 text-2xl z-10"
                animate={isOpen ? { scale: 0, opacity: 0 } : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💌
              </motion.div>

              {!isOpen && (
                <motion.p
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-softpurple/70 whitespace-nowrap font-body"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  tap to open
                </motion.p>
              )}
            </motion.div>
          </motion.button>
        ) : (
          <motion.div
            key="letter"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-72 md:w-80 max-h-[50vh] overflow-y-auto"
          >
            {/* Paper */}
            <div className="bg-cream rounded-lg p-6 shadow-soft border border-lavender/30 relative">
              {/* Paper lines */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-4 right-4 h-px bg-lavender/20"
                  style={{ top: `${20 + i * 28}px` }}
                />
              ))}

              <div className="relative z-10 font-handwritten text-lg md:text-xl text-night/80 leading-relaxed whitespace-pre-line">
                <TypewriterText
                  text={message}
                  speed={30}
                  onComplete={() => setLetterDone(true)}
                />
              </div>
            </div>

            {letterDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <span className="text-2xl">💗</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
