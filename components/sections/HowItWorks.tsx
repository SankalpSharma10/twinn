'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ease, duration } from '@/lib/motion/tokens';
import { CheckCircle, Mail, Sliders, Zap } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Mail,
    title: 'verify with your .edu',
    body: 'One OTP. We check the domain, not the GPA.',
    color: '#8FB37A',
  },
  {
    num: '02',
    icon: Sliders,
    title: 'tell us what you\'re chasing',
    body: 'Study sessions, hackathons, or gym days. Pick one, pick all three.',
    color: '#E8B34A',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'take the vibe check',
    body: 'Eight quick questions per mode. Not a personality test — a compatibility filter.',
    color: '#FF9E5B',
  },
  {
    num: '04',
    icon: Zap,
    title: 'swipe. match. show up.',
    body: 'Real matches based on actual habits. Then get off the app and go meet them.',
    color: '#FF6A2E',
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="py-32 px-6 md:px-12"
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="caption text-ember-500 mb-4 tracking-widest">HOW IT WORKS</p>
          <h2 className="display-lg text-bone-100">four steps. zero randoms.</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                className="card p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: duration.base, ease: ease.out, delay: i * 0.1 }}
              >
                {/* Step number bg */}
                <div
                  className="absolute top-4 right-4 text-6xl font-display font-bold opacity-[0.06] leading-none select-none"
                  style={{ color: step.color }}
                  aria-hidden="true"
                >
                  {step.num}
                </div>

                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-6"
                  style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: step.color }} aria-hidden="true" />
                </div>

                <h3 className="text-h2 font-display text-bone-100 mb-3">{step.title}</h3>
                <p className="text-body text-bone-400">{step.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
