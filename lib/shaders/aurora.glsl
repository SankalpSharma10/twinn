
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Simplex noise helper
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 acesFilm(vec3 x) {
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse * 0.03; // max 3% displacement
  
  // Mouse parallax distortion
  uv += mouse * (0.5 - uv);

  float t = uTime * 0.15;

  // Layer 1 — broad slow aurora wave
  float n1 = snoise(vec3(uv * 1.5, t * 0.4)) * 0.5 + 0.5;
  // Layer 2 — finer detail
  float n2 = snoise(vec3(uv * 3.0 + vec2(0.3, 0.7), t * 0.6)) * 0.5 + 0.5;
  // Layer 3 — micro turbulence
  float n3 = snoise(vec3(uv * 6.0 + vec2(0.9, 0.2), t * 1.2)) * 0.5 + 0.5;

  float combined = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;

  // Ember color palette
  vec3 ink   = vec3(0.031, 0.024, 0.016); // --ink-950
  vec3 ember = vec3(1.0, 0.416, 0.18);    // --ember-500
  vec3 deep  = vec3(0.071, 0.051, 0.031); // --ink-800
  vec3 warm  = vec3(0.91, 0.306, 0.063);  // --ember-600

  // Gradient bands
  vec3 color = mix(ink, deep, n1);
  color = mix(color, warm * 0.3, n2 * combined * 0.7);
  color = mix(color, ember * 0.5, pow(n3 * combined, 2.0) * 0.5);

  // Vignette
  vec2 center = uv - 0.5;
  float vignette = 1.0 - dot(center, center) * 2.0;
  color *= vignette;

  // ACES tonemapping
  color = acesFilm(color);

  gl_FragColor = vec4(color, 1.0);
}
