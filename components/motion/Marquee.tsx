'use client';

interface Props {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  speed = 40,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}: Props) {
  const animDuration = `${Math.max(10, 200 / speed)}s`;
  const animName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); }       to { transform: translateX(-33.333%); } }
        @keyframes marquee-right { from { transform: translateX(-33.333%); } to { transform: translateX(0); } }
      `}</style>
      <div
        className={`overflow-hidden mask-marquee ${className}`}
        role="marquee"
        aria-live="off"
      >
        <div
          className="flex w-max"
          style={{
            animation: `${animName} ${animDuration} linear infinite`,
          }}
          onMouseEnter={(e) => {
            if (pauseOnHover)
              (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            if (pauseOnHover)
              (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
          }}
        >
          <div className="flex items-center gap-8 pr-8">{children}</div>
          <div aria-hidden="true" className="flex items-center gap-8 pr-8">{children}</div>
          <div aria-hidden="true" className="flex items-center gap-8 pr-8">{children}</div>
        </div>
      </div>
    </>
  );
}
