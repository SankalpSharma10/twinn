'use client';
import { use, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CardStack } from '@/components/swipe/CardStack';
import { copy } from '@/copy/strings';
import { User, BookOpen, Laptop, Dumbbell, Sparkles, Music2 } from 'lucide-react';
import type { Profile } from '@/components/swipe/SwipeCard';

type Mode = 'study' | 'hackathon' | 'gym' | 'twinn';

// Spotify data stub attached to each seed profile
interface SpotifyData {
  topGenres: string[];
  topArtists: string[];
  matchPct: number;   // 0–100 — computed vs the current user
  sharedArtist?: string;
}

interface ProfileWithSpotify extends Profile {
  spotify?: SpotifyData;
}

const seedProfiles: ProfileWithSpotify[] = [
  // Study
  { id: '1', display_name: 'Maya Patel',    year: '2nd year', major: 'Data Science',    pronouns: 'she/her',   compatibility: 0.92, mode: 'study',     tags: ['late night grinder', 'coffee shop', 'lo-fi'],
    spotify: { matchPct: 84, topGenres: ['lo-fi', 'indie pop', 'chillhop'], topArtists: ['Clairo', 'Rex Orange County', 'Novo Amor'], sharedArtist: 'Clairo' } },
  { id: '2', display_name: 'Jordan Kim',    year: '3rd year', major: 'Electrical Eng',  pronouns: 'he/him',    compatibility: 0.87, mode: 'study',     tags: ['library only', 'silent focus', 'duo sessions'],
    spotify: { matchPct: 61, topGenres: ['k-pop', 'edm', 'pop'], topArtists: ['BTS', 'Stray Kids', 'Martin Garrix'] } },
  { id: '3', display_name: 'Nina Wu',       year: '3rd year', major: 'Bioengineering',  pronouns: 'she/her',   compatibility: 0.76, mode: 'study',     tags: ['steady grinder', 'pre-med track', 'group of 4'],
    spotify: { matchPct: 73, topGenres: ['alt r&b', 'soul', 'indie'], topArtists: ['Frank Ocean', 'Daniel Caesar', 'SZA'], sharedArtist: 'Frank Ocean' } },
  // Hackathon
  { id: '4', display_name: 'Alex Chen',     year: '2nd year', major: 'CS',              pronouns: 'they/them', compatibility: 0.83, mode: 'hackathon', tags: ['frontend', 'react', 'to win'],
    spotify: { matchPct: 91, topGenres: ['hip-hop', 'trap', 'rap'], topArtists: ['Tyler, the Creator', 'Kendrick Lamar', 'Earl Sweatshirt'], sharedArtist: 'Tyler, the Creator' } },
  { id: '5', display_name: 'Sam Rivera',    year: '2nd year', major: 'Statistics',      pronouns: 'she/her',   compatibility: 0.79, mode: 'hackathon', tags: ['data / ml', 'python', 'build to learn'],
    spotify: { matchPct: 55, topGenres: ['indie rock', 'alternative', 'dream pop'], topArtists: ['Arctic Monkeys', 'The 1975', 'Tame Impala'] } },
  { id: '6', display_name: 'Kai Thompson',  year: '2nd year', major: 'Philosophy+CS',   pronouns: 'they/them', compatibility: 0.71, mode: 'hackathon', tags: ['pm', 'the visionary', 'first hack'],
    spotify: { matchPct: 78, topGenres: ['jazz', 'lo-fi', 'ambient'], topArtists: ['Nujabes', 'J Dilla', 'Makoto'], sharedArtist: 'Nujabes' } },
  // Gym
  { id: '7', display_name: 'Priya Nair',    year: '4th year', major: 'Pre-Med',         pronouns: 'she/her',   compatibility: 0.88, mode: 'gym',       tags: ['6am lifter', 'PPL split', 'needs spotter'],
    spotify: { matchPct: 82, topGenres: ['hip-hop', 'edm', 'pop'], topArtists: ['Drake', 'Travis Scott', 'Doja Cat'] } },
  { id: '8', display_name: 'Leo Santos',    year: '2nd year', major: 'CS + Econ',       pronouns: 'he/him',    compatibility: 0.81, mode: 'gym',       tags: ['late evening', 'calisthenics', 'solo'],
    spotify: { matchPct: 67, topGenres: ['rock', 'metal', 'punk'], topArtists: ['BMTH', 'Bring Me the Horizon', 'Linkin Park'] } },
  { id: '9', display_name: 'Tom Walsh',     year: 'Masters', major: 'ML Research',      pronouns: 'he/him',    compatibility: 0.74, mode: 'gym',       tags: ['5am', 'upper/lower', 'JIIT gym'],
    spotify: { matchPct: 70, topGenres: ['indie', 'indie rock', 'shoegaze'], topArtists: ['Radiohead', 'The National', 'Interpol'], sharedArtist: 'Radiohead' } },
  // Twinn
  { id: '10', display_name: 'Aanya Sharma', year: '2nd year', major: 'Design + CS',     pronouns: 'she/her',   compatibility: 0.94, mode: 'twinn',    tags: ['chai over coffee', 'long walks', 'unhinged meme sender'],
    spotify: { matchPct: 92, topGenres: ['indie pop', 'alt r&b', 'bedroom pop'], topArtists: ['Clairo', 'Beabadoobee', 'Mitski'], sharedArtist: 'Clairo' } },
  { id: '11', display_name: 'Rohan Mehta',  year: '3rd year', major: 'CS',              pronouns: 'he/him',    compatibility: 0.86, mode: 'twinn',    tags: ['chaos agent', 'spontaneous plans', 'voice note guy'],
    spotify: { matchPct: 81, topGenres: ['hip-hop', 'drill', 'rap'], topArtists: ['Tyler, the Creator', 'JPEGMAFIA', 'Denzel Curry'], sharedArtist: 'Tyler, the Creator' } },
  { id: '12', display_name: 'Zara Khan',    year: '1st year', major: 'Economics',       pronouns: 'she/her',   compatibility: 0.79, mode: 'twinn',    tags: ['canteen at midnight', 'the therapist friend', 'overthinks everything'],
    spotify: { matchPct: 74, topGenres: ['bollywood', 'indie', 'pop'], topArtists: ['Arijit Singh', 'Prateek Kuhad', 'AP Dhillon'] } },
];

