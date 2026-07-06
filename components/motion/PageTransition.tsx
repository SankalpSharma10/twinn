'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

interface Props {
  children: React.ReactNode;
}

export function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence
      // "popLayout" immediately shows the entering page without waiting
      // for the exit animation to finish — eliminates the hang on nav.
      mode="popLayout"
      initial={false}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
        transition={{
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
