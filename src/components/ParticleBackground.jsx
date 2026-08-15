import { useEffect, useRef } from 'react';

const PARTICLE_TYPES = ['star', 'heart', 'sparkle', 'petal'];

function createParticle(width, height, type) {
  const t = type || PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: t === 'petal' ? 8 + Math.random() * 6 : 3 + Math.random() * 5,
    speedX: (Math.random() - 0.5) * 0.6,
    speedY: t === 'petal' ? 0.4 + Math.random() * 0.8 : (Math.random() - 0.5) * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
    opacity: 0.3 + Math.random() * 0.5,
    type: t,
    wobble: Math.random() * Math.PI * 2,
  };
}

function drawStar(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * size;
    const py = y + Math.sin(angle) * size;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHeart(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#FFB7C5';
  ctx.beginPath();
  const s = size * 0.5;
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y - s * 0.5, x - s, y - s * 0.5, x - s, y + s * 0.1);
  ctx.bezierCurveTo(x - s, y + s * 0.7, x, y + s, x, y + s * 1.2);
  ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.7, x + s, y + s * 0.1);
  ctx.bezierCurveTo(x + s, y - s * 0.5, x, y - s * 0.5, x, y + s * 0.3);
  ctx.fill();
  ctx.restore();
}

function drawSparkle(ctx, x, y, size, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = '#D4BBFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.moveTo(x - size * 0.6, y - size * 0.6);
  ctx.lineTo(x + size * 0.6, y + size * 0.6);
  ctx.moveTo(x + size * 0.6, y - size * 0.6);
  ctx.lineTo(x - size * 0.6, y + size * 0.6);
  ctx.stroke();
  ctx.restore();
}

function drawPetal(ctx, x, y, size, rotation, opacity) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = opacity;
  ctx.fillStyle = '#FFB7C5';
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.4, size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function ParticleBackground({
  variant = 'day',
  density = 40,
  burst = null,
  className = '',
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const burstRef = useRef([]);
  const frameRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (burst) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cx = burst.x != null ? burst.x : rect.width / 2;
      const cy = burst.y != null ? burst.y : rect.height / 2;
      for (let i = 0; i < 30; i++) {
        burstRef.current.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 2,
          life: 1,
          size: 3 + Math.random() * 5,
          color: ['#FFB7C5', '#D4BBFF', '#FFD166', '#E8D5F2'][
            Math.floor(Math.random() * 4)
          ],
        });
      }
    }
  }, [burst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(density, Math.floor((width * height) / 12000));
      particlesRef.current = Array.from({ length: count }, () =>
        createParticle(width, height)
      );
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (variant === 'night') {
        ctx.fillStyle = '#1a1033';
        ctx.fillRect(0, 0, width, height);
      }

      if (!reducedMotion.current) {
        particlesRef.current.forEach((p) => {
          p.wobble += 0.02;
          p.x += p.speedX + Math.sin(p.wobble) * 0.2;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;

          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          const twinkle = 0.5 + Math.sin(p.wobble * 2) * 0.3;

          switch (p.type) {
            case 'star':
              drawStar(ctx, p.x, p.y, p.size, p.opacity * twinkle);
              break;
            case 'heart':
              drawHeart(ctx, p.x, p.y, p.size, p.opacity * twinkle);
              break;
            case 'sparkle':
              drawSparkle(ctx, p.x, p.y, p.size, p.opacity * twinkle);
              break;
            case 'petal':
              drawPetal(ctx, p.x, p.y, p.size, p.rotation, p.opacity);
              break;
            default:
              break;
          }
        });

        burstRef.current = burstRef.current.filter((b) => {
          b.x += b.vx;
          b.y += b.vy;
          b.vy += 0.15;
          b.life -= 0.025;
          if (b.life <= 0) return false;
          ctx.save();
          ctx.globalAlpha = b.life;
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return true;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [variant, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

export function triggerConfetti(canvas) {
  if (!canvas) return [];
  const particles = [];
  const rect = canvas.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const colors = ['#FFB7C5', '#D4BBFF', '#FFD166', '#E8D5F2', '#FF9EB5'];

  for (let i = 0; i < 80; i++) {
    const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.5;
    const speed = 3 + Math.random() * 6;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      life: 1,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
    });
  }
  return particles;
}
