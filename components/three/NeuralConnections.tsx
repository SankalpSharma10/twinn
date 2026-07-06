'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeuralConnectionsProps {
  positionTexture: THREE.Texture | null;
  textureSize: number; // 64
  maxConnections: number; // How many particles cast lines (e.g., 32 => 1024 connections max)
}

export function NeuralConnections({ positionTexture, textureSize, maxConnections }: NeuralConnectionsProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate geometry for lines
  // We pair every particle (up to maxConnections) with every other particle (up to maxConnections)
  const geometry = useMemo(() => {
    const maxActive = Math.min(maxConnections, textureSize * textureSize);
    // Number of lines = N * (N-1) / 2
    const numLines = (maxActive * (maxActive - 1)) / 2;
    
    // Each line has 2 vertices
    const positions = new Float32Array(numLines * 2 * 3);
    const uvs = new Float32Array(numLines * 2 * 2); // To look up particle A and B in FBO
    
    let lineIdx = 0;
    
    for (let i = 0; i < maxActive; i++) {
      for (let j = i + 1; j < maxActive; j++) {
        // UV for particle A
        const uA = (i % textureSize) / (textureSize - 1);
        const vA = Math.floor(i / textureSize) / (textureSize - 1);
        
        // UV for particle B
        const uB = (j % textureSize) / (textureSize - 1);
        const vB = Math.floor(j / textureSize) / (textureSize - 1);
        
        // Vertex 1 (Particle A)
        uvs[lineIdx * 4 + 0] = uA;
        uvs[lineIdx * 4 + 1] = vA;
        // Also store the *other* particle's UV so we can calculate distance in the vertex shader
        uvs[lineIdx * 4 + 2] = uB;
        uvs[lineIdx * 4 + 3] = vB;
        
        // Vertex 2 (Particle B)
        uvs[lineIdx * 4 + 4] = uB;
        uvs[lineIdx * 4 + 5] = vB;
        uvs[lineIdx * 4 + 6] = uA;
        uvs[lineIdx * 4 + 7] = vA;
        
        lineIdx++;
      }
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('lineUv', new THREE.BufferAttribute(uvs, 4)); // xy = my UV, zw = target UV
    
    return geo;
  }, [textureSize, maxConnections]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        positionTexture: { value: positionTexture },
        maxDistance: { value: 6.0 }, // Increased from 2.5 so lines actually form across the 10-unit radius
        color: { value: new THREE.Color('#FF6A2E') } 
      },
      vertexShader: `
        uniform sampler2D positionTexture;
        uniform float maxDistance;
        
        attribute vec4 lineUv; // xy = my UV, zw = target UV
        
        varying float vOpacity;
        
        void main() {
          vec4 posA = texture2D(positionTexture, lineUv.xy);
          vec4 posB = texture2D(positionTexture, lineUv.zw);
          
          float dist = distance(posA.xyz, posB.xyz);
          
          // If too far, collapse the line to the origin so it doesn't render,
          // or just fade it out completely.
          if (dist > maxDistance) {
            vOpacity = 0.0;
            gl_Position = vec4(0.0);
            return;
          }
          
          // Opacity based on distance (closer = stronger)
          vOpacity = 1.0 - (dist / maxDistance);
          // Keep the lines crisp and visible
          vOpacity = pow(vOpacity, 1.2) * 0.9; // Max opacity 0.9
          
          vec4 mvPosition = modelViewMatrix * vec4(posA.xyz, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vOpacity;
        
        void main() {
          if (vOpacity < 0.01) discard;
          gl_FragColor = vec4(color, vOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
  }, [positionTexture]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.positionTexture.value = positionTexture;
    }
  });

  return (
    <lineSegments args={[geometry, material]} frustumCulled={false} />
  );
}
