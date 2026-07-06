'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type MatchWithProfile = {
  id: string;
  matched_at: string;
  last_message_at: string | null;
  mode_id: string;
  other_user: {
    id: string;
    display_name: string;
    photo_url: string | null;
  };
  last_message?: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch matches where current user is user_a OR user_b
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, matched_at, last_message_at, mode_id, user_a, user_b,
          profile_a:profiles!matches_user_a_fkey(id, display_name, photo_url),
          profile_b:profiles!matches_user_b_fkey(id, display_name, photo_url)
        `)
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error loading matches:', error);
      } else if (data) {
        const formatted = data.map((m: any) => {
          const isUserA = m.user_a === user.id;
          const otherProfile = isUserA ? m.profile_b : m.profile_a;
          return {
            id: m.id,
            matched_at: m.matched_at,
            last_message_at: m.last_message_at,
            mode_id: m.mode_id,
            other_user: otherProfile
          };
        });
        setMatches(formatted);
      }
      setLoading(false);
    }
    loadMatches();
  }, [supabase]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink-950)' }}>
        <Loader2 className="w-8 h-8 text-bone-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6" style={{ background: 'var(--ink-950)' }}>
      <h1 className="display-sm text-bone-50 mb-8 mt-12">Your Matches</h1>
      
      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center mb-4">
            <span className="text-2xl">👻</span>
          </div>
          <p className="text-body text-bone-300">No matches yet. Keep swiping!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, i) => (
            <Link key={match.id} href={`/chat/${match.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-colors active:scale-[0.98]"
                style={{ background: 'var(--ink-800)', border: '1px solid var(--border-default)' }}
              >
                {/* Avatar */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-border-default">
                  {match.other_user.photo_url ? (
                    <Image src={match.other_user.photo_url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-ink-700 flex items-center justify-center">
                      <span className="text-bone-400 font-display text-xl">{match.other_user.display_name[0]}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-body font-bold text-bone-100 truncate">{match.other_user.display_name}</h3>
                    <span className="text-caption text-bone-500 uppercase tracking-wider">{match.mode_id}</span>
                  </div>
                  <p className="text-body-sm text-bone-400 truncate">
                    Tap to chat
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
