'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Config ──────────────────────────────────────────────────────────────── */
const N     = 5000;
const CYCLE = 35; // total seconds per loop (must match shader CYCLE)

/* ─── Position generators ─────────────────────────────────────────────────── */
function genScatter(): Float32Array {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    a[i*3]   = (Math.random() - 0.5) * 24;
    a[i*3+1] = (Math.random() - 0.5) * 13;
    a[i*3+2] = (Math.random() - 0.5) * 6;
  }
  return a;
}

function genSphere(r = 2.4): Float32Array {
  const a   = new Float32Array(N * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < N; i++) {
    const y   = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t   = phi * i;
    a[i*3]   = Math.cos(t) * rad * r;
    a[i*3+1] = y * r;
    a[i*3+2] = Math.sin(t) * rad * r;
  }
  return a;
}

function sampleText(): Float32Array {
  const W = 1800, H = 380;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.font      = `900 ${Math.floor(H * 0.72)}px Arial, sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('twinn', W / 2, H / 2);

  const data   = ctx.getImageData(0, 0, W, H).data;
  const bright: number[] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (data[(y * W + x) * 4] > 128) bright.push(x, y);

  const total = bright.length / 2;
  const pos   = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const idx   = Math.floor(Math.random() * total) * 2;
    pos[i*3]   = ((bright[idx]     / W) - 0.5) * 18;
    pos[i*3+1] = -((bright[idx + 1] / H) - 0.5) * 4;
    pos[i*3+2] = (Math.random() - 0.5) * 0.3;
  }
  return pos;
}

/* ─── Vertex shader ───────────────────────────────────────────────────────── 
  The entire animation is driven by continuous weight functions — no discrete
  phase switching. All weights are smooth, overlap cleanly, and return exactly
  zero at t=0 and t=CYCLE so the loop is invisible.
  
  TIMELINE (35 s):
  t 00–04.5  : freeflow tail / ambient drift (small amplitude)
  t 04.5–08  : gather weight rises           → sphere forms
  t 08–11    : sphere holds, slow rotation
  t 11–14.5  : burst sine-bump peaks at 12.75 (×4.5 radius)
  t 13–16.5  : text weight rises             → text forms from burst chaos
  t 16.5–21  : text holds
  t 21–25    : text weight fades             → particles disperse
  t 25–28    : freeflow amplitude ramps UP
  t 28–32    : freeflow peak (large organic drift)
  t 32–35    : amplitude ramps back DOWN  → seamlessly loops
──────────────────────────────────────────────────────────────────────────── */
const vert = /* glsl */`
  const float CYCLE = 35.0;
  const float PI    = 3.14159265359;

  attribute vec3  aPosA;  // scatter / home positions
  attribute vec3  aPosB;  // fibonacci-sphere positions
  attribute vec3  aPosC;  // canvas-sampled text positions
  attribute float aRand;  // [0, 1] per-particle seed

  uniform float uTime;    // ever-increasing clock — NEVER reset or modulo'd in JS

  void main() {
    float seed  = aRand * PI * 2.0;
    float loopT = mod(uTime, CYCLE);

    /*  Each particle has its own slightly-offset local time.
        Window = 0.9 s → natural ripple/stagger on every transition.        */
    float pt = loopT - aRand * 0.9;

    /* ── 1. Sphere attraction weight ─────────────────────────────────────
       Soft rise over 3.5 s, holds through the burst window,
       then soft release — no pop, no snap.                                */
    float sw = smoothstep(4.5,  8.0,  pt)
             * (1.0 - smoothstep(14.5, 17.0, pt));

    /* ── 2. Burst scale ───────────────────────────────────────────────────
       A 3.5-second sine dome centred at t ≈ 12.75.
       Grows from ×1 → ×4.5 → ×1. Sphere weight is still high so
       particles truly fly outward before being caught by text gravity.    */
    float burstT = clamp((pt - 11.0) / 3.5, 0.0, 1.0);
    float bust   = 1.0 + sin(burstT * PI) * 3.5;

    /* ── 3. Text attraction weight ────────────────────────────────────────
       Rises while burst is still active (overlap = beautiful chaos→order).
       Holds 4.5 s, then slow soft release.                                */
    float tw = smoothstep(13.0, 16.5, pt)
             * (1.0 - smoothstep(21.0, 25.0, pt));

    /* ── 4. Freeflow drift amplitude ─────────────────────────────────────
       Uses loopT (un-staggered) so the field breathes as one.
       Ramps to peak between t=28–32, back to baseline by t=35 = 0.
       At t=0 and t=35, ffPeak = 0 → amplitude = 0.35 → seamless loop.   */
    float ffPeak = smoothstep(25.0, 28.0, loopT)
                 * (1.0 - smoothstep(32.0, 35.0, loopT));
    float dA     = mix(0.35, 2.2, ffPeak);

    /* ── 5. Drift / freeflow position ─────────────────────────────────────
       Two overlapping sin/cos waves per axis → Lissajous-like organics.
       Uses absolute uTime so oscillation is continuous across loop seams. */
    vec3 driftPos = aPosA + vec3(
      (sin(uTime * 0.17 + seed)           + cos(uTime * 0.11 + seed * 1.7) * 0.5) * dA,
      (cos(uTime * 0.14 + seed + 1.047)   + sin(uTime * 0.09 + seed * 1.3) * 0.4) * dA * 0.8,
       sin(uTime * 0.19 + seed + 2.094)                                             * dA * 0.3
    );

    /* ── 6. Sphere position with slow Y-rotation ─────────────────────────*/
    float ang = uTime * 0.22;
    float ca  = cos(ang), sa = sin(ang);
    vec3 sRot     = vec3(ca * aPosB.x - sa * aPosB.z,
                         aPosB.y,
                         sa * aPosB.x + ca * aPosB.z);
    vec3 spherePos = sRot * bust;

    /* ── 7. Text position — near-static with sub-pixel micro-drift ────── */
    vec3 textPos = aPosC + vec3(
      sin(uTime * 0.06 + seed) * 0.007,
      cos(uTime * 0.05 + seed) * 0.007,
      0.0
    );

    /* ── 8. Continuous three-way blend ────────────────────────────────────
       drift ← sphere (sw) → then whole thing ← text (tw).
       Because sw and tw are continuous smooth curves with natural overlap,
       there are no hard transitions anywhere in the timeline.             */
    vec3 pos = mix(
      mix(driftPos, spherePos, sw),
      textPos,
      tw
    );

    /* ── 9. Point size: larger when drifting, crisper in text ─────────── */
    vec4 mv   = modelViewMatrix * vec4(pos, 1.0);
    float ptSz = mix(2.7, 1.8, smoothstep(0.0, 0.6, tw));
    gl_PointSize = ptSz * (15.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

/* ─── Fragment shader ─────────────────────────────────────────────────────── */
const frag = /* glsl */`
  void main() {
    vec2  uv = 2.0 * gl_PointCoord - 1.0;
    float r  = dot(uv, uv);
    if (r > 1.0) discard;

    // Ember-orange: hot bright core → deep amber at the soft edge
    vec3  col   = mix(vec3(1.00, 0.46, 0.22), vec3(0.72, 0.20, 0.04), r * 0.85);
    float alpha = (1.0 - r) * exp(-r * 1.5);

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ─── Component ───────────────────────────────────────────────────────────── */
export function TwinnParticles() {
  const clockRef = useRef(0);

  const scatterPos = useMemo(genScatter,       []);
  const spherePos  = useMemo(() => genSphere(), []);
  const randSeeds  = useMemo(() => {
    const a = new Float32Array(N);
    for (let i = 0; i < N; i++) a[i] = Math.random();
    return a;
  }, []);

  /* Build geometry, material, and Points object once — never recreated */
  const { geometry, material, points } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(scatterPos,              3));
    geo.setAttribute('aPosA',    new THREE.BufferAttribute(scatterPos,              3));
    geo.setAttribute('aPosB',    new THREE.BufferAttribute(spherePos,               3));
    geo.setAttribute('aPosC',    new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute('aRand',    new THREE.BufferAttribute(randSeeds,               1));

    const mat = new THREE.ShaderMaterial({
      vertexShader:   vert,
      fragmentShader: frag,
      uniforms:    { uTime: { value: 0 } },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat, points: new THREE.Points(geo, mat) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Inject real text positions after mount (requires browser canvas) */
  useEffect(() => {
    const pos  = sampleText();
    const attr = geometry.getAttribute('aPosC') as THREE.BufferAttribute;
    attr.array       = pos;
    attr.needsUpdate = true;
  }, [geometry]);

  /* The only per-frame work: advance one uniform */
  useFrame((_, delta) => {
    clockRef.current           += delta;
    material.uniforms.uTime.value = clockRef.current;
  });

  return <primitive object={points} />;
}
