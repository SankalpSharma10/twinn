'use client';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { ease } from '@/lib/motion/tokens';

export interface Profile {
  id: string;
  display_name: string;
  year: string;
  major: string;
  photo_url?: string | null;
  photo_blurhash?: string | null;
  pronouns?: string | null;
  compatibility: number;
  mode: 'study' | 'hackathon' | 'gym' | 'twinn';
  tags?: string[];
}

interface Props {
  profile: Profile;
  onSwipe: (decision: 'like' | 'pass' | 'super') => void;
  isTop: boolean;
  stackIndex: number;
}

const SWIPE_VELOCITY_THRESHOLD = 800;
const SWIPE_DISTANCE_THRESHOLD = 120;

export function SwipeCard({ profile, onSwipe, isTop, stackIndex }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  const likeOpacity  = useTransform(x, [20, 120], [0, 1]);
  const passOpacity  = useTransform(x, [-20, -120], [0, 1]);

  const scale   = stackIndex === 0 ? 1 : stackIndex === 1 ? 0.95 : 0.90;
  const yOffset = stackIndex === 0 ? 0 : stackIndex === 1 ? 8   : 16;

  const modeColors = {
    study:     { bg: 'rgba(143,179,122,0.15)', text: '#8FB37A', border: 'rgba(143,179,122,0.3)' },
    hackathon: { bg: 'rgba(232,179,74,0.15)',  text: '#E8B34A', border: 'rgba(232,179,74,0.3)' },
    gym:       { bg: 'rgba(255,106,46,0.15)',  text: '#FF6A2E', border: 'rgba(255,106,46,0.3)' },
    twinn:     { bg: 'rgba(167,139,250,0.15)', text: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
  };

  const modeColor = modeColors[profile.mode];

  function handleDragEnd(_: unknown, info: PanInfo) {
    setDragging(false);
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (velocity > SWIPE_VELOCITY_THRESHOLD || offset > SWIPE_DISTANCE_THRESHOLD) {
      // Haptics
      if ('vibrate' in navigator) navigator.vibrate([10, 40, 10]);
      onSwipe('like');
    } else if (velocity < -SWIPE_VELOCITY_THRESHOLD || offset < -SWIPE_DISTANCE_THRESHOLD) {
      if ('vibrate' in navigator) navigator.vibrate([10]);
      onSwipe('pass');
    }
  }

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : yOffset,
        rotate: isTop ? rotate : 0,
        scale,
        zIndex: 3 - stackIndex,
        originX: 0.5,
        originY: 1,
      }}
      drag={isTop ? 'x' : false}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      layout
      layoutId={`card-${profile.id}`}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden card"
        style={{ boxShadow: 'var(--shadow-lifted)' }}
      >
        {/* Photo */}
        <div className="absolute inset-0">
          {!imgLoaded && (
            <div
              className="absolute inset-0 skeleton"
              style={{
                background: profile.photo_blurhash
                  ? `url("data:image/png;base64,...") center/cover`
                  : undefined,
              }}
            />
          )}
          {profile.photo_url ? (
            <Image
              src={profile.photo_url}
              alt={`${profile.display_name}, ${profile.year}, ${profile.major}`}
              fill
              className={`object-cover transition-opacity duration-400 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              sizes="(max-width: 480px) 100vw, 480px"
              priority={stackIndex === 0}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, var(--ink-700), var(--ink-600))` }}
            >
              <span className="text-bone-400 text-6xl font-display">
                {profile.display_name[0]}
              </span>
            </div>
          )}
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(8,7,6,0.95) 0%, rgba(8,7,6,0.3) 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Compatibility pill */}
        <div className="absolute top-4 right-4">
          <div
            className="px-3 py-1 rounded-full text-body-sm font-semibold"
            style={{
              background: 'rgba(255,106,46,0.15)',
              border: '1px solid rgba(255,106,46,0.3)',
              color: 'var(--ember-400)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {Math.round(profile.compatibility * 100)}% match
          </div>
        </div>

        {/* Like/Pass overlays */}
        {isTop && (
          <>
            <motion.div
              className="absolute top-8 left-6 px-4 py-2 rounded-md border-2 border-ember-500 text-ember-500 font-bold text-xl uppercase tracking-wide"
              style={{ opacity: likeOpacity, rotate: -15 }}
              aria-hidden="true"
            >
              LIKE
            </motion.div>
            <motion.div
              className="absolute top-8 right-6 px-4 py-2 rounded-md border-2 border-bone-300 text-bone-300 font-bold text-xl uppercase tracking-wide"
              style={{ opacity: passOpacity, rotate: 15 }}
              aria-hidden="true"
            >
              PASS
            </motion.div>
          </>
        )}

        {/* Mode tag */}
        <div className="absolute top-4 left-4">
          <div
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: modeColor.bg,
              border: `1px solid ${modeColor.border}`,
              color: modeColor.text,
              backdropFilter: 'blur(8px)',
            }}
          >
            {profile.mode}
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-h1 font-display text-bone-50 mb-1">
                {profile.display_name}
              </h2>
              <p className="text-body text-bone-300">
                {profile.year && `'${profile.year}`} · {profile.major}
                {profile.pronouns && ` · ${profile.pronouns}`}
              </p>
            </div>
          </div>

          {/* Tags */}
          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(245,241,234,0.08)',
                    border: '1px solid rgba(245,241,234,0.12)',
                    color: 'var(--bone-300)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
