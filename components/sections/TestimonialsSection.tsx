'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ease, duration } from '@/lib/motion/tokens';

const testimonials = [
  {
    name: 'Priya N.',
    campus: 'UC Berkeley',
    year: "'26",
    major: 'Pre-Med',
    mode: 'Study',
    quote: "Found my orgo study group in literally 48 hours. We've been meeting every Sunday since October. I would not have survived midterms without these people.",
    modeColor: '#8FB37A',
  },
  {
    name: 'Ben G.',
    campus: 'MIT',
    year: "'25",
    major: 'Physics',
    mode: 'Hackathon',
    quote: 'Matched with a designer and a PM two weeks before HackMIT. We shipped something actually good. The compatibility score was 87% and honestly that checks out.',
    modeColor: '#E8B34A',
  },
  {
    name: 'Jordan K.',
    campus: 'UC Berkeley',
    year: "'27",
    major: 'Electrical Eng',
    mode: 'Gym',
    quote: 'I was going to skip leg day. My match texted me at 6:45am. I went. That was three months ago. We go six days a week now. I don\'t know if that\'s healthy but here we are.',
    modeColor: '#FF6A2E',
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      ref={ref}
      className="py-32 px-6 md:px-12"
      aria-label="Testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="caption text-ember-500 mb-4 tracking-widest">EARLY ACCESS</p>
          <h2 className="display-lg text-bone-100">the ones who showed up.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="card p-8"
              style={{ marginTop: i === 1 ? 32 : i === 2 ? 16 : 0 }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: duration.base, ease: ease.out, delay: i * 0.12 }}
            >
              {/* Mode badge */}
              <div
                className="chip mb-6 inline-flex"
                style={{
                  color: t.modeColor,
                  borderColor: `${t.modeColor}40`,
                  background: `${t.modeColor}12`,
                }}
              >
                {t.mode} mode
              </div>

              {/* Quote */}
              <blockquote className="display-md text-bone-100 italic mb-8 leading-snug" style={{ fontVariationSettings: "'opsz' 72, 'SOFT' 100, 'wght' 300", fontFamily: 'Fraunces, serif' }}>
                "{t.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: `${t.modeColor}20`, color: t.modeColor }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-bone-200">{t.name}, {t.year}</p>
                  <p className="text-body-sm text-bone-500">{t.major} · {t.campus}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
