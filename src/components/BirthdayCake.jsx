import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BirthdayCake({ candleCount = 5, onAllBlown, onCelebrate }) {
  const [blownCandles, setBlownCandles] = useState(new Set());
  const [allDone, setAllDone] = useState(false);
  const [showSmoke, setShowSmoke] = useState([]);

  const handleCandleClick = useCallback(
    (index) => {
      if (blownCandles.has(index) || allDone) return;

      const next = new Set(blownCandles);
      next.add(index);
      setBlownCandles(next);
      setShowSmoke((prev) => [...prev, index]);

      if (next.size === candleCount) {
        setAllDone(true);
        onCelebrate?.();
        playCelebrationSound();
        setTimeout(() => onAllBlown?.(), 1500);
      }
    },
    [blownCandles, allDone, candleCount, onAllBlown, onCelebrate]
  );

  const candlePositions = Array.from({ length: candleCount }, (_, i) => {
    const spread = candleCount > 1 ? 60 / (candleCount - 1) : 0;
    const start = 50 - 60 / 2;
    return start + i * spread;
  });

  return (
    <div className="relative">
      <ConfettiOverlay active={allDone} />

      <motion.div
        animate={allDone ? { y: [0, -6, 0, -4, 0] } : {}}
        transition={{ duration: 0.6, repeat: allDone ? Infinity : 0, repeatDelay: 1 }}
        className="relative"
      >
        <div className="flex justify-center gap-2 mb-1 relative z-10">
          {candlePositions.map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <AnimatePresence>
                {!blownCandles.has(i) && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: [0, -2, 0] }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      y: { duration: 0.5, repeat: Infinity },
                      exit: { duration: 0.3 },
                    }}
                    onClick={() => handleCandleClick(i)}
                    className="w-8 h-10 flex items-end justify-center cursor-pointer touch-manipulation"
                    aria-label={`Blow out candle ${i + 1}`}
                  >
                    <motion.div
                      className="w-4 h-5 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 40% 30%, #FFD166, #FF9EB5, #FF6B6B)',
                        boxShadow: '0 0 12px rgba(255, 158, 181, 0.8)',
                      }}
                      animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
                      transition={{ duration: 0.4, repeat: Infinity }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>

              {showSmoke.includes(i) && blownCandles.has(i) && (
                <motion.div
                  className="absolute -top-2 text-gray-300 text-xs"
                  initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                  animate={{ opacity: 0, y: -20, scale: 1.5 }}
                  transition={{ duration: 1.5 }}
                >
                  💨
                </motion.div>
              )}

              <div className="w-1 h-6 bg-amber-800/60 rounded-full" />
            </div>
          ))}
        </div>

        <div className="relative mx-auto w-48 h-8 bg-blush rounded-t-3xl border-2 border-petal/30 shadow-soft">
          <div className="absolute -top-2 left-2 w-4 h-4 bg-white rounded-full opacity-80" />
          <div className="absolute -top-1 left-1/3 w-3 h-3 bg-white rounded-full opacity-70" />
          <div className="absolute -top-2 right-4 w-5 h-5 bg-white rounded-full opacity-80" />
        </div>

        <div className="relative mx-auto w-52 h-10 bg-lavender rounded-lg border-2 border-softpurple/20 shadow-soft -mt-1">
          <div className="absolute inset-x-4 top-2 flex gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-petal/40" />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-56 h-12 bg-softpurple/30 rounded-b-2xl border-2 border-softpurple/20 shadow-soft -mt-1">
          <div className="absolute bottom-2 inset-x-6 flex justify-between">
            {['💗', '✨', '💗', '✨'].map((e, i) => (
              <span key={i} className="text-xs opacity-70">
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto w-64 h-3 bg-white/80 rounded-full shadow-soft mt-1 border border-lavender/30" />
      </motion.div>
    </div>
  );
}

function ConfettiOverlay({ active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ['#FFB7C5', '#D4BBFF', '#FFD166', '#E8D5F2', '#FF9EB5'];
    const particles = [];
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        life: 1,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
      });
    }

    for (let i = 0; i < 20; i++) {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 1.2,
        size: 8 + Math.random() * 6,
        color: 'heart',
        rot: 0,
        rotV: 0,
      });
    }

    let frame;
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      let alive = false;

      particles.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life -= 0.012;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        if (p.color === 'heart') {
          drawMiniHeart(ctx, p.x, p.y, p.size * p.life);
        } else {
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });

      if (alive) frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}

function drawMiniHeart(ctx, x, y, size) {
  ctx.fillStyle = '#FFB7C5';
  ctx.beginPath();
  const s = size * 0.3;
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y - s, x - s, y - s, x - s, y);
  ctx.bezierCurveTo(x - s, y + s, x, y + s * 1.5, x, y + s * 1.8);
  ctx.bezierCurveTo(x, y + s * 1.5, x + s, y + s, x + s, y);
  ctx.bezierCurveTo(x + s, y - s, x, y - s, x, y + s * 0.3);
  ctx.fill();
}

function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch {
    // Audio not available
  }
}
