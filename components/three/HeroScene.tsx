'use client';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

import { Monolith } from './Monolith';
import { Horizon } from './Horizon';
import { InkBloom } from './InkBloom';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  CustomEase.create('signature', 'M0,0 C0.16,1 0.3,1 1,1');
}

export function HeroScene() {
  const [timeline, setTimeline] = useState({
    inkProgress: 0,
    horizonProgress: 0,
    monolithProgress: 0,
    typographyReady: false,
    ctaReady: false,
  });

  useEffect(() => {
    // Master GSAP Timeline for the 6-Act Sequence
    const tl = gsap.timeline({ defaults: { ease: 'signature' } });

    // Act I: The Black (0.0s -> 0.6s) is just a delay
    tl.to({}, { duration: 0.6 });

    // Act II: The Inhale (Ink Bloom) (0.6s -> 1.8s)
    tl.to(
      { p: 0 },
      {
        p: 1,
        duration: 1.2,
        onUpdate: function () {
          setTimeline((prev) => ({ ...prev, inkProgress: this.targets()[0].p }));
        },
      }
    );

    // Act III: The Horizon (1.8s -> 3.4s)
    tl.to(
      { p: 0 },
      {
        p: 1,
        duration: 1.6,
        onUpdate: function () {
          setTimeline((prev) => ({ ...prev, horizonProgress: this.targets()[0].p }));
        },
      },
      '-=0.2' // Overlap slightly
    );

    // Act IV: The Object (Monolith rises) (3.4s -> 5.6s)
    tl.to(
      { p: 0 },
      {
        p: 1,
        duration: 2.2,
        onUpdate: function () {
          setTimeline((prev) => ({ ...prev, monolithProgress: this.targets()[0].p }));
        },
      },
      '-=0.4'
    );

    // Act V: The Word (Trigger typography reveal)
    tl.call(() => {
      setTimeline((prev) => ({ ...prev, typographyReady: true }));
    }, undefined, '-=0.5');

    // Act VI: The Invitation (Trigger CTA reveal)
    tl.call(() => {
      setTimeline((prev) => ({ ...prev, ctaReady: true }));
    }, undefined, '+=1.8');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 35 }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping
        }}
        dpr={[1, 2]}
      >
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.15} color="#B8C0CC" />
        {/* Key light: 3200K, angled 34deg above horizon */}
        <directionalLight position={[-10, 6.74, 10]} intensity={1.5} color="#FFD1B3" castShadow />
        {/* Rim light: 8000K, cold sliver from behind */}
        <directionalLight position={[0, 0, -10]} intensity={2.0} color="#C6ECFF" />

        <Suspense fallback={null}>
          <InkBloom progress={timeline.inkProgress} />
          <Horizon progress={timeline.horizonProgress} />
          <Monolith progress={timeline.monolithProgress} />
        </Suspense>

        {/* Cinematic Post-Processing Pipeline */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom 
            luminanceThreshold={0.85} 
            luminanceSmoothing={0.5} 
            intensity={1.2} 
            mipmapBlur 
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.002, 0.002)}
          />
          <Noise 
            premultiply 
            blendFunction={BlendFunction.ADD} 
            opacity={0.04} 
          />
          <Vignette 
            eskil={false} 
            offset={0.3} 
            darkness={1.1} 
            blendFunction={BlendFunction.NORMAL} 
          />
        </EffectComposer>
      </Canvas>

      {/* DOM Overlay for Act V & VI */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 pointer-events-none max-w-7xl mx-auto">
        <div className="flex flex-col items-start" style={{ marginLeft: '9%' /* 1/phi left alignment */ }}>
          
          {/* Manifesto */}
          <div className="overflow-hidden mb-8 h-[20px]">
            <p 
              className="font-mono text-[13px] tracking-[0.14em] uppercase"
              style={{
                color: 'var(--mercury)',
                transform: timeline.typographyReady ? 'translateY(0)' : 'translateY(100%)',
                opacity: timeline.typographyReady ? 1 : 0,
                transition: 'transform 1.2s cubic-bezier(0.16,1,0.3,1), opacity 1.2s ease-out',
                transitionDelay: '0.2s'
              }}
            >
              A NEW HORIZON FOR MACHINES THAT REMEMBER LIGHT.
            </p>
          </div>

          {/* Wordmark */}
          <div className="overflow-hidden mb-16 h-[100px]">
            <h1 
              className="font-display text-[88px] leading-none tracking-[-0.02em]"
              style={{
                color: 'var(--bone-50)',
                transform: timeline.typographyReady ? 'translateY(0) rotateX(0deg)' : 'translateY(100%) rotateX(12deg)',
                opacity: timeline.typographyReady ? 1 : 0,
                transition: 'transform 1.6s cubic-bezier(0.16,1,0.3,1), opacity 1.2s ease-out',
                transformOrigin: 'bottom'
              }}
            >
              twinn
            </h1>
          </div>

          {/* CTA */}
          <div className="pointer-events-auto">
            <button
              className="relative overflow-hidden rounded-full border border-white/20 text-white font-medium text-[15px] tracking-[-0.005em]"
              style={{
                padding: '16px 36px',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                transform: timeline.ctaReady ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(20px)',
                opacity: timeline.ctaReady ? 1 : 0,
                transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1), opacity 1s ease-out',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:scale-95 block">
                Enter the Horizon
              </span>
              {/* Caustic simulated hover state */}
              <div className="absolute inset-0 bg-[var(--ember-500)] opacity-0 hover:opacity-10 transition-opacity duration-700" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
