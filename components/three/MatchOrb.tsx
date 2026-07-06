'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '@/lib/store';

function OrbiterSphere({ index, total }: { index: number; total: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.3 + (index / total) * 0.4;
  const radius = 0.6 + Math.sin(index * 1.4) * 0.2;
  const yOffset = (Math.random() - 0.5) * 0.8;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + (index / total) * Math.PI * 2;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = yOffset + Math.sin(t * 0.7) * 0.1;
  });

  const emissiveColor = new THREE.Color().setHSL(0.06 + (index / total) * 0.04, 1, 0.5);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial
        color={emissiveColor}
        emissive={emissiveColor}
        emissiveIntensity={3}
        roughness={0}
        metalness={0}
      />
    </mesh>
  );
}

function GlassOrb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshTransmissionMaterial
          thickness={1.5}
          roughness={0.05}
          ior={1.4}
          transmission={1}
          chromaticAberration={0.3}
          backside
          backsideThickness={0.3}
          resolution={256}
          distortionScale={0.3}
          temporalDistortion={0.1}
        />
      </mesh>
      {Array.from({ length: 30 }).map((_, i) => (
        <OrbiterSphere key={i} index={i} total={30} />
      ))}
    </Float>
  );
}

export function MatchOrb() {
  const tier = useStore((s) => s.tier);

  if (tier === 1) {
    return (
      <div className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none">
        <div
          className="w-64 h-64 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, var(--ember-500) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>
    );
  }

  return (
    <Canvas
      className="absolute inset-0 pointer-events-none"
      dpr={tier === 2 ? 0.8 : [1, 2]}
      camera={{ position: [0, 0, 4], fov: 35 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#FF6A2E" />
      <pointLight position={[-2, -1, 1]} intensity={0.5} color="#FF9E5B" />
      <group position={[1.2, 0, 0]}>
        <GlassOrb />
      </group>
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.5} luminanceSmoothing={0.025} />
      </EffectComposer>
    </Canvas>
  );
}
