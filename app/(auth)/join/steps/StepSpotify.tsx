'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { copy } from '@/copy/strings';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { ChevronRight } from 'lucide-react';

interface Props {
  onNext: (data: Record<string, unknown>) => void;
  setLoading: (v: boolean) => void;
}

export function StepSpotify({ onNext }: Props) {
  const [artistHindi, setArtistHindi] = useState('');
  const [artistEnglish, setArtistEnglish] = useState('');
  const [artistPunjabi, setArtistPunjabi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      artist_hindi: artistHindi,
      artist_english: artistEnglish,
      artist_punjabi: artistPunjabi,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="display-md mb-3" style={{ color: 'var(--bone-100)' }}>
          your music taste
        </h1>
        <p className="body" style={{ color: 'var(--bone-400)' }}>
          Who are your favorite artists right now? We'll use this to match you with people who share your exact vibe.
        </p>
      </div>

      <div className="space-y-4">
        {/* Hindi */}
        <div>
          <label htmlFor="hindi" className="block text-body-sm text-bone-400 mb-2">top hindi artist</label>
          <input
            id="hindi"
            type="text"
            value={artistHindi}
            onChange={(e) => setArtistHindi(e.target.value)}
            placeholder="e.g. Arijit Singh"
            className="w-full px-4 py-4 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
            style={{
              background: 'var(--ink-700)',
              border: '1px solid var(--border-default)',
              transition: 'border-color 240ms',
            }}
            required
          />
        </div>

        {/* English */}
        <div>
          <label htmlFor="english" className="block text-body-sm text-bone-400 mb-2">top english artist</label>
          <input
            id="english"
            type="text"
            value={artistEnglish}
            onChange={(e) => setArtistEnglish(e.target.value)}
            placeholder="e.g. The Weeknd"
            className="w-full px-4 py-4 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
            style={{
              background: 'var(--ink-700)',
              border: '1px solid var(--border-default)',
              transition: 'border-color 240ms',
            }}
            required
          />
        </div>

        {/* Punjabi */}
        <div>
          <label htmlFor="punjabi" className="block text-body-sm text-bone-400 mb-2">top punjabi artist</label>
          <input
            id="punjabi"
            type="text"
            value={artistPunjabi}
            onChange={(e) => setArtistPunjabi(e.target.value)}
            placeholder="e.g. Diljit Dosanjh"
            className="w-full px-4 py-4 rounded-lg text-bone-100 placeholder:text-bone-500 text-body focus:outline-none"
            style={{
              background: 'var(--ink-700)',
              border: '1px solid var(--border-default)',
              transition: 'border-color 240ms',
            }}
            required
          />
        </div>
      </div>

      <MagneticButton
        type="submit"
        className="btn-primary w-full flex items-center justify-center gap-2"
        disabled={!artistHindi || !artistEnglish || !artistPunjabi}
      >
        continue
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </MagneticButton>
    </form>
  );
}
