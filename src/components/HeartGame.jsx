import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_HEARTS = 5;

function randomPosition() {
  return {
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 60,
  };
}

export default function HeartGame({ instruction, unlockedMessage, onComplete }) {
  const [collected, setCollected] = useState(0);
  const [hearts, setHearts] = useState(() =>
    Array.from({ length: TOTAL_HEARTS }, (_, i) => ({ id: i, ...randomPosition(), alive: true }))
  );
  const [unlocked, setUnlocked] = useState(false);
  const canvasRef = useRef(null);

  const spawnParticleBurst = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const px = (x / 100) * rect.width;
    const py = (y / 100) * rect.height;
    const particles = [];

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 2 + Math.random() * 3,
        color: ['#FFB7C5', '#D4BBFF', '#FFD166'][Math.floor(Math.random() * 3)],
      });
    }

    let frame;
    const start = performance.now();

    const animate = (now) => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const elapsed = now - start;
      let alive = false;

      particles.forEach((p) => {
        p.life = 1 - elapsed / 600;
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (alive) frame = requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleHeartClick = useCallback(
    (heart) => {
      if (!heart.alive || unlocked) return;

      spawnParticleBurst(heart.x, heart.y);
      setHearts((prev) =>
        prev.map((h) => (h.id === heart.id ? { ...h, alive: false } : h))
      );

      const next = collected + 1;
      setCollected(next);

      if (next >= TOTAL_HEARTS) {
        setUnlocked(true);
        setTimeout(() => onComplete?.(), 2500);
      }
    },
    [collected, unlocked, onComplete, spawnParticleBurst]
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        aria-hidden="true"
      />

      {!unlocked ? (
        <>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-handwritten text-xl md:text-2xl text-softpurple text-center mb-4 px-4 text-shadow-soft z-10"
          >
            {instruction}
          </motion.p>

          <motion.div
            className="font-display text-2xl text-petal mb-6 z-10"
            key={collected}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            {collected} / {TOTAL_HEARTS} ❤️
          </motion.div>

          <div className="absolute inset-0 z-10">
            <AnimatePresence>
              {hearts
                .filter((h) => h.alive)
                .map((heart) => (
                  <motion.button
                    key={heart.id}
                    className="absolute text-3xl md:text-4xl cursor-pointer touch-manipulation select-none"
                    style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.15, 1],
                      y: [0, -8, 0],
                      opacity: 1,
                    }}
                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                    transition={{
                      scale: { duration: 1.5, repeat: 0 },
                      y: { duration: 2, repeat: 0, ease: 'easeInOut' },
                      exit: { duration: 0.4 },
                    }}
                    whileTap={{ scale: 1.5 }}
                    onClick={() => handleHeartClick(heart)}
                    aria-label="Catch heart"
                  >
                    💗
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center z-30"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <p className="font-handwritten text-3xl text-petal text-shadow-soft">
            {unlockedMessage}
          </p>

          {/* Celebration particles */}
          <CelebrationBurst />
        </motion.div>
      )}
    </div>
  );
}

function CelebrationBurst() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ['#FFB7C5', '#D4BBFF', '#FFD166', '#E8D5F2'];
    const particles = Array.from({ length: 60 }, () => ({
      x: rect.width / 2,
      y: rect.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 5,
      life: 1,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let frame;
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = false;
      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 0.008;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      if (alive) frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40"
      aria-hidden="true"
    />
  );
}
