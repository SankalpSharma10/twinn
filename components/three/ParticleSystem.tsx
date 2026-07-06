'use client';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';

const PARTICLE_COUNT = 500;

function Particles({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D());
  const velocities = useRef<{ x: number; y: number; z: number; life: number }[]>([]);

  useEffect(() => {
    if (active) {
      velocities.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        const elevation = (Math.random() - 0.5) * Math.PI;
        const speed = 2 + Math.random() * 4;
        return {
          x: Math.cos(angle) * Math.cos(elevation) * speed,
          y: Math.sin(elevation) * speed + 1.5,
          z: Math.sin(angle) * Math.cos(elevation) * speed * 0.3,
          life: 1,
        };
      });
    }
  }, [active]);

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return;
    velocities.current.forEach((v, i) => {
      v.y -= 3.5 * delta;  // gravity
      v.x *= 0.98;         // air resistance
      v.z *= 0.98;
      v.life -= delta * 0.5;

      dummy.current.position.x += v.x * delta;
      dummy.current.position.y += v.y * delta;
      dummy.current.position.z += v.z * delta;
      dummy.current.scale.setScalar(Math.max(0, v.life) * 0.04);
      dummy.current.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.current.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const colors = useRef(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = i / PARTICLE_COUNT;
      const c = new THREE.Color().setHSL(0.05 + t * 0.05, 1, 0.5 + t * 0.3);
      arr[i * 3]     = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
}

interface Props {
  active: boolean;
  name: string;
  onDismiss: () => void;
  matchLine: string;
}

export function MatchCelebration({ active, name, onDismiss, matchLine }: Props) {
  const tier = useStore((s) => s.tier);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [active, onDismiss]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9980] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          role="dialog"
          aria-label="Match celebration"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" />

          {/* Particles */}
          {tier > 1 && (
            <div className="absolute inset-0 pointer-events-none">
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Particles active={active} />
              </Canvas>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 text-center px-6">
            <motion.p
              className="caption text-ember-400 tracking-widest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              IT'S A MATCH
            </motion.p>

            <motion.h2
              className="display-xl text-bone-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
            >
              {name}
            </motion.h2>

            <motion.p
              className="body-lg text-bone-300 max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {matchLine}
            </motion.p>

            <motion.button
              onClick={onDismiss}
              className="btn-primary mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              aria-label="Continue swiping"
            >
              Keep going →
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
