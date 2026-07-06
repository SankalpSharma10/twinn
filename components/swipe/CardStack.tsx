'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard, Profile } from './SwipeCard';
import { MatchCelebration } from '@/components/three/ParticleSystem';
import { copy } from '@/copy/strings';
import { X, ArrowRight, Star } from 'lucide-react';

interface Props {
  profiles: Profile[];
  onSwipe: (profileId: string, decision: 'like' | 'pass' | 'super') => Promise<{ matched: boolean }>;
  mode: 'study' | 'hackathon' | 'gym';
}

export function CardStack({ profiles: initialProfiles, onSwipe, mode }: Props) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [matchData, setMatchData] = useState<{ name: string; line: string } | null>(null);

  const handleSwipe = useCallback(async (decision: 'like' | 'pass' | 'super') => {
    if (profiles.length === 0) return;
    const current = profiles[0];

    setProfiles((prev) => prev.slice(1));

    try {
      const result = await onSwipe(current.id, decision);
      if (result.matched && decision !== 'pass') {
        const line = copy.matchLines[Math.floor(Math.random() * copy.matchLines.length)];
        setMatchData({ name: current.display_name, line });
      }
    } catch {}
  }, [profiles, onSwipe]);

  const dismissMatch = useCallback(() => setMatchData(null), []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  handleSwipe('pass');
    if (e.key === 'ArrowRight') handleSwipe('like');
    if (e.key === 'ArrowUp')    handleSwipe('super');
  }, [handleSwipe]);

  const visible = profiles.slice(0, 3);

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <p className="display-md text-bone-200 mb-6">
          you've seen everyone
        </p>
        <p className="body-lg text-bone-400">
          {copy.empty.discover[mode]}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center h-full" onKeyDown={handleKeyDown} tabIndex={0}
      role="region" aria-label={`${mode} mode swipe interface`}>
      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[70vh] mx-auto">
        <AnimatePresence>
          {visible.map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              isTop={index === 0}
              stackIndex={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe('pass')}
          className="w-16 h-16 rounded-full flex items-center justify-center border border-bone-300/20 bg-ink-700 hover:border-bone-300/40 hover:bg-ink-600 transition-all duration-quick"
          aria-label="Pass"
          id="btn-pass"
        >
          <X className="w-6 h-6 text-bone-400" />
        </button>

        <button
          onClick={() => handleSwipe('super')}
          className="w-12 h-12 rounded-full flex items-center justify-center border border-ember-500/30 bg-ink-700 hover:border-ember-500/60 hover:bg-ink-600 transition-all duration-quick"
          aria-label="Super like"
          id="btn-super"
        >
          <Star className="w-5 h-5 text-ember-400" />
        </button>

        <button
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full flex items-center justify-center bg-ember-500 hover:bg-ember-400 transition-all duration-quick"
          style={{ boxShadow: 'var(--shadow-ember)' }}
          aria-label="Like"
          id="btn-like"
        >
          <ArrowRight className="w-6 h-6 text-ink-900" />
        </button>
      </div>

      <p className="text-body-sm text-bone-500 mt-4">← pass  ·  up = super  ·  like →</p>

      {/* Match celebration */}
      <MatchCelebration
        active={!!matchData}
        name={matchData?.name ?? ''}
        onDismiss={dismissMatch}
        matchLine={matchData?.line ?? ''}
      />
    </div>
  );
}
