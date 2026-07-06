'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { obsidianVertexShader, obsidianFragmentShader } from './shaders/obsidian';

interface MonolithProps {
  progress: number; // 0 to 1 for the rising animation
}

export function Monolith({ progress }: MonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorPlatinum: { value: new THREE.Color('#E8D9B5') }
      },
      vertexShader: obsidianVertexShader,
      fragmentShader: obsidianFragmentShader,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Update time uniform for breathing
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.elapsedTime;
      
      // The Monolith rises from below the horizon line based on progress
      // Horizon line is around y = -2. Start below it (e.g. -10), end at center (e.g. 0).
      // We will map progress 0 -> 1 to Y: -10 -> 0
      const targetY = -10 + (progress * 10);
      
      // Also add the dip anticipation: dips slightly before rising
      // This is handled by GSAP providing the exact progress value (using CustomEase).
      meshRef.current.position.y = targetY;
    }
  });

  return (
    <mesh ref={meshRef} position={[2, -10, 0]} castShadow receiveShadow>
      {/* 9:16 proportion monolithic slab, highly subdivided for vertex displacement */}
      <boxGeometry args={[3, 5.33, 1, 64, 64, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
