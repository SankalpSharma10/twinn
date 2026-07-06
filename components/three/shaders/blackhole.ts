// GLSL Shaders for the Black Hole Accretion Disk

export const accretionVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const accretionFragmentShader = `
  uniform float time;
  uniform vec3 colorInner; // e.g. #FFF2E8 (Bone/Bright)
  uniform vec3 colorOuter; // e.g. #FF6A2E (Ember)
  
  varying vec2 vUv;
  varying vec3 vPosition;

  // 2D Simplex Noise by Ian McEwan, Ashima Arts
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractional Brownian Motion for swirling complexity
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Polar coordinates from center
    vec2 center = vec2(0.5, 0.5);
    vec2 uv = vUv - center;
    
    // Stretch to map onto a ring properly if geometry is a flat plane
    // But we will use a RingGeometry, so vUv goes from 0-1 across the ring
    // Actually, RingGeometry vUv.x is angle (0 to 1), vUv.y is radius (0 to 1 inner to outer)
    
    float angle = vUv.x * 3.14159 * 2.0;
    float radius = vUv.y; 

    // Swirl effect
    float swirl = angle + radius * 3.0 - time * 0.5;
    
    // Map to cartesian for noise sampling
    vec2 noiseUV = vec2(cos(swirl), sin(swirl)) * radius * 4.0;
    
    // Compute noise
    float n = fbm(noiseUV - time * 0.2);
    
    // Add glowing streaks
    float streaks = snoise(vec2(angle * 10.0, time * 0.1)) * 0.5 + 0.5;
    n = mix(n, streaks, 0.3);

    // Shaping the ring's alpha profile (fade out at inner and outer edges)
    // radius goes 0 (inner edge) to 1 (outer edge)
    float edgeFade = smoothstep(0.0, 0.2, radius) * smoothstep(1.0, 0.8, radius);
    
    // Brightness profile
    float brightness = (n * 0.5 + 0.5) * edgeFade;
    
    // Color mapping: hotter (inner color) where brightness is high, cooler (outer) where low
    vec3 finalColor = mix(colorOuter, colorInner, smoothstep(0.3, 0.8, brightness));
    
    // Boost intensity slightly for bloom, but keep it elegant and constrained
    finalColor *= 1.2;

    // Much softer alpha so it looks like ethereal plasma
    gl_FragColor = vec4(finalColor, brightness * 0.4);
  }
`;
