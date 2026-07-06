'use client';
import Link from 'next/link';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { copy } from '@/copy/strings';
import { BookOpen, Laptop, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  modes: string[];
}

const modeConfig: Record<string, { icon: typeof BookOpen; color: string; label: string }> = {
  study:     { icon: BookOpen,  color: '#8FB37A', label: 'Study' },
  hackathon: { icon: Laptop,    color: '#E8B34A', label: 'Hackathon' },
  gym:       { icon: Dumbbell,  color: '#FF6A2E', label: 'Gym' },
  twinn:     { icon: Sparkles,  color: '#A78BFA', label: 'Twinn' },
};

export function StepQuizStart({ modes }: Props) {
  const safeModes = modes ?? [];

  return (
    <div className="space-y-8 text-center">
      <div>
        <h1 className="display-md mb-3" style={{ color: 'var(--bone-100)' }}>{copy.onboarding.step6.title}</h1>
        <p className="body" style={{ color: 'var(--bone-400)' }}>{copy.onboarding.step6.description}</p>
      </div>

      <div className="space-y-3">
        {safeModes.map((mode) => {
          const cfg = modeConfig[mode];
          if (!cfg) return null;
          const Icon = cfg.icon;
          return (
            <Link key={mode} href={`/join/quiz/${mode}`}>
              <div
                className="quiz-mode-link flex items-center gap-4 p-4 rounded-xl cursor-pointer"
                style={{
                  background: 'var(--ink-700)',
                  border: '1px solid var(--border-default)',
                  transition: 'all 240ms cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}40` }}
                >
                  <Icon className="w-5 h-5" style={{ color: cfg.color }} aria-hidden="true" />
                </div>
                <div className="flex-1 text-left">
                  <p className="body font-medium" style={{ color: 'var(--bone-100)' }}>{cfg.label} quiz</p>
                  <p className="body-sm" style={{ color: 'var(--bone-500)' }}>8 questions · ~2 min</p>
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: 'var(--bone-500)' }} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>

      <Link href="/discover/study">
        <MagneticButton className="btn-ghost w-full" aria-label="Skip quizzes and go to discover">
          skip for now — I'll do this later
        </MagneticButton>
      </Link>
    </div>
  );
}
