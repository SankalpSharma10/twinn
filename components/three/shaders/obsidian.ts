export const obsidianVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  uniform float time;

  // Curl noise for displacement
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  vec3 snoise3(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

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
    return 42.0 * vec3( dot( m, vec4( p0.x, p1.x, p2.x, p3.x ) ),
                        dot( m, vec4( p0.y, p1.y, p2.y, p3.y ) ),
                        dot( m, vec4( p0.z, p1.z, p2.z, p3.z ) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // 7-second sine wave breathing + 3 octaves of curl noise
    float breathe = sin(time * (3.14159 * 2.0 / 7.0)) * 0.004;
    vec3 noiseDisp = snoise3(position * 2.0 + time * 0.1) * 0.02;
    vec3 displacedPosition = position + normal * (breathe + noiseDisp.x);

    vPosition = (modelMatrix * vec4(displacedPosition, 1.0)).xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const obsidianFragmentShader = `
  uniform vec3 colorPlatinum; // #E8D9B5
  uniform float time;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  // Simple SSS approximation via wrap lighting
  float wrapLighting(float dotNL, float wrap) {
    return max(0.0, (dotNL + wrap) / (1.0 + wrap));
  }

  void main() {
    // Base obsidian color (Graphite / Void)
    vec3 baseColor = vec3(0.05, 0.07, 0.09);

    // View direction
    vec3 viewDir = normalize(vViewPosition);

    // Fake lighting (in reality, we should use ShaderMaterial with lights: true, 
    // but for supreme control we can hand-calculate the key and rim light in the shader, 
    // or use MeshStandardMaterial.onBeforeCompile. We will do a robust custom PBR here).
    
    // Key light (34deg above horizon, left)
    vec3 keyLightDir = normalize(vec3(-1.0, 0.674, 1.0));
    float keyNdotL = max(dot(vNormal, keyLightDir), 0.0);
    
    // Rim light (behind, cyan-white ion)
    vec3 rimLightDir = normalize(vec3(0.0, 0.0, -1.0));
    float rimNdotL = max(dot(vNormal, rimLightDir), 0.0);
    float rimFresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    
    // SSS (Subsurface scattering) - tinted platinum, glows from within
    float sss = wrapLighting(keyNdotL, 0.5) * 0.03;
    vec3 sssColor = colorPlatinum * sss;

    // Specular (Clearcoat)
    vec3 halfVector = normalize(keyLightDir + viewDir);
    float NdotH = max(dot(vNormal, halfVector), 0.0);
    float specular = pow(NdotH, 128.0) * 0.8; // High gloss

    // Combine
    vec3 finalColor = baseColor * 0.1 + (sssColor) + (vec3(1.0) * specular);
    
    // Rim light pop (signature knife-thin separation)
    finalColor += vec3(0.77, 0.92, 1.0) * rimNdotL * rimFresnel * 1.5;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
