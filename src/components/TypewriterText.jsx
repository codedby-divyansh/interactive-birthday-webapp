import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
  showCursor = true,
}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      setDone(true);
      onComplete?.();
      return;
    }

    let i = 0;
    let timeout;

    const startTyping = () => {
      timeout = setTimeout(function tick() {
        i++;
        setDisplayed(text.slice(0, i));
        if (i < text.length) {
          timeout = setTimeout(tick, speed);
        } else {
          setDone(true);
          onComplete?.();
        }
      }, speed);
    };

    const delayTimeout = setTimeout(startTyping, delay);
    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(timeout);
    };
  }, [text, speed, delay, onComplete, reducedMotion]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-[1em] bg-petal ml-0.5 align-middle"
        />
      )}
    </span>
  );
}
