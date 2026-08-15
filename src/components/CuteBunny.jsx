import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CuteBunny({
  size = 160,
  onTap,
  showWave = true,
  sitting = false,
  className = '',
}) {
  const [blink, setBlink] = useState(false);
  const [reaction, setReaction] = useState(null);
  const [waveKey, setWaveKey] = useState(0);

  const handleTap = useCallback(() => {
    setReaction('happy');
    setWaveKey((k) => k + 1);
    setTimeout(() => setReaction(null), 800);
    onTap?.();
  }, [onTap]);

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      style={{ width: size, height: size * 1.1 }}
      onClick={handleTap}
      onKeyDown={(e) => e.key === 'Enter' && handleTap()}
      role="button"
      tabIndex={0}
      aria-label="Cute bunny"
      animate={
        reaction === 'happy'
          ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }
          : sitting
            ? { y: [0, -2, 0] }
            : { y: [0, -8, 0] }
      }
      transition={
        reaction === 'happy'
          ? { duration: 0.5 }
          : { duration: sitting ? 3 : 2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      {/* Ears */}
      <motion.div
        className="absolute left-[18%] top-0 w-[22%] h-[40%] bg-white rounded-[50%] border-2 border-petal/20 shadow-soft"
        style={{ transformOrigin: 'bottom center' }}
        animate={{ rotate: reaction === 'happy' ? [-8, 8, -8] : [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="absolute inset-[20%] bg-blush rounded-full opacity-60" />
      </motion.div>
      <motion.div
        className="absolute right-[18%] top-0 w-[22%] h-[40%] bg-white rounded-[50%] border-2 border-petal/20 shadow-soft"
        style={{ transformOrigin: 'bottom center' }}
        animate={{ rotate: reaction === 'happy' ? [8, -8, 8] : [3, -3, 3] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
      >
        <div className="absolute inset-[20%] bg-blush rounded-full opacity-60" />
      </motion.div>

      {/* Head */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[70%] h-[55%] bg-white rounded-[50%] border-2 border-petal/20 shadow-soft z-10">
        {/* Eyes */}
        <motion.div
          className="absolute top-[35%] left-[22%] w-[12%] h-[14%] bg-night rounded-full"
          animate={{ scaleY: blink ? 0.1 : 1 }}
          transition={{ duration: 0.1 }}
          onAnimationComplete={() => {
            if (blink) setTimeout(() => setBlink(false), 100);
          }}
        >
          <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] bg-white rounded-full" />
        </motion.div>
        <motion.div
          className="absolute top-[35%] right-[22%] w-[12%] h-[14%] bg-night rounded-full"
          animate={{ scaleY: blink ? 0.1 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <div className="absolute top-[15%] left-[20%] w-[35%] h-[35%] bg-white rounded-full" />
        </motion.div>

        {/* Blink timer */}
        <BlinkTimer onBlink={() => setBlink(true)} />

        {/* Nose */}
        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 w-[8%] h-[6%] bg-petal rounded-full" />

        {/* Mouth */}
        <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[12%] h-[8%] border-b-2 border-petal/60 rounded-b-full" />

        {/* Cheeks */}
        <div className="absolute top-[48%] left-[10%] w-[14%] h-[10%] bg-blush/50 rounded-full" />
        <div className="absolute top-[48%] right-[10%] w-[14%] h-[10%] bg-blush/50 rounded-full" />
      </div>

      {/* Body */}
      {!sitting && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[35%] bg-white rounded-[40%] border-2 border-petal/20 shadow-soft" />
      )}

      {/* Sitting body */}
      {sitting && (
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[50%] h-[30%] bg-white rounded-[45%] border-2 border-petal/20 shadow-soft" />
      )}

      {/* Wave paw */}
      {showWave && (
        <motion.div
          key={waveKey}
          className="absolute bottom-[15%] right-[5%] w-[18%] h-[22%] bg-white rounded-[50%] border-2 border-petal/20 shadow-soft z-20"
          style={{ transformOrigin: 'bottom left' }}
          animate={{ rotate: [0, -20, 0, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Reaction hearts */}
      {reaction === 'happy' && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute text-lg pointer-events-none"
              style={{ left: `${30 + i * 20}%`, top: '0%' }}
              initial={{ opacity: 1, y: 0, scale: 0 }}
              animate={{ opacity: 0, y: -40, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              💗
            </motion.span>
          ))}
        </>
      )}
    </motion.div>
  );
}

function BlinkTimer({ onBlink }) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) onBlink();
    }, 2500);
    return () => clearInterval(interval);
  }, [onBlink]);
  return null;
}
