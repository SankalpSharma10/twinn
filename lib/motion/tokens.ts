export const ease = {
  out:    [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut:  [0.65, 0, 0.35, 1] as [number, number, number, number],
  spring: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
  bounce: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 1 },
};

export const duration = {
  instant: 0.15,
  quick:   0.24,
  base:    0.40,
  slow:    0.70,
  hero:    1.20,
};
