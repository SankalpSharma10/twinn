import { create } from 'zustand';
import { Tier } from './hooks/useAdaptiveTier';

export type AppMode = 'study' | 'hackathon' | 'gym' | 'twinn';

interface AppStore {
  tier: Tier;
  setTier: (t: Tier) => void;
  muted: boolean;
  setMuted: (m: boolean) => void;
  currentMode: AppMode;
  setCurrentMode: (mode: AppMode) => void;
}

export const useStore = create<AppStore>((set) => ({
  tier: 3,
  setTier: (tier) => set({ tier }),
  muted: true,
  setMuted: (muted) => set({ muted }),
  currentMode: 'study',
  setCurrentMode: (currentMode) => set({ currentMode }),
}));
