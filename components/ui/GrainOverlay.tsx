'use client';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

export function GrainOverlay() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9990] mix-blend-overlay opacity-40"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
        animation: 'grain 12s steps(10) infinite',
      }}
    />
  );
}
