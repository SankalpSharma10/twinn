export function InstrumentNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none mix-blend-difference">
      <div className="flex justify-end w-full">
        <div 
          className="font-mono text-[10px] tracking-[0.2em] uppercase"
          style={{ color: 'var(--mercury)' }}
        >
          48.8566° N / 2.3522° E &middot; OBSIDIAN.CH1 &middot; SYS.NOMINAL
        </div>
      </div>
    </nav>
  );
}
