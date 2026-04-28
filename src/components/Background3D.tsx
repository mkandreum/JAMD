import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Sparkles, Text3D, Center } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── Detect low-end device ── */
const isLowEnd = () => {
  if (typeof window === 'undefined') return false;
  const nav = navigator as any;
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  return cores <= 4 || mem <= 2;
};

/* ── Orbiting crystalline shape ── */
function CrystalShape({
  basePos, color, geoType = 'icosa',
  orbitRadius = 2, orbitSpeed = 1, orbitOffset = 0, scaleBase = 1,
}: any) {
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
    samples: low ? 2 : 3,
    resolution: low ? 128 : 256,
    thickness: 0.6,
    chromaticAberration: 0.03,
    anisotropy: 0.15,
    distortion: 0, distortionScale: 0, temporalDistortion: 0,
    color, roughness: 0.02, transmission: 1 as const, metalness: 0.05, ior: 1.5,
  }), [color, low]);

  return (
    <group ref={ref as any} scale={scaleBase}>
      {geoType === 'icosa' && (
        <mesh><icosahedronGeometry args={[1.2, 1]} /><MeshTransmissionMaterial {...matProps} /></mesh>
      )}
      {geoType === 'octahedron' && (
        <mesh><octahedronGeometry args={[1, 0]} /><MeshTransmissionMaterial {...matProps} /></mesh>
      )}
      {geoType === 'torus' && (
        <mesh><torusGeometry args={[1, 0.4, low ? 20 : 32, low ? 32 : 48]} /><MeshTransmissionMaterial {...matProps} /></mesh>
      )}
      {geoType === 'infinity' && (
        <group>
          <mesh rotation={[0, 0, Math.PI / 4]} position={[0.3, 0, 0]}>
            <torusGeometry args={[0.5, 0.12, low ? 8 : 12, low ? 20 : 32]} />
            <MeshTransmissionMaterial {...matProps} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.3, 0, 0]}>
            <torusGeometry args={[0.5, 0.12, low ? 8 : 12, low ? 20 : 32]} />
            <MeshTransmissionMaterial {...matProps} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/* ── Keyframe interpolation (smooth-step) ── */
function lerpKeyframes(
  keyframes: { t: number; pos: [number, number, number]; lookAt: [number, number, number] }[],
  scroll: number
) {
  if (scroll <= keyframes[0].t) return keyframes[0];
  if (scroll >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1];
  let fromIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (scroll >= keyframes[i].t && scroll <= keyframes[i + 1].t) { fromIdx = i; break; }
  }
  const from = keyframes[fromIdx];
  const to = keyframes[fromIdx + 1];
  const alpha = (scroll - from.t) / (to.t - from.t);
  const ease = alpha * alpha * (3 - 2 * alpha);
  return {
    pos: [
      THREE.MathUtils.lerp(from.pos[0], to.pos[0], ease),
      THREE.MathUtils.lerp(from.pos[1], to.pos[1], ease),
      THREE.MathUtils.lerp(from.pos[2], to.pos[2], ease),
    ] as [number, number, number],
    lookAt: [
      THREE.MathUtils.lerp(from.lookAt[0], to.lookAt[0], ease),
      THREE.MathUtils.lerp(from.lookAt[1], to.lookAt[1], ease),
      THREE.MathUtils.lerp(from.lookAt[2], to.lookAt[2], ease),
    ] as [number, number, number],
  };
}

const CAMERA_PATH = [
  { t: 0.00, pos: [0,  0,  20] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.15, pos: [0,  3,  22] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.30, pos: [-6, 2,  14] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.50, pos: [-2, -1,  8] as [number,number,number], lookAt: [0, 0, -2] as [number,number,number] },
  { t: 0.70, pos: [5,  -3,  10] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.85, pos: [3,  2,  15] as [number,number,number], lookAt: [0, 1, 0] as [number,number,number] },
  { t: 1.00, pos: [0,  1,  18] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
];

function CameraRig({ scrollPercent }: { scrollPercent: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 20));
  const lookVec   = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const sp = Math.min(Math.max(scrollPercent, 0), 1);
    const kf = lerpKeyframes(CAMERA_PATH, sp);
    targetPos.current.set(...kf.pos);
    lookVec.current.set(...kf.lookAt);
    camera.position.lerp(targetPos.current, 0.04);
    camera.lookAt(lookVec.current);
  });
  return null;
}

