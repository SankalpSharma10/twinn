'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Music2, Check, ChevronRight } from 'lucide-react';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  setLoading: (v: boolean) => void;
}

// Mock top genres/artists that a real Spotify OAuth would return
const MOCK_SPOTIFY_DATA = {
  topArtists: ['Arctic Monkeys', 'Frank Ocean', 'Tame Impala', 'Tyler, the Creator', 'Billie Eilish'],
  topGenres:  ['indie rock', 'alt r&b', 'dream pop', 'lo-fi', 'alternative'],
  energy:     0.72,   // 0–1, used in match score
  valence:    0.58,   // 0–1 (mood)
};

export function StepSpotify({ onNext, setLoading }: Props) {
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Simulate Spotify OAuth round-trip (real: redirect to /api/auth/spotify)
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setConnected(true);
  };

  const handleContinue = () => {
    onNext({ spotify: connected ? MOCK_SPOTIFY_DATA : null });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-md mb-3" style={{ color: 'var(--bone-100)' }}>
          {copy.onboarding.stepSpotify.title}
        </h1>
        <p className="body" style={{ color: 'var(--bone-400)' }}>
          {copy.onboarding.stepSpotify.description}
        </p>
      </div>

      {/* Spotify connect card */}
      <AnimatePresence mode="wait">
        {!connected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-2xl p-6"
            style={{
              background: 'var(--ink-700)',
              border: '1px solid var(--border-default)',
            }}
          >
            {/* Spotify logo + branding */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: '#1DB954' }}
              >
                <Music2 className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="body font-semibold" style={{ color: 'var(--bone-100)' }}>Spotify</p>
                <p className="body-sm" style={{ color: 'var(--bone-500)' }}>we only read. never post.</p>
              </div>
            </div>

            {/* What we read */}
            <div className="space-y-2 mb-6">
              {[
                'your top artists (last 6 months)',
                'your top genres',
                'listening energy — chill vs hype',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#1DB954' }} />
                  <span className="body-sm" style={{ color: 'var(--bone-400)' }}>{item}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleConnect}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold body transition-all"
              style={{
                background: '#1DB954',
                color: '#000',
                transition: 'opacity 200ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              aria-label="Connect Spotify account"
            >
              <Music2 className="w-5 h-5" aria-hidden="true" />
              {copy.onboarding.stepSpotify.cta}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(29,185,84,0.08)',
              border: '1px solid rgba(29,185,84,0.3)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#1DB954' }}>
                <Check className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="body font-semibold" style={{ color: 'var(--bone-100)' }}>
                  {copy.onboarding.stepSpotify.connected}
                </p>
                <p className="body-sm" style={{ color: 'var(--bone-400)' }}>
                  {copy.onboarding.stepSpotify.connectedSub}
                </p>
              </div>
            </div>

            {/* Preview top genres */}
            <div className="flex flex-wrap gap-2 mt-3">
              {MOCK_SPOTIFY_DATA.topGenres.map((g) => (
                <span
                  key={g}
                  className="caption px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(29,185,84,0.12)',
                    border: '1px solid rgba(29,185,84,0.25)',
                    color: '#1DB954',
                    letterSpacing: '0.06em',
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <MagneticButton
          type="button"
          onClick={handleContinue}
          className="btn-primary w-full flex items-center justify-center gap-2"
          aria-label={connected ? 'Continue with Spotify connected' : 'Continue without Spotify'}
        >
          {connected ? 'nice — let\'s go' : copy.onboarding.stepSpotify.cta}
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </MagneticButton>

        {!connected && (
          <button
            type="button"
            onClick={handleContinue}
            className="w-full body-sm text-center"
            style={{ color: 'var(--bone-500)' }}
            aria-label="Skip Spotify connection"
          >
            {copy.onboarding.stepSpotify.skip}
          </button>
        )}
      </div>
    </div>
  );
}
