'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { BookOpen, Laptop, Dumbbell, Sparkles, Check } from 'lucide-react';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
}

const modes = [
  {
    id: 'study',
    icon: BookOpen,
    label: copy.modes.study.label,
    tag:   copy.modes.study.tag,
    tagline: copy.modes.study.tagline,
    color: '#8FB37A',
    desc: 'Find study partners matched by class, schedule, and vibe.',
  },
  {
    id: 'hackathon',
    icon: Laptop,
    label: copy.modes.hackathon.label,
    tag:   copy.modes.hackathon.tag,
    tagline: copy.modes.hackathon.tagline,
    color: '#E8B34A',
    desc: 'Build teams matched by role, stack, and what you want to get out of it.',
  },
  {
    id: 'gym',
    icon: Dumbbell,
    label: copy.modes.gym.label,
    tag:   copy.modes.gym.tag,
    tagline: copy.modes.gym.tagline,
    color: '#FF6A2E',
    desc: 'Find a training partner matched by style, schedule, and goals.',
  },
  {
    id: 'twinn',
    icon: Sparkles,
    label: copy.modes.twinn.label,
    tag:   copy.modes.twinn.tag,
    tagline: copy.modes.twinn.tagline,
    color: '#A78BFA',
    desc: 'Find your person at JIIT — matched on personality, music taste, and the little things.',
  },
];

export function StepModes({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError]       = useState('');

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) { setError(copy.errors.mode_required); return; }
    onNext({ modes: selected });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <h1 className="display-md mb-3" style={{ color: 'var(--bone-100)' }}>{copy.onboarding.step5.title}</h1>
        <p className="body" style={{ color: 'var(--bone-400)' }}>{copy.onboarding.step5.description}</p>
      </div>

      <div className="space-y-3">
        {modes.map((m) => {
          const Icon = m.icon;
          const isOn = selected.includes(m.id);

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggle(m.id)}
              aria-pressed={isOn}
              className="w-full text-left rounded-xl p-5 transition-all"
              style={{
                background: isOn ? `${m.color}10` : 'var(--ink-700)',
                border: `1px solid ${isOn ? m.color : 'var(--border-default)'}`,
                boxShadow: isOn ? `0 0 0 1px ${m.color}30, 0 8px 24px -8px ${m.color}25` : 'none',
                transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${m.color}20`, border: `1px solid ${m.color}40` }}
                >
                  <Icon className="w-5 h-5" style={{ color: m.color }} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="body font-semibold" style={{ color: 'var(--bone-100)' }}>{m.label}</span>
                    <span className="caption" style={{ color: m.color, letterSpacing: '0.1em' }}>{m.tag}</span>
                  </div>
                  <p className="body-sm" style={{ color: 'var(--bone-400)' }}>{m.desc}</p>
                </div>
                <AnimatePresence>
                  {isOn && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: m.color }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: 'var(--ink-900)' }} aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p role="alert" className="body-sm" style={{ color: 'var(--error)' }}>{error}</p>}

      <MagneticButton type="submit" className="btn-primary w-full" aria-label="Continue to Spotify">
        {copy.onboarding.step5.cta}
      </MagneticButton>
    </form>
  );
}
