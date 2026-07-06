'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

type CursorState = 'default' | 'hover' | 'link' | 'swipe-left' | 'swipe-right';

export function MagneticCursor() {
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotX = useSpring(mouseX, { stiffness: 600, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 600, damping: 40 });
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const ringY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!visible) setVisible(true);
  }, [mouseX, mouseY, visible]);

  const onMouseLeave = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mq.matches);
    if (!mq.matches) return;

    window.addEventListener('mousemove', onMouseMove);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a, [data-cursor="link"]')) setState('link');
      else if (el.closest('button, [role="button"], [data-cursor="hover"]')) setState('hover');
      else setState('default');
    };

    window.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [onMouseMove, onMouseLeave]);

  if (!isPointerFine) return null;

  const ringSize = state === 'hover' ? 64 : state === 'link' ? 48 : 32;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9998] rounded-full bg-ember-500 mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Outer ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[9997] rounded-full border border-bone-300"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: state === 'hover' ? 'rgba(255,106,46,0.12)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    </>
  );
}
