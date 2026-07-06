// GLSL Shaders for the Neural Network Simulation

// 1. Position Shader: Updates particle positions based on velocities
export const positionShader = `
  uniform float delta;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D(texturePosition, uv);
    vec4 tmpVel = texture2D(textureVelocity, uv);

    vec3 pos = tmpPos.xyz;
    vec3 vel = tmpVel.xyz;

    // Euler integration
    pos += vel * delta;

    // Keep particles loosely bound to a central sphere/volume
    float dist = length(pos);
    if (dist > 15.0) {
      pos = normalize(pos) * 14.9; // Gently push back inside
    }

    gl_FragColor = vec4(pos, 1.0);
  }
`;

// 2. Velocity Shader: Computes forces (Curl noise, wander, cursor gravity)
export const velocityShader = `
  uniform float delta;
  uniform float time;
  uniform vec3 mousePos;
  uniform float mouseRadius;

  // Simplex 3D Noise function (Ashima Arts)
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  // Curl noise for organic movement
  vec3 curlNoise(vec3 p) {
    const float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);

    vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dx + 100.0), snoise(p - dx + 200.0));
    vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dx + 100.0), snoise(p + dx + 200.0));
    vec3 p_y0 = vec3(snoise(p - dy), snoise(p - dy + 100.0), snoise(p - dy + 200.0));
    vec3 p_y1 = vec3(snoise(p + dy), snoise(p + dy + 100.0), snoise(p + dy + 200.0));
    vec3 p_z0 = vec3(snoise(p - dz), snoise(p - dz + 100.0), snoise(p - dz + 200.0));
    vec3 p_z1 = vec3(snoise(p + dz), snoise(p + dz + 100.0), snoise(p + dz + 200.0));

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float divisor = 1.0 / (2.0 * e);
    return normalize(vec3(x, y, z) * divisor);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D(texturePosition, uv);
    vec4 tmpVel = texture2D(textureVelocity, uv);
    
    vec3 pos = tmpPos.xyz;
    vec3 vel = tmpVel.xyz;

    // Organic curl noise flow (slowed down)
    vec3 targetVel = curlNoise(pos * 0.2 + time * 0.05) * 0.5;

    // Center attraction (keeps particles from wandering away infinitely)
    float dist = length(pos);
    vec3 centerDir = -normalize(pos);
    if(dist > 10.0) {
       targetVel += centerDir * (dist - 10.0) * 0.1;
    }

    // Cursor social gravity (Interaction)
    // If mouse is near, pull particles in
    float cursorDist = length(pos - mousePos);
    if(cursorDist < mouseRadius) {
       vec3 attract = normalize(mousePos - pos);
       float strength = (mouseRadius - cursorDist) / mouseRadius;
       targetVel += attract * strength * 1.5;
    }

    // Exclusion zone (typography on the right)
    // Roughly block out x > 3.0, y > -2.0, z around 0
    // We will refine this later. For now, simple bounding sphere push
    vec3 excludeCenter = vec3(6.0, 2.0, 0.0);
    float excludeDist = length(pos - excludeCenter);
    if(excludeDist < 6.0) {
       vec3 push = normalize(pos - excludeCenter);
       float strength = (6.0 - excludeDist) / 6.0;
       targetVel += push * strength * 3.0;
    }

    // Smoothly interpolate current velocity towards target velocity (Verlet-like feel)
    vel += (targetVel - vel) * 0.02;

    // Speed limit
    if(length(vel) > 2.0) {
      vel = normalize(vel) * 2.0;
    }

    gl_FragColor = vec4(vel, 1.0);
  }
`;

// 3. Particle Render Shaders (InstancedMesh points)
export const particleVertexShader = `
  uniform sampler2D positionTexture;
  uniform float time;
  
  varying vec2 vUv;
  varying float vLife;

  void main() {
    vUv = uv;
    
    // Fetch instance position from FBO
    vec4 fboPos = texture2D(positionTexture, instanceMatrix[3].xy); // We'll store UV in the translation matrix for convenience, or pass an instanced attribute.
    
    // Better: pass a dedicated attribute for FBO UV lookup.
    // Assuming attribute vec2 fboUv; is passed to the geometry.
  }
`;

// We'll write the full material using standard THREE.ShaderMaterial logic in the component.
