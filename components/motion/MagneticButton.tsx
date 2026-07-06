'use client';
import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  id?: string;
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ...props
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = 60;
    if (dist < radius) {
      const strength = (radius - dist) / radius;
      setPos({ x: dx * strength * 0.4, y: dy * strength * 0.4 });
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      aria-label={props['aria-label']}
      id={props.id}
    >
      <motion.span
        className="inline-flex items-center justify-center gap-[inherit] w-full h-full"
        animate={{ x: -pos.x * 0.4, y: -pos.y * 0.4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
