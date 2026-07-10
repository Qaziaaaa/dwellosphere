import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isInView, end, duration]);

  return { count, setIsInView };
}
