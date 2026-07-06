'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// 23.5° — Earth's real axial tilt
const AXIAL_TILT   = 23.5 * (Math.PI / 180);
const EARTH_RADIUS = 3.2;

/* ─── Procedural Earth: vertex shader ─────────────────────────────────────── */
const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPos;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vPosition = position;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ─── Procedural Earth: fragment shader ───────────────────────────────────── */
const fragmentShader = /* glsl */`
  uniform float time;
  uniform vec3  sunDir;      // world-space direction to the sun

  varying vec3 vNormal;
  varying vec3 vPosition;    // local-space position (normalised = on unit sphere)
  varying vec3 vWorldPos;

  // ── Noise helpers (all 3-D, so no UV polar seam) ────────────────────────
  vec3 hash3(vec3 p) {
    p = fract(p * vec3(443.8975, 397.2973, 491.1871));
    p += dot(p.zxy, p.yxz + 19.19);
    return fract(vec3(p.x * p.y, p.y * p.z, p.z * p.x) * 2.0) * 2.0 - 1.0;
  }

  float gnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(
      mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
              dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
          mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
              dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
      mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
              dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
          mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
              dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
  }

  // Fractal Brownian Motion — 6 octaves for detail
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
      v += a * gnoise(p);
      p  = p * 2.1 + vec3(1.7, 9.2, 3.4);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Normalised sphere-surface position used as noise input (no UV seam)
    vec3 n = normalize(vPosition);

    // ── Land / ocean mask ───────────────────────────────────────────────
    float landNoise = fbm(n * 2.8 + vec3(2.3, 1.7, 4.1));
    float landMask  = smoothstep(-0.04, 0.18, landNoise);

    // ── Ocean colours ────────────────────────────────────────────────────
    vec3 deepOcean    = vec3(0.01, 0.05, 0.22);
    vec3 shallowOcean = vec3(0.03, 0.14, 0.40);
    float shallowMix  = smoothstep(-0.35, 0.04, landNoise);
    vec3 oceanColor   = mix(deepOcean, shallowOcean, shallowMix);

    // ── Land colours (3 biomes blended via a second noise layer) ─────────
    float biomeNoise = fbm(n * 5.5 + vec3(4.1, 3.3, 2.0));
    vec3 forest   = vec3(0.08, 0.22, 0.06);
    vec3 grassland = vec3(0.19, 0.33, 0.08);
    vec3 desert   = vec3(0.54, 0.43, 0.20);
    vec3 landColor = mix(
      mix(forest, grassland, smoothstep(-0.1, 0.25, biomeNoise)),
      desert, smoothstep(0.15, 0.50, biomeNoise)
    );

    // ── Polar ice caps (blend by latitude using local-space Y) ───────────
    float lat       = abs(n.y);
    float poleMask  = smoothstep(0.65, 0.85, lat);
    vec3  iceColor  = vec3(0.90, 0.94, 1.00);

    // ── Base surface colour ───────────────────────────────────────────────
    vec3 surface = mix(oceanColor, landColor, landMask);
    surface      = mix(surface, iceColor, poleMask);

    // ── Cloud layer (separate FBM, slow drift over time) ─────────────────
    float cloudNoise = fbm(n * 3.2 + vec3(time * 0.008, 0.0, time * 0.004));
    float cloudMask  = smoothstep(0.10, 0.36, cloudNoise);
    vec3  cloudColor = vec3(0.92, 0.95, 1.00);
    surface = mix(surface, cloudColor, cloudMask * 0.92);

    // ── Diffuse lighting ─────────────────────────────────────────────────
    float diff    = max(0.0, dot(vNormal, sunDir));
    float ambient = 0.055;                         // faint starlight on dark side
    float light   = ambient + diff * 0.945;

    // ── Ocean specular (Blinn-Phong) — suppressed on land & ice & clouds ─
    vec3  viewDir = normalize(cameraPosition - vWorldPos);
    vec3  halfVec = normalize(sunDir + viewDir);
    float NdotH   = max(0.0, dot(vNormal, halfVec));
    float specMask = (1.0 - landMask) * (1.0 - poleMask) * (1.0 - cloudMask);
    float spec     = pow(NdotH, 72.0) * specMask * 0.90;

    // ── Compose ──────────────────────────────────────────────────────────
    vec3 color = surface * light + vec3(0.35, 0.55, 1.00) * spec;

    // ── Atmospheric limb (Fresnel rim glow) ─────────────────────────────
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 4.0);
    color += vec3(0.15, 0.40, 1.00) * fresnel * 0.45 * (0.2 + diff * 0.8);

    // ── Terminator softening (dark side stays visible, not pure black) ───
    color = mix(color, color * 0.18, smoothstep(0.08, -0.12, diff));

    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── Atmosphere glow shell ───────────────────────────────────────────────── */
const atmosVert = /* glsl */`
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosFrag = /* glsl */`
  uniform vec3 sunDir;
  varying vec3 vNormal;
  void main() {
    // Limb glow: bright on sun-side, dimmer on shadow
    float rim  = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 2.5);
    float lit  = max(0.0, dot(vNormal, sunDir)) * 0.5 + 0.5;
    vec3  color = mix(vec3(0.05, 0.15, 0.60), vec3(0.25, 0.55, 1.0), lit);
    gl_FragColor = vec4(color, rim * 0.35);
  }
`;

/* ─── Earth scene ─────────────────────────────────────────────────────────── */
export function GlassSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const posX = -viewport.width * 0.35;

  // Sun direction (upper-right, matches the directional light)
  const sunDir = useMemo(() => new THREE.Vector3(15, 10, 12).normalize(), []);

  const earthUniforms = useMemo(() => ({
    time:   { value: 0 },
    sunDir: { value: sunDir },
  }), [sunDir]);

  const atmosUniforms = useMemo(() => ({
    sunDir: { value: sunDir },
  }), [sunDir]);

  useFrame((_, delta) => {
    earthUniforms.time.value += delta;
    if (groupRef.current) {
      // Steady planetary spin on the tilted axis
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <>
      {/* Sun-like directional key light */}
      <directionalLight position={[15, 10, 12]} intensity={3.0} color="#fff8f2" />
      {/* Faint cool ambient — city lights / starlight on dark side */}
      <ambientLight intensity={0.06} color="#aaccff" />

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.5}>
        {/* 
          Outer group: positions + applies the permanent 23.5° axial tilt.
          groupRef spins on its LOCAL Y axis (= the tilted north pole).
        */}
        <group position={[posX, 0, 0]} rotation={[0, 0, AXIAL_TILT]}>
          <group ref={groupRef}>

            {/* ── Procedural Earth surface ─── */}
            <mesh>
              <sphereGeometry args={[EARTH_RADIUS, 256, 256]} />
              <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={earthUniforms}
              />
            </mesh>

            {/* ── Outer atmosphere shell (BackSide glow) ─── */}
            <mesh>
              <sphereGeometry args={[EARTH_RADIUS + 0.32, 64, 64]} />
              <shaderMaterial
                vertexShader={atmosVert}
                fragmentShader={atmosFrag}
                uniforms={atmosUniforms}
                transparent
                depthWrite={false}
                side={THREE.BackSide}
              />
            </mesh>

          </group>
        </group>
      </Float>
    </>
  );
}
