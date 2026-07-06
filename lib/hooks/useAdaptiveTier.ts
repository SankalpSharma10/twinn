'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export type Tier = 1 | 2 | 3;

export async function detectTier(): Promise<Tier> {
  if (typeof window === 'undefined') return 3;
  
  const memory = (navigator as any).deviceMemory ?? 8;
  const cores  = navigator.hardwareConcurrency ?? 8;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // Low-end: < 4GB RAM or < 4 cores
  if (memory < 4 || cores < 4) return 1;
  // Mid: mobile or < 6 cores
  if (isMobile || cores < 6) return 2;
  return 3;
}

export function useAdaptiveTier() {
  const setTier = useStore((s) => s.setTier);

  useEffect(() => {
    detectTier().then(setTier);
  }, [setTier]);
}
