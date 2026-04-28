import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Sparkles, Text3D, Center, shaderMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

/* ─── Low-end detect ─── */
const isLowEnd = () => {
  if (typeof window === 'undefined') return false;
  const nav = navigator as any;
  return (nav.hardwareConcurrency ?? 4) <= 4 || (nav.deviceMemory ?? 4) <= 2;
};

/* ─── GLSL noise shader for background plane ─── */
const NoiseBgMaterial = shaderMaterial(
  { uTime: 0, uScroll: 0, uResolution: new THREE.Vector2(1, 1) },
  /* vertex */
  `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
  /* fragment — Perlin-like noise + scroll-reactive color */
  `uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
varying vec2 vUv;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}

float cnoise(vec3 P){
  vec3 Pi0=floor(P),Pi1=Pi0+vec3(1.);
  Pi0=mod289(Pi0);Pi1=mod289(Pi1);
  vec3 Pf0=fract(P),Pf1=Pf0-vec3(1.);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz,iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0),ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0*(1./7.),gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);
  vec4 gx1=ixy1*(1./7.),gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
  float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
}

void main(){
  vec2 uv=vUv*2.-1.;
  float t=uTime*0.12;
  float s=uScroll;

  float n1=cnoise(vec3(uv*1.2,t));
  float n2=cnoise(vec3(uv*2.5+0.3,t*1.4+1.0))*0.5;
  float n3=cnoise(vec3(uv*5.0+0.6,t*2.0+2.0))*0.25;
  float n=n1+n2+n3;

  vec3 colA=mix(vec3(0.01,0.01,0.02),vec3(0.04,0.01,0.08),s);
  vec3 colB=mix(vec3(0.03,0.02,0.10),vec3(0.08,0.03,0.18),s);
  vec3 colC=mix(vec3(0.08,0.05,0.22),vec3(0.16,0.06,0.32),s);

  vec3 col=mix(colA,colB,clamp(n*0.5+0.5,0.,1.));
  col=mix(col,colC,clamp(n*n*0.4,0.,1.));

  float glow=1.0-length(uv*0.7);
  glow=clamp(pow(glow,2.0)*0.6,0.,1.);
  vec3 glowCol=mix(vec3(0.15,0.1,0.5),vec3(0.3,0.1,0.6),s);
  col+=glowCol*glow*(0.4+s*0.4);

  float vig=1.0-dot(uv*0.6,uv*0.6);
  col*=clamp(vig,0.,1.);

  gl_FragColor=vec4(col,1.0);
}
`
);
extend({ NoiseBgMaterial });

/* ─── Background shader plane ─── */
function NoiseBg({ scrollPercent }: { scrollPercent: number }) {
  const matRef = useRef<any>(null);
  const { size } = useThree();
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime   = clock.getElapsedTime();
    matRef.current.uScroll = scrollPercent;
    matRef.current.uResolution.set(size.width, size.height);
  });
  return (
    <mesh position={[0, 0, -30]}>
      <planeGeometry args={[200, 200]} />
      {/* @ts-ignore */}
      <noiseBgMaterial ref={matRef} depthWrite={false} />
    </mesh>
  );
}

/* ─── Reactive particle field (scroll velocity) ─── */
function ParticleField({ scrollPercent }: { scrollPercent: number }) {
  const mesh = useRef<THREE.Points>(null);
  const prevScroll = useRef(0);
  const velocityRef = useRef(0);
  const COUNT = 1800;

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const rnd = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      rnd[i * 3 + 0] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
    }
    return [pos, rnd];
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 3));
    return g;
  }, [positions, randoms]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const vel = (scrollPercent - prevScroll.current) * 80;
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, vel, 0.08);
    prevScroll.current = scrollPercent;

    const mat = mesh.current.material as THREE.PointsMaterial;
    mat.size = 0.04 + Math.abs(velocityRef.current) * 0.02;
    mat.opacity = 0.15 + Math.abs(velocityRef.current) * 0.1;

    const pos = geo.attributes.position.array as Float32Array;
    const rnd = geo.attributes.aRandom.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const ri = rnd[i * 3];
      pos[i * 3 + 1] += 0.003 * (1 + ri) + velocityRef.current * 0.002;
      if (pos[i * 3 + 1] > 20) pos[i * 3 + 1] = -20;
      if (pos[i * 3 + 1] < -20) pos[i * 3 + 1] = 20;
      pos[i * 3 + 0] += Math.sin(t * 0.3 + ri * 6.28) * 0.003;
    }
    geo.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = t * 0.02 + scrollPercent * 0.5;
  });

  return (
    <points ref={mesh} geometry={geo}>
      <pointsMaterial
        size={0.05}
        color="#a0aaff"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Orbiting crystalline shapes ─── */
function CrystalShape({ basePos, color, geoType = 'icosa', orbitRadius = 2, orbitSpeed = 1, orbitOffset = 0, scaleBase = 1 }: any) {
  const ref = useRef<THREE.Mesh>(null);
  const low = useMemo(() => isLowEnd(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * orbitSpeed + orbitOffset;
    ref.current.position.x = basePos[0] + Math.sin(t) * orbitRadius;
    ref.current.position.y = basePos[1] + Math.cos(t * 0.7) * orbitRadius * 0.5;
    ref.current.position.z = basePos[2] + Math.cos(t) * orbitRadius;
    ref.current.rotation.x += 0.003;
    ref.current.rotation.y += 0.004;
  });

  const matProps = useMemo(() => ({
    samples: low ? 2 : 4,
    resolution: low ? 128 : 256,
    thickness: 0.6,
    chromaticAberration: 0.04,
    anisotropy: 0.2,
    distortion: 0, distortionScale: 0, temporalDistortion: 0,
    color, roughness: 0.02, transmission: 1 as const, metalness: 0.05, ior: 1.5,
  }), [color, low]);

  return (
    <group ref={ref as any} scale={scaleBase}>
      {geoType === 'icosa'     && <mesh><icosahedronGeometry args={[1.2, 1]} /><MeshTransmissionMaterial {...matProps} /></mesh>}
      {geoType === 'octahedron'&& <mesh><octahedronGeometry args={[1, 0]}   /><MeshTransmissionMaterial {...matProps} /></mesh>}
      {geoType === 'torus'     && <mesh><torusGeometry args={[1, 0.4, low ? 20 : 32, low ? 32 : 48]} /><MeshTransmissionMaterial {...matProps} /></mesh>}
      {geoType === 'infinity'  && (
        <group>
          <mesh rotation={[0,0,Math.PI/4]} position={[0.3,0,0]}>
            <torusGeometry args={[0.5, 0.12, low?8:12, low?20:32]} /><MeshTransmissionMaterial {...matProps} /></mesh>
          <mesh rotation={[0,0,-Math.PI/4]} position={[-0.3,0,0]}>
            <torusGeometry args={[0.5, 0.12, low?8:12, low?20:32]} /><MeshTransmissionMaterial {...matProps} /></mesh>
        </group>
      )}
    </group>
  );
}

/* ─── Energy ring that pulses with scroll ─── */
function EnergyRing({ scrollPercent }: { scrollPercent: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const low = useMemo(() => isLowEnd(), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.4 + scrollPercent * 2;
    ref.current.rotation.z = t * 0.3;
    const s = 1 + scrollPercent * 3 + Math.sin(t * 2) * 0.1;
    ref.current.scale.setScalar(s);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.25 - scrollPercent * 0.3 + Math.sin(t*3)*0.05);
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[3, 0.015, 8, low ? 64 : 128]} />
      <meshBasicMaterial color="#6366f1" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─── Floating debris — tiny reflective shards ─── */
function FloatingDebris() {
  const group = useRef<THREE.Group>(null);
  const low = useMemo(() => isLowEnd(), []);
  const COUNT = low ? 8 : 18;
  const debris = useMemo(() =>
    Array.from({ length: COUNT }, (_el, _idx) => ({
      pos: [(Math.random()-0.5)*22, (Math.random()-0.5)*14, (Math.random()-0.5)*10-2] as [number,number,number],
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.12,
      axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
    })), [COUNT]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, idx) => {
      const d = debris[idx];
      child.position.y = d.pos[1] + Math.sin(t * d.speed + d.phase) * 0.8;
      child.position.x = d.pos[0] + Math.cos(t * d.speed * 0.7 + d.phase) * 0.4;
      child.rotateOnAxis(d.axis, 0.008 * d.speed);
    });
  });

  return (
    <group ref={group}>
      {debris.map((d, idx) => (
        <mesh key={idx} position={d.pos} scale={d.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={idx % 3 === 0 ? '#8b8fff' : idx % 3 === 1 ? '#c0b8ff' : '#6060cc'}
            metalness={0.9} roughness={0.1}
            emissive={idx % 3 === 0 ? '#4040aa' : '#303080'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Camera path with smooth cubic ease-in-out ─── */
function lerpKeyframes(
  keyframes: { t: number; pos: [number,number,number]; lookAt: [number,number,number] }[],
  scroll: number
) {
  if (scroll <= keyframes[0].t) return keyframes[0];
  if (scroll >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1];
  let fromIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (scroll >= keyframes[i].t && scroll <= keyframes[i + 1].t) { fromIdx = i; break; }
  }
  const from = keyframes[fromIdx];
  const to   = keyframes[fromIdx + 1];
  const raw  = (scroll - from.t) / (to.t - from.t);
  const ease = raw < 0.5
    ? 4 * raw * raw * raw
    : 1 - Math.pow(-2 * raw + 2, 3) / 2;
  return {
    pos:    [0,1,2].map(j => THREE.MathUtils.lerp(from.pos[j],    to.pos[j],    ease)) as [number,number,number],
    lookAt: [0,1,2].map(j => THREE.MathUtils.lerp(from.lookAt[j], to.lookAt[j], ease)) as [number,number,number],
  };
}

const CAMERA_PATH = [
  { t: 0.00, pos: [0,  0,  20] as [number,number,number], lookAt: [0,  0,  0] as [number,number,number] },
  { t: 0.12, pos: [2,  2,  22] as [number,number,number], lookAt: [0,  0,  0] as [number,number,number] },
  { t: 0.25, pos: [-5, 1,  15] as [number,number,number], lookAt: [0,  0,  0] as [number,number,number] },
  { t: 0.38, pos: [-2, -2,  9] as [number,number,number], lookAt: [0, -1, -2] as [number,number,number] },
  { t: 0.52, pos: [6,  -2, 11] as [number,number,number], lookAt: [0,  0,  0] as [number,number,number] },
  { t: 0.65, pos: [4,  3,  14] as [number,number,number], lookAt: [-1, 1,  0] as [number,number,number] },
  { t: 0.80, pos: [-3, 2,  17] as [number,number,number], lookAt: [1,  0,  0] as [number,number,number] },
  { t: 1.00, pos: [0,  1,  19] as [number,number,number], lookAt: [0,  0,  0] as [number,number,number] },
];

function CameraRig({ scrollPercent }: { scrollPercent: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 20));
  const lookVec   = useRef(new THREE.Vector3(0, 0, 0));
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    const sp  = Math.min(Math.max(scrollPercent, 0), 1);
    const kf  = lerpKeyframes(CAMERA_PATH, sp);
    targetPos.current.set(
      kf.pos[0] + mouse.current.x * 0.6,
      kf.pos[1] - mouse.current.y * 0.4,
      kf.pos[2]
    );
    lookVec.current.set(
      kf.lookAt[0] + mouse.current.x * 0.2,
      kf.lookAt[1] - mouse.current.y * 0.2,
      kf.lookAt[2]
    );
    camera.position.lerp(targetPos.current, 0.045);
    camera.lookAt(lookVec.current);
  });
  return null;
}

/* ─── 3D Hero Text ─── */
function HeroText3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const low = useMemo(() => isLowEnd(), []);
  const fontUrl = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const sp = scrollPercent;
    const t  = clock.getElapsedTime();
    const scale = THREE.MathUtils.lerp(isMobile ? 0.6 : 0.8, isMobile ? 1.0 : 1.2, Math.min(sp * 2, 1));
    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, 0.5, sp) + Math.sin(t * 0.5) * 0.08;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0.1, -0.2, sp) + Math.cos(t * 0.4) * 0.05;
    const separation = THREE.MathUtils.lerp(0, 4, sp);
    const floating   = Math.sin(t * 1.5) * 0.2;
    const ja = groupRef.current.children[0];
    const md = groupRef.current.children[1];
    if (ja) { ja.position.y = 2.2 + separation * 0.8 + floating; ja.position.x = Math.sin(t * 0.5) * 0.2; }
    if (md) { md.position.y = -2.2 - separation * 0.8 - floating; md.position.x = Math.cos(t * 0.5) * 0.2; }
    const opacity = sp < 0.04 ? 0 : sp < 0.25 ? THREE.MathUtils.lerp(0, 1, Math.min(1, (sp - 0.04) * 12)) : 1;
    groupRef.current.visible = opacity > 0;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        (child.material as any).opacity = opacity;
        (child.material as any).transparent = true;
        (child.material as any).depthWrite = false;
      }
    });
  });

  const textMatProps = useMemo(() => ({
    samples: low ? 4 : 8, resolution: low ? 256 : 512, thickness: 3.0,
    chromaticAberration: 0.04, anisotropy: 0.15,
    distortion: 0, distortionScale: 0, temporalDistortion: 0,
    color: '#d0d8ff', roughness: 0.05, transmission: 1 as const, metalness: 0,
    ior: 1.35, backside: true,
  }), [low]);

  return (
    <group ref={groupRef}>
      <Center position={[0, 2.2, 0]}>
        <Text3D font={fontUrl} size={isMobile ? 2.5 : 4.2} height={1.2}
          curveSegments={low ? 12 : 24} bevelEnabled bevelThickness={0.2}
          bevelSize={0.1} bevelOffset={0} bevelSegments={low ? 5 : 10}>
          JA
          <MeshTransmissionMaterial {...textMatProps} />
        </Text3D>
      </Center>
      <Center position={[0, -2.2, 0]}>
        <Text3D font={fontUrl} size={isMobile ? 2.5 : 4.2} height={1.2}
          curveSegments={low ? 12 : 24} bevelEnabled bevelThickness={0.2}
          bevelSize={0.1} bevelOffset={0} bevelSegments={low ? 5 : 10}>
          MD
          <MeshTransmissionMaterial {...textMatProps} />
        </Text3D>
      </Center>
    </group>
  );
}

/* ─── Scroll-reactive dynamic lighting ─── */
function DynamicLights({ scrollPercent }: { scrollPercent: number }) {
  const p1 = useRef<THREE.PointLight>(null);
  const p2 = useRef<THREE.PointLight>(null);
  const p3 = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = scrollPercent;
    if (p1.current) {
      p1.current.position.x = Math.sin(t * 0.5) * 10;
      p1.current.position.y = Math.cos(t * 0.4) * 6;
      p1.current.intensity = 4 + s * 6;
      p1.current.color.setHSL(0.65 + s * 0.15, 0.8, 0.5);
    }
    if (p2.current) {
      p2.current.position.x = Math.cos(t * 0.6) * 8;
      p2.current.position.z = Math.sin(t * 0.3) * 5 - 3;
      p2.current.intensity = 3 + s * 4;
      p2.current.color.setHSL(0.75 - s * 0.1, 0.9, 0.4);
    }
    if (p3.current) {
      p3.current.intensity = 1.5 + Math.sin(t * 1.5) * 0.5;
    }
  });
  return (
    <>
      <pointLight ref={p1} position={[-8, 3, -5]} color="#6366f1" intensity={5} distance={35} />
      <pointLight ref={p2} position={[8, -3, -5]} color="#818cf8" intensity={4} distance={28} />
      <pointLight ref={p3} position={[0, 8, 2]}   color="#ffffff" intensity={2} distance={20} />
    </>
  );
}

/* ─── Post-processing with scroll-reactive DoF ─── */
function PostFX({ scrollPercent, low }: { scrollPercent: number; low: boolean }) {
  const dofRef = useRef<any>(null);
  useFrame(() => {
    if (!dofRef.current) return;
    dofRef.current.circleOfConfusionMaterial.uniforms.focusDistance.value =
      THREE.MathUtils.lerp(0.015, 0.005, scrollPercent);
  });
  if (low) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.9} levels={4} intensity={0.3} />
        <Vignette eskil={false} offset={0.1} darkness={1.2} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        ref={dofRef}
        focusDistance={0.015}
        focalLength={0.06}
        bokehScale={2.5}
        height={480}
      />
      <Bloom
        mipmapBlur
        luminanceThreshold={0.8}
        levels={8}
        intensity={0.5}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0008, 0.0008] as any}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.08} darkness={1.3} />
    </EffectComposer>
  );
}

/* ─── Section marker crystals ─── */
function SectionMarkers3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, _idx) => {
      child.scale.setScalar(THREE.MathUtils.lerp(child.scale.x, child.scale.x > 0.5 ? 1 : 0.3, 0.08));
      (child as THREE.Mesh).rotation.x += 0.01;
      (child as THREE.Mesh).rotation.y += 0.015;
    });
  });
  const positions: [number,number,number][] = [[-4,2,-8],[4,1,-10],[-3,-1,-12],[3,0,-15]];
  return (
    <group ref={groupRef}>
      {positions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial
            color={idx%2===0?'#6366f1':'#818cf8'}
            emissive={idx%2===0?'#6366f1':'#818cf8'}
            emissiveIntensity={1.5}
            transparent opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Main scene ─── */
export default function Background3D({ scrollPercent }: { scrollPercent: number }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const low = useMemo(() => isLowEnd(), []);

  const crystalOpacity = scrollPercent < 0.05 ? 0 : Math.min(1, (scrollPercent - 0.05) * 10);
  const sparkleOpacity = scrollPercent < 0.1  ? 0 : Math.min(0.3, (scrollPercent - 0.1) * 1.5);
  const markerOpacity  = scrollPercent < 0.2  ? 0 : Math.min(0.6, (scrollPercent - 0.2) * 3);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 25 : 20], fov: isMobile ? 50 : 40 }}
        dpr={low ? 1 : isMobile ? [1, 1.2] : [1, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: !low,
          alpha: false,
          stencil: false,
          depth: true,
        }}
        frameloop="always"
      >
        <NoiseBg scrollPercent={scrollPercent} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} color="#e2e8f0" />
        <DynamicLights scrollPercent={scrollPercent} />

        <ParticleField scrollPercent={scrollPercent} />

        {!low && <FloatingDebris />}

        <EnergyRing scrollPercent={scrollPercent} />

        <group visible={crystalOpacity > 0}>
          <CrystalShape basePos={[0,1,0]}    color="#c8c8d0" geoType="infinity"   orbitRadius={3} orbitSpeed={0.3} orbitOffset={0}       scaleBase={1.2} />
          <CrystalShape basePos={[0,-1,0]}   color="#a0a0b0" geoType="torus"     orbitRadius={3} orbitSpeed={0.3} orbitOffset={Math.PI}  scaleBase={1.0} />
          <CrystalShape basePos={[3,2,-4]}   color="#6366f1" geoType="icosa"     orbitRadius={2} orbitSpeed={0.5} orbitOffset={1}        scaleBase={0.6} />
          <CrystalShape basePos={[-3,-2,-4]} color="#818cf8" geoType="octahedron" orbitRadius={2} orbitSpeed={0.5} orbitOffset={3}        scaleBase={0.5} />
        </group>

        {!low && (
          <group visible={sparkleOpacity > 0}>
            <Sparkles count={isMobile ? 40 : 80} scale={28} size={0.9} speed={0.2} color="#ffffff" opacity={sparkleOpacity} />
          </group>
        )}

        <HeroText3D scrollPercent={scrollPercent} />

        <group visible={markerOpacity > 0}>
          <SectionMarkers3D scrollPercent={scrollPercent} />
        </group>

        <Environment preset="night" />
        <CameraRig scrollPercent={scrollPercent} />

        <PostFX scrollPercent={scrollPercent} low={low} />
      </Canvas>
    </div>
  );
}
