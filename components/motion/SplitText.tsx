'use client';
import { motion } from 'framer-motion';
import { ease, duration } from '@/lib/motion/tokens';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: 'word' | 'char';
}

export function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  splitBy = 'word',
}: Props) {
  const units = splitBy === 'word' ? text.split(' ') : text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden:  { y: '110%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: duration.slow, ease: ease.out },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${splitBy === 'word' ? 'gap-x-[0.25em]' : ''} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {units.map((unit, i) => (
        // Padding gives breathing room for ascenders/descenders so they
        // aren't clipped by overflow:hidden at tight line-heights (0.96).
        // The negative margin cancels out the visual spacing shift.
        <span
          key={i}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            paddingTop: '0.16em',
            paddingBottom: '0.16em',
            paddingLeft: '0.15em',
            paddingRight: '0.15em',
            marginTop: '-0.16em',
            marginBottom: '-0.16em',
            marginLeft: '-0.15em',
            marginRight: '-0.15em',
            verticalAlign: 'bottom',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            variants={itemVariants}
          >
            {unit}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
