'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { inkVertexShader, inkFragmentShader } from './shaders/ink';

interface InkBloomProps {
  progress: number; // 0 to 1 for the inhale phase
}

export function InkBloom({ progress }: InkBloomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        progress: { value: 0 },
        colorGraphite: { value: new THREE.Color('#0E1218') },
        colorVoid: { value: new THREE.Color('#05070C') }
      },
      vertexShader: inkVertexShader,
      fragmentShader: inkFragmentShader,
      transparent: true,
      depthTest: false, // Ensure it draws over everything when active
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.time.value = state.clock.elapsedTime;
      mat.uniforms.progress.value = progress;
    }
  });

  // If progress is >= 1, the effect is finished and faded out.
  // We can unmount it or just hide it to save GPU.
  if (progress >= 1.0) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 10]} renderOrder={999}>
      {/* Full screen quad */}
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
