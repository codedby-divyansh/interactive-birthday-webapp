import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FlowerGarden({ flowers, title, onAllVisited }) {
  const [visited, setVisited] = useState(new Set());
  const [activeFlower, setActiveFlower] = useState(null);

  const handleFlowerClick = (flower) => {
    setActiveFlower(flower);
    const next = new Set(visited);
    next.add(flower.id);
    setVisited(next);
    if (next.size === flowers.length) {
      setTimeout(() => onAllVisited?.(), 500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-handwritten text-2xl md:text-3xl text-softpurple mb-8 text-shadow-soft"
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-2 gap-6 px-4">
        {flowers.map((flower, i) => (
          <motion.button
            key={flower.id}
            initial={{ scale: 0, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleFlowerClick(flower)}
            className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-cream/60 border-2 border-lavender/30 shadow-soft touch-manipulation min-h-[120px] active:shadow-glow transition-shadow"
            aria-label={`Open ${flower.label} flower`}
          >
            {/* Stem grows in */}
            <motion.div
              className="relative flex flex-col items-center"
              animate={visited.has(flower.id) ? { scale: [1, 1.2, 1.1] } : {}}
            >
              <motion.span
                className="text-4xl md:text-5xl"
                animate={{
                  rotate: visited.has(flower.id) ? [0, -10, 10, 0] : [0, -5, 5, 0],
                  scale: visited.has(flower.id) ? 1.15 : 1,
                }}
                transition={{ duration: 2, repeat: 0, repeatDelay: 1 }}
              >
                {flower.emoji}
              </motion.span>

              {/* Growing stem */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 24 + i * 4 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="w-1 bg-green-300/60 rounded-full mt-1"
              />

              {/* Leaves */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="absolute bottom-0 -left-3 w-3 h-2 bg-green-300/50 rounded-full rotate-[-30deg]"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="absolute bottom-1 -right-3 w-3 h-2 bg-green-300/50 rounded-full rotate-[30deg]"
              />
            </motion.div>

            <span
              className="text-xs font-display font-semibold tracking-wider"
              style={{ color: flower.color }}
            >
              {flower.label}
            </span>

            {visited.has(flower.id) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs text-petal"
              >
                ✓ bloomed
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Flower modal */}
      <AnimatePresence>
        {activeFlower && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveFlower(null)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveFlower(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-lavender/30 flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-softpurple" />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                className="text-5xl text-center mb-3"
              >
                {activeFlower.emoji}
              </motion.div>

              <h3
                className="font-handwritten text-2xl text-center mb-3"
                style={{ color: activeFlower.color }}
              >
                {activeFlower.title}
              </h3>

              <p className="font-body text-sm text-night/70 leading-relaxed text-center">
                {activeFlower.content}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
