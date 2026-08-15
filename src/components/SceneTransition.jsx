import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(8px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SceneTransition({ children, className = '' }) {
  return (
    <motion.div
      className={`scene-container ${className}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export function CinematicTransition({ children, direction = 'up' }) {
  const y = direction === 'up' ? 60 : direction === 'down' ? -60 : 0;
  const x = direction === 'left' ? 60 : direction === 'right' ? -60 : 0;

  return (
    <motion.div
      className="scene-container"
      initial={{ opacity: 0, y, x, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      }}
      exit={{
        opacity: 0,
        y: -y,
        x: -x,
        scale: 1.1,
        transition: { duration: 0.6 },
      }}
    >
      {children}
    </motion.div>
  );
}
