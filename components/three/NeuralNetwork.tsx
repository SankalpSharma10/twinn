'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three-stdlib';
import { positionShader, velocityShader } from './shaders/neural';
import { NeuralConnections } from './NeuralConnections';

const SIZE = 64; // 64x64 = 4096 particles (Perfect for the requested 2000-5000 range)

export function NeuralNetwork() {
  const { gl, size, pointer } = useThree();
  const particlesRef = useRef<THREE.Points>(null);
  const [posTexture, setPosTexture] = useState<THREE.Texture | null>(null);
  
  // Setup FBO Computation
  const gpuCompute = useMemo(() => {
    const gpu = new GPUComputationRenderer(SIZE, SIZE, gl);
    if (gl.capabilities.isWebGL2 === false) {
      gpu.setDataType(THREE.HalfFloatType);
    }
    
    // Create initial textures
    const pos0 = gpu.createTexture();
    const vel0 = gpu.createTexture();
    
    // Seed positions (sphere) and velocities (zero)
    const posArray = pos0.image.data!;
    const velArray = vel0.image.data!;
    
    for (let i = 0; i < posArray.length; i += 4) {
      // Random position inside a radius
      const radius = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i + 0] = radius * Math.sin(phi) * Math.cos(theta); // x
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      posArray[i + 2] = radius * Math.cos(phi);                   // z
      posArray[i + 3] = 1.0;                                      // w (life/mass)
      
      velArray[i + 0] = 0;
      velArray[i + 1] = 0;
      velArray[i + 2] = 0;
      velArray[i + 3] = 1.0;
    }
    
    const posVar = gpu.addVariable('texturePosition', positionShader, pos0);
    const velVar = gpu.addVariable('textureVelocity', velocityShader, vel0);
    
    gpu.setVariableDependencies(posVar, [posVar, velVar]);
    gpu.setVariableDependencies(velVar, [posVar, velVar]);
    
    // Add uniforms
    posVar.material.uniforms.delta = { value: 0.0 };
    velVar.material.uniforms.delta = { value: 0.0 };
    velVar.material.uniforms.time = { value: 0.0 };
    velVar.material.uniforms.mousePos = { value: new THREE.Vector3(0, 0, 0) };
    velVar.material.uniforms.mouseRadius = { value: 8.0 };
    
    const error = gpu.init();
    if (error !== null) {
      console.error('GPUCompute init failed:', error);
    }
    
    return { gpu, posVar, velVar };
  }, [gl]);

  // Geometry for rendering
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(SIZE * SIZE * 3);
    const uvs = new Float32Array(SIZE * SIZE * 2);
    
    let p = 0;
    for (let j = 0; j < SIZE; j++) {
      for (let i = 0; i < SIZE; i++) {
        uvs[p++] = i / (SIZE - 1);
        uvs[p++] = j / (SIZE - 1);
      }
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('fboUv', new THREE.BufferAttribute(uvs, 2));
    
    return geo;
  }, []);

  // Material for rendering
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        positionTexture: { value: null },
        color: { value: new THREE.Color('#FF6A2E') } // Ember color
      },
      vertexShader: `
        uniform sampler2D positionTexture;
        attribute vec2 fboUv;
        varying vec2 vUv;
        void main() {
          vUv = fboUv;
          vec4 fboPos = texture2D(positionTexture, fboUv);
          vec4 mvPosition = modelViewMatrix * vec4(fboPos.xyz, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Make particles tiny and elegant
          gl_PointSize = 3.5 * (15.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Very soft, translucent specks of data
          float alpha = smoothstep(0.5, 0.1, dist) * 0.4;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, []);

  // Frame Loop
  const mouse3D = useRef(new THREE.Vector3());
  
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1); 
    gpuCompute.velVar.material.uniforms.time.value = state.clock.elapsedTime;
    gpuCompute.velVar.material.uniforms.delta.value = dt;
    gpuCompute.posVar.material.uniforms.delta.value = dt;
    
    mouse3D.current.set(pointer.x * 15, pointer.y * 15, 0); 
    gpuCompute.velVar.material.uniforms.mousePos.value.lerp(mouse3D.current, 0.1); 
    
    gpuCompute.gpu.compute();
    
    const newPosTexture = gpuCompute.gpu.getCurrentRenderTarget(gpuCompute.posVar).texture;
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.ShaderMaterial).uniforms.positionTexture.value = newPosTexture;
    }
    setPosTexture(newPosTexture);
  });

  return (
    <group>
      <points ref={particlesRef} args={[geometry, material]} frustumCulled={false} />
      <NeuralConnections positionTexture={posTexture} textureSize={SIZE} maxConnections={150} />
    </group>
  );
}
