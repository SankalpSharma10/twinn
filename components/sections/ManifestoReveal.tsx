'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { copy } from '@/copy/strings';
import { ease, duration } from '@/lib/motion/tokens';

export function ManifestoReveal() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  return (
    <section
      ref={ref}
      className="py-40 px-6 md:px-12 text-center"
      aria-label="Manifesto"
      id="manifesto-section"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {copy.manifesto.map((line, i) => (
          <motion.p
            key={i}
            className="display-md text-bone-100"
            initial={{ opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }}
            animate={inView ? {
              opacity: 1,
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
            } : {}}
            transition={{
              duration: duration.slow,
              ease: ease.out,
              delay: i * 0.18,
            }}
            style={
              i === copy.manifesto.length - 1
                ? { color: 'var(--ember-500)' }
                : {}
            }
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