const modeConfig: Record<Mode, { icon: typeof BookOpen; label: string; color: string }> = {
  study:     { icon: BookOpen,  label: 'Study',     color: '#8FB37A' },
  hackathon: { icon: Laptop,    label: 'Hackathon', color: '#E8B34A' },
  gym:       { icon: Dumbbell,  label: 'Gym',       color: '#FF6A2E' },
  twinn:     { icon: Sparkles,  label: 'Twinn',     color: '#A78BFA' },
};

interface PageProps {
  params: Promise<{ mode: string }>;
}

export default function DiscoverPage({ params }: PageProps) {
  const resolved = use(params);
  const rawMode = resolved.mode;
  const validMode = rawMode in modeConfig ? (rawMode as Mode) : 'study';
  return <DiscoverClient initialMode={validMode} />;
}

function SpotifyBadge({ data }: { data: SpotifyData }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        background: 'rgba(29,185,84,0.10)',
        border: '1px solid rgba(29,185,84,0.25)',
      }}
      aria-label={`${data.matchPct}% music match`}
    >
      <Music2 className="w-3 h-3 shrink-0" style={{ color: '#1DB954' }} aria-hidden="true" />
      <span className="body-sm font-medium" style={{ color: '#1DB954' }}>
        {data.sharedArtist
          ? `both on ${data.sharedArtist}`
          : copy.spotify.matchLabel(data.matchPct)}
      </span>
    </div>
  );
}

