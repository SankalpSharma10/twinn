'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { horizonVertexShader, horizonFragmentShader } from './shaders/horizon';

interface HorizonProps {
  progress: number; // 0 to 1 for the drawing animation across the screen
}

export function Horizon({ progress }: HorizonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        colorPlatinum: { value: new THREE.Color('#E8D9B5') },
        colorIon: { value: new THREE.Color('#C6ECFF') }
      },
      vertexShader: horizonVertexShader,
      fragmentShader: horizonFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.time.value = state.clock.elapsedTime;
      mat.uniforms.progress.value = progress;
    }
  });

  // The horizon line spans the entire width of the viewport
  // Golden ratio phi is ~1.618. 1/phi is ~0.618. 
  // Lower phi horizon line: roughly at y = -viewport.height * 0.236
  const horizonY = -viewport.height * 0.236;

  return (
    <mesh ref={meshRef} position={[0, horizonY, -8]}>
      {/* Very wide plane, thin height */}
      <planeGeometry args={[viewport.width * 2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
