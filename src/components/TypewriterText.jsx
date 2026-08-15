import { useState, useEffect, useRef } from 'react';
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
  const onCompleteRef = useRef(onComplete);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    if (reducedMotion) {
      setDisplayed(text);
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    let i = 0;
    let timeoutId;
    let startedId;

    const tick = () => {
      i += 1;
      setDisplayed(text.slice(0, i));

      if (i < text.length) {
        timeoutId = setTimeout(tick, speed);
      } else {
        setDone(true);
        onCompleteRef.current?.();
      }
    };

    startedId = setTimeout(tick, delay + speed);

    return () => {
      clearTimeout(startedId);
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, reducedMotion]);

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