function DiscoverClient({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [profiles, setProfiles] = useState<ProfileWithSpotify[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this comes from auth
  const MY_ID = '11111111-1111-1111-1111-000000000001';

  useEffect(() => {
    let mounted = true;
    async function fetchProfiles() {
      setLoading(true);
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // We fetch all other profiles. In the full app, we'd use the get_candidates RPC 
      // but that requires quiz vectors which the seed doesn't generate yet.
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', MY_ID)
        .limit(20);

      if (mounted && data) {
        // Map DB fields to our Profile interface
        const mapped = data.map(p => ({
          id: p.id,
          display_name: p.display_name,
          year: p.year || '',
          major: p.major || '',
          pronouns: p.pronouns || '',
          compatibility: 0.7 + Math.random() * 0.25, // Mock score for now
          mode: mode,
          tags: ['seed profile', 'from db'],
          photo_blurhash: p.photo_blurhash,
        }));
        setProfiles(mapped as ProfileWithSpotify[]);
      }
      if (mounted) setLoading(false);
    }
    fetchProfiles();
    return () => { mounted = false; };
  }, [mode]);

  const handleSwipe = async (_profileId: string, decision: 'like' | 'pass' | 'super') => {
    // Optimistic UI — just return matched occasionally for demo
    await new Promise((r) => setTimeout(r, 200));
    const matched = decision !== 'pass' && Math.random() < 0.3;
    return { matched };
  };

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--ink-950)' }} aria-label={`${mode} mode discover`}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-40"
        style={{
          background: 'rgba(11,10,8,0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--border-hairline)',
        }}
      >
        <Link
          href="/"
          className="font-display text-xl transition-colors"
          style={{ color: 'var(--bone-400)', transitionDuration: '240ms' }}
          aria-label="Twinn home"
        >
          twinn
        </Link>

        {/* Mode switcher */}
        <div
          className="flex items-center gap-1 rounded-full p-1"
          role="tablist"
          aria-label="Select mode"
          style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
        >
          {(Object.keys(modeConfig) as Mode[]).map((m) => {
            const cfg = modeConfig[m];
            const Icon = cfg.icon;
            const isActive = m === mode;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={isActive}
                onClick={() => setMode(m)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full body-sm font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--ink-900)' : 'var(--bone-500)',
                  zIndex: 1,
                  transitionDuration: '240ms',
                }}
                aria-label={`Switch to ${cfg.label} mode`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mode-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: cfg.color }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">{cfg.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Nav icons */}
        <div className="flex items-center gap-3">
          <Link href="/matches" aria-label="Your matches">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
            >
              <span className="body-sm font-semibold" style={{ color: 'var(--bone-400)' }}>6</span>
            </div>
          </Link>
          <Link href="/me" aria-label="Your profile">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ink-700)', border: '1px solid var(--border-default)' }}
            >
              <User className="w-4 h-4" style={{ color: 'var(--bone-400)' }} aria-hidden="true" />
            </div>
          </Link>
        </div>
      </div>

      {/* Spotify match badge for twinn mode */}
      {mode === 'twinn' && (
        <div className="px-6 pt-4 flex justify-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full body-sm"
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.2)',
              color: '#A78BFA',
            }}
          >
            <Music2 className="w-3.5 h-3.5" aria-hidden="true" />
            Spotify boosting your matches
          </div>
        </div>
      )}

      {/* Card stack */}
      <div className="flex-1 flex flex-col px-6 py-6 max-w-sm mx-auto w-full">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="body-sm" style={{ color: 'var(--bone-400)' }}>{copy.loading.discover[mode] || copy.loading.discover.default}</span>
          </div>
        ) : (
          <CardStack
            profiles={profiles}
            onSwipe={handleSwipe}
            mode={mode}
          />
        )}
      </div>
    </main>
  );
}
