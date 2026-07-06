'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const TwinnParticles = dynamic(
  () => import('@/components/three/TwinnParticles').then((m) => ({ default: m.TwinnParticles })),
  { ssr: false }
);

export function HeroCanvas() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 55%, rgba(255,106,46,0.06) 0%, rgba(8,7,6,1) 70%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <TwinnParticles />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
          <Noise
            premultiply
            blendFunction={BlendFunction.ADD}
            opacity={0.035}
          />
          <Vignette
            eskil={false}
            offset={0.12}
            darkness={1.1}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
