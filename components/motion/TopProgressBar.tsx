'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  loading: boolean;
}

export function TopProgressBar({ loading }: Props) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          aria-label="Loading"
          role="progressbar"
          className="fixed top-0 left-0 right-0 h-[2px] bg-ember-500 z-[9999] origin-left"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
