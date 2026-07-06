export const horizonVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const horizonFragmentShader = `
  uniform float progress; // 0 to 1 drawing across the screen
  uniform float time;
  uniform vec3 colorPlatinum;
  uniform vec3 colorIon;

  varying vec2 vUv;

  // Simple noise
  float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
  float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    // vUv.x goes from 0 to 1 across the screen
    // Draw the line based on progress
    if (vUv.x > progress) {
      discard;
    }

    // Y thickness falloff (Fresnel-like)
    // vUv.y is 0 to 1. Center is 0.5.
    float distToCenter = abs(vUv.y - 0.5) * 2.0;
    
    // Heat shimmer displacement
    float shimmer = noise(vec2(vUv.x * 20.0 - time * 2.0, time)) * 0.1;
    distToCenter += shimmer;

    // Extremely sharp falloff for a knife-thin filament
    float alpha = pow(1.0 - clamp(distToCenter, 0.0, 1.0), 12.0);

    // Chromatic aberration at the edges
    vec3 color = mix(colorPlatinum, colorIon, alpha);
    
    // Boost for anamorphic bloom
    color *= 2.0;

    gl_FragColor = vec4(color, alpha);
  }
`;