/* ── 3D Hero Text ── */
function HeroText3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const low = useMemo(() => isLowEnd(), []);
  const fontUrl = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const sp = scrollPercent;
    const t = clock.getElapsedTime();
    const scale = THREE.MathUtils.lerp(isMobile ? 0.6 : 0.8, isMobile ? 1.0 : 1.2, Math.min(sp * 2, 1));
    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, 0.5, sp) + Math.sin(t * 0.5) * 0.08;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(0.1, -0.2, sp) + Math.cos(t * 0.4) * 0.05;
    const separation = THREE.MathUtils.lerp(0, 4, sp);
    const floating = Math.sin(t * 1.5) * 0.2;
    const ja = groupRef.current.children[0];
    const md = groupRef.current.children[1];
    if (ja) { ja.position.y = 2.2 + separation * 0.8 + floating; ja.position.x = Math.sin(t * 0.5) * 0.2; }
    if (md) { md.position.y = -2.2 - separation * 0.8 - floating; md.position.x = Math.cos(t * 0.5) * 0.2; }
    let opacity = sp < 0.04 ? 0 : sp < 0.25 ? THREE.MathUtils.lerp(0, 1, Math.min(1, (sp - 0.04) * 12)) : 1;
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
    chromaticAberration: 0.03, anisotropy: 0.1,
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

/* ── Section Markers ── */
function SectionMarkers3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const sectionStart = i * 0.25;
      const isActive = scrollPercent > sectionStart && scrollPercent < sectionStart + 0.3;
      (child as THREE.Mesh).scale.setScalar(isActive ? 1 : 0.3);
      (child as THREE.Mesh).rotation.x += 0.01;
      (child as THREE.Mesh).rotation.y += 0.015;
    });
  });
  const markerPositions: [number, number, number][] = [[-4,2,-8],[4,1,-10],[-3,-1,-12],[3,0,-15]];
  return (
    <group ref={groupRef}>
      {markerPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial color={i%2===0?'#6366f1':'#818cf8'} emissive={i%2===0?'#6366f1':'#818cf8'}
            emissiveIntensity={1} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Main Scene ── */
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
        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', isMobile ? 15 : 12, isMobile ? 40 : 35]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e2e8f0" />
        <pointLight position={[-8, 3, -5]} color="#6366f1" intensity={5} distance={30} />
        <pointLight position={[8, -3, -5]} color="#818cf8" intensity={4} distance={25} />
        {!low && <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />}

        {/* Crystal shapes */}
        <group visible={crystalOpacity > 0}>
          <CrystalShape basePos={[0,1,0]}   color="#c8c8d0" geoType="infinity"   orbitRadius={3} orbitSpeed={0.3} orbitOffset={0}        scaleBase={1.2} />
          <CrystalShape basePos={[0,-1,0]}  color="#a0a0b0" geoType="torus"     orbitRadius={3} orbitSpeed={0.3} orbitOffset={Math.PI}  scaleBase={1} />
          <CrystalShape basePos={[3,2,-4]}  color="#6366f1" geoType="icosa"     orbitRadius={2} orbitSpeed={0.5} orbitOffset={1}        scaleBase={0.6} />
          <CrystalShape basePos={[-3,-2,-4]}color="#818cf8" geoType="octahedron" orbitRadius={2} orbitSpeed={0.5} orbitOffset={3}        scaleBase={0.5} />
        </group>

        {/* Sparkles — skip on low-end */}
        {!low && (
          <group visible={sparkleOpacity > 0}>
            <Sparkles count={isMobile ? 30 : 60} scale={25} size={0.8} speed={0.15} color="#ffffff" opacity={sparkleOpacity} />
          </group>
        )}

        <HeroText3D scrollPercent={scrollPercent} />

        <group visible={markerOpacity > 0}>
          <SectionMarkers3D scrollPercent={scrollPercent} />
        </group>

        <Environment preset="night" />
        <CameraRig scrollPercent={scrollPercent} />

        <EffectComposer multisampling={low ? 0 : 4}>
          <Bloom mipmapBlur luminanceThreshold={1} levels={low ? 4 : 8} intensity={0.4} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
