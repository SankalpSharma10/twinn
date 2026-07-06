export const inkVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const inkFragmentShader = `
  uniform float time;
  uniform float progress; // 0 to 1 for the inhale phase
  uniform vec3 colorGraphite; // #0E1218
  uniform vec3 colorVoid;     // #05070C
  
  varying vec2 vUv;

  // Simple noise for fluid-like diffusion
  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
  float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    // Center of screen
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);
    
    // The ink bloom expands based on progress
    // We add noise to the distance to make it fluid-like
    float n = noise(vUv * 10.0 - time * 0.5) * 0.2;
    float fluidDist = dist + n;

    // Ink threshold
    float inkMask = smoothstep(progress * 0.8, progress * 0.8 - 0.2, fluidDist);

    // Mix void and graphite
    vec3 color = mix(colorVoid, colorGraphite, inkMask);

    // Fade entire effect out as progress approaches 1 (to reveal the scene behind it)
    float alpha = smoothstep(1.0, 0.9, progress);

    gl_FragColor = vec4(color, alpha);
  }
`;
