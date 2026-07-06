'use client';

import { useState, useEffect, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SwipeCard, Profile } from '@/components/swipe/SwipeCard';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function DiscoverPage() {
  const [candidates, setCandidates] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState<'study' | 'gym' | 'hackathon'>('study');
  
  const supabase = createClient();

  useEffect(() => {
    async function loadCandidates() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call our Postgres Function!
      const { data, error } = await supabase.rpc('get_candidates', {
        p_user_id: user.id,
        p_mode_id: currentMode,
        p_limit: 20
      });

      if (error) {
        console.error('Error fetching candidates:', error);
      } else if (data) {
        // Map the backend row to the Profile interface expected by SwipeCard
        const mappedProfiles: Profile[] = data.map((row: any) => {
          const tags = [];
          if (row.artist_hindi) tags.push(row.artist_hindi);
          if (row.artist_english) tags.push(row.artist_english);
          if (row.artist_punjabi) tags.push(row.artist_punjabi);

          return {
            id: row.profile_id,
            display_name: row.display_name,
            year: row.year,
            major: row.major,
            photo_url: row.photo_url,
            photo_blurhash: row.photo_blurhash,
            pronouns: row.pronouns,
            compatibility: row.compatibility || 0,
            mode: currentMode,
            tags
          };
        });
        setCandidates(mappedProfiles);
      }
      setLoading(false);
    }
    
    loadCandidates();
  }, [currentMode, supabase]);

  const handleSwipe = async (decision: 'like' | 'pass' | 'super') => {
    // 1. Remove the top card from the UI stack
    const swipeeId = candidates[0].id;
    setCandidates((prev) => prev.slice(1));

    // 2. Insert into Postgres `swipes` table
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,
        swipee_id: swipeeId,
        mode_id: currentMode,
        decision: decision
      });

    if (error) {
      console.error('Error recording swipe:', error);
    }
    // Note: The Postgres Trigger `on_swipe_insert` will automatically create a row in the `matches` table if this was a mutual 'like' !
  };

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden" style={{ background: 'var(--ink-950)' }}>
      {/* Mode Selector Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-center gap-2">
        {['study', 'gym', 'hackathon'].map((mode) => (
          <button
            key={mode}
            onClick={() => setCurrentMode(mode as any)}
            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
            style={{
              background: currentMode === mode ? 'var(--ember-500)' : 'var(--ink-800)',
              color: currentMode === mode ? '#000' : 'var(--bone-300)',
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Swipe Stack container */}
      <div className="absolute inset-0 pt-20 pb-24 px-4">
        <div className="relative w-full h-full max-w-sm mx-auto">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-bone-500 animate-spin mb-4" />
              <p className="text-bone-500 font-medium">Finding vibes...</p>
            </div>
          ) : candidates.length > 0 ? (
            <AnimatePresence>
              {candidates.map((profile, i) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  isTop={i === 0}
                  stackIndex={i}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-ink-800 flex items-center justify-center mb-6">
                <span className="text-4xl">🏜️</span>
              </div>
              <h2 className="display-sm text-bone-100 mb-2">You're out of vibes!</h2>
              <p className="text-body text-bone-400">
                You've seen everyone in this mode. Check back later or switch modes.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
