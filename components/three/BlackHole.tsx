'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { accretionVertexShader, accretionFragmentShader } from './shaders/blackhole';

export function BlackHole() {
  const diskRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Position it to the left side
  const posX = -viewport.width * 0.35;

  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorInner: { value: new THREE.Color('#FFF2E8') }, // Bright bone/white for the hot inner edge
        colorOuter: { value: new THREE.Color('#FF6A2E') }  // Deep ember for the cooler outer edge
      },
      vertexShader: accretionVertexShader,
      fragmentShader: accretionFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);

  useFrame((state) => {
    if (diskRef.current) {
      // Very slow rotation for the entire disk geometry to give a macro swirl
      diskRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      
      // Update shader time for internal FBM flow
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[posX, 0, 0]}>
      
      {/* The Gravitational Lensing sphere was causing intense WebGL depth/refraction glitches because it overlapped the glowing accretion disk. We are removing it to ensure a perfectly clean, high-end rendering of the black hole. */}

      {/* 2. The Event Horizon */}
      {/* Pure black sphere inside the lens. Absorbs all light. */}
      <mesh>
        {/* Slightly larger to cover the inner edge of the accretion disk perfectly */}
        <sphereGeometry args={[2.58, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* 3. The Accretion Disk */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={diskRef} rotation-x={Math.PI * 0.35} rotation-y={Math.PI * 0.1}>
          {/* Ring geometry: inner radius, outer radius, thetaSegments, phiSegments */}
          <ringGeometry args={[2.6, 6.0, 128, 64]} />
          <primitive object={diskMaterial} attach="material" />
        </mesh>
      </Float>

    </group>
  );
}
