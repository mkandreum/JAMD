import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Sparkles, Text3D, Center } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ── Orbiting crystalline shape ── */
function CrystalShape({
  basePos,
  color,
  geoType = 'icosa',
  orbitRadius = 2,
  orbitSpeed = 1,
  orbitOffset = 0,
  floatSpeed = 1,
  scaleBase = 1,
}: any) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * orbitSpeed + orbitOffset;

    ref.current.position.x = basePos[0] + Math.sin(t) * orbitRadius;
    ref.current.position.y = basePos[1] + Math.cos(t * 0.7) * orbitRadius * 0.5;
    ref.current.position.z = basePos[2] + Math.cos(t) * orbitRadius;

    ref.current.rotation.x += 0.003;
    ref.current.rotation.y += 0.004;
    ref.current.rotation.z += 0.001;
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={0.3}>
      <group ref={ref} scale={scaleBase}>
        {geoType === 'icosa' && (
          <mesh>
            <icosahedronGeometry args={[1.2, 1]} />
            <MeshTransmissionMaterial
              samples={3} resolution={256} thickness={0.6}
              chromaticAberration={0.03} anisotropy={0.15}
              distortion={0} distortionScale={0} temporalDistortion={0}
              color={color} roughness={0.02} transmission={1} metalness={0.05} ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'octahedron' && (
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
              samples={3} resolution={256} thickness={0.6}
              chromaticAberration={0.03} anisotropy={0.15}
              distortion={0} distortionScale={0} temporalDistortion={0}
              color={color} roughness={0.02} transmission={1} metalness={0.05} ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'torus' && (
          <mesh>
            <torusGeometry args={[1, 0.4, 32, 48]} />
            <MeshTransmissionMaterial
              samples={3} resolution={256} thickness={0.6}
              chromaticAberration={0.03} anisotropy={0.15}
              distortion={0} distortionScale={0} temporalDistortion={0}
              color={color} roughness={0.02} transmission={1} metalness={0.05} ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'infinity' && (
          <group>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0.3, 0, 0]}>
              <torusGeometry args={[0.5, 0.12, 12, 32]} />
              <MeshTransmissionMaterial
                samples={3} resolution={256} thickness={0.6}
                chromaticAberration={0.03} anisotropy={0.15}
                distortion={0} distortionScale={0} temporalDistortion={0}
                color={color} roughness={0.02} transmission={1} metalness={0.05} ior={1.5}
              />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.3, 0, 0]}>
              <torusGeometry args={[0.5, 0.12, 12, 32]} />
              <MeshTransmissionMaterial
                samples={3} resolution={256} thickness={0.6}
                chromaticAberration={0.03} anisotropy={0.15}
                distortion={0} distortionScale={0} temporalDistortion={0}
                color={color} roughness={0.02} transmission={1} metalness={0.05} ior={1.5}
              />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

/* ── Keyframe interpolation helper ── */
function lerpKeyframes(
  keyframes: { t: number; pos: [number, number, number]; lookAt: [number, number, number] }[],
  scroll: number
) {
  // Clamp
  if (scroll <= keyframes[0].t) return keyframes[0];
  if (scroll >= keyframes[keyframes.length - 1].t) return keyframes[keyframes.length - 1];

  // Find surrounding keyframes
  let fromIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (scroll >= keyframes[i].t && scroll <= keyframes[i + 1].t) {
      fromIdx = i;
      break;
    }
  }
  const from = keyframes[fromIdx];
  const to = keyframes[fromIdx + 1];
  const alpha = (scroll - from.t) / (to.t - from.t);
  // Smooth-step easing
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

/* ── Camera path keyframes ──
   Each keyframe: scroll progress [0..1], camera position, lookAt target
   Phases:
     0.00 → Intro: frontal, distante
     0.15 → JA/MD explosion: sube y se aleja
     0.30 → Orbita lateral izquierda
     0.50 → Plunge hacia adelante (zoom in cinematográfico)
     0.70 → Orbita por debajo
     0.85 → Pull back con tilt
     1.00 → Posición final estabilizada
*/
const CAMERA_PATH = [
  { t: 0.00, pos: [0,  0,  20] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.15, pos: [0,  3,  22] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.30, pos: [-6, 2,  14] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.50, pos: [-2, -1,  8] as [number,number,number], lookAt: [0, 0, -2] as [number,number,number] },
  { t: 0.70, pos: [5,  -3,  10] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
  { t: 0.85, pos: [3,  2,  15] as [number,number,number], lookAt: [0, 1, 0] as [number,number,number] },
  { t: 1.00, pos: [0,  1,  18] as [number,number,number], lookAt: [0, 0, 0] as [number,number,number] },
];

/* ── Camera rig driven by scroll (cinematic path) ── */
function CameraRig({ scrollPercent }: { scrollPercent: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 20));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const sp = Math.min(Math.max(scrollPercent, 0), 1);
    const kf = lerpKeyframes(CAMERA_PATH, sp);

    // Update lerp targets
    targetPos.current.set(...kf.pos);
    targetLook.current.set(...kf.lookAt);

    // Damped follow — 0.04 = smooth cinematic feel, increase for snappier response
    camera.position.lerp(targetPos.current, 0.04);

    // Interpolate lookAt by lerping a temp vector
    const currentLook = new THREE.Vector3();
    currentLook.copy(targetLook.current);
    camera.lookAt(currentLook);
  });

  return null;
}

/* ── 3D Hero Text (Crystal mesh letters) ── */
function HeroText3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const fontUrl = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

  useFrame(({ clock }) => {
    if (groupRef.current) {
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
      
      if (ja) {
        ja.position.y = 2.2 + separation * 0.8 + floating;
        ja.position.x = Math.sin(t * 0.5) * 0.2;
        (ja as THREE.Object3D).rotation.z = Math.sin(t * 0.7) * 0.05;
      }
      if (md) {
        md.position.y = -2.2 - separation * 0.8 - floating;
        md.position.x = Math.cos(t * 0.5) * 0.2;
        (md as THREE.Object3D).rotation.z = Math.cos(t * 0.7) * 0.05;
      }

      let opacity = 0;
      if (sp < 0.04) {
        opacity = 0;
      } else if (sp < 0.25) {
        opacity = THREE.MathUtils.lerp(0, 1, Math.min(1, (sp - 0.04) * 12));
      } else {
        opacity = 1;
      }

      groupRef.current.visible = opacity > 0;
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          (child.material as any).opacity = opacity;
          (child.material as any).transparent = true;
          (child.material as any).depthWrite = false;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <Center position={[0, 2.2, 0]}>
        <Text3D
          font={fontUrl}
          size={isMobile ? 2.5 : 4.2}
          height={1.2}
          curveSegments={24}
          bevelEnabled
          bevelThickness={0.2}
          bevelSize={0.1}
          bevelOffset={0}
          bevelSegments={10}
        >
          JA
          <MeshTransmissionMaterial
            samples={8} resolution={512} thickness={3.0}
            chromaticAberration={0.03} anisotropy={0.1}
            distortion={0} distortionScale={0} temporalDistortion={0}
            color="#d0d8ff" roughness={0.05} transmission={1} metalness={0}
            ior={1.35} backside={true}
          />
        </Text3D>
      </Center>
      
      <Center position={[0, -2.2, 0]}>
        <Text3D
          font={fontUrl}
          size={isMobile ? 2.5 : 4.2}
          height={1.2}
          curveSegments={24}
          bevelEnabled
          bevelThickness={0.2}
          bevelSize={0.1}
          bevelOffset={0}
          bevelSegments={10}
        >
          MD
          <MeshTransmissionMaterial
            samples={8} resolution={512} thickness={3.0}
            chromaticAberration={0.03} anisotropy={0.1}
            distortion={0} distortionScale={0} temporalDistortion={0}
            color="#d0d8ff" roughness={0.05} transmission={1} metalness={0}
            ior={1.35} backside={true}
          />
        </Text3D>
      </Center>
    </group>
  );
}

/* ── Floating 3D Section Markers ── */
function SectionMarkers3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const sectionStart = i * 0.25;
        const isActive = scrollPercent > sectionStart && scrollPercent < sectionStart + 0.3;
        (child as THREE.Mesh).scale.setScalar(isActive ? 1 : 0.3);
        (child as THREE.Mesh).rotation.x += 0.01;
        (child as THREE.Mesh).rotation.y += 0.015;
      });
    }
  });

  const markerPositions: [number, number, number][] = [
    [-4, 2, -8],
    [4, 1, -10],
    [-3, -1, -12],
    [3, 0, -15],
  ];

  return (
    <group ref={groupRef}>
      {markerPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.3, 0]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? '#6366f1' : '#818cf8'} 
            emissive={i % 2 === 0 ? '#6366f1' : '#818cf8'}
            emissiveIntensity={1}
            transparent
            opacity={0.6}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Main Scene ── */
export default function Background3D({ scrollPercent }: { scrollPercent: number }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas 
        camera={{ position: [0, 0, isMobile ? 25 : 20], fov: isMobile ? 50 : 40 }} 
        dpr={[1, isMobile ? 1.2 : 1.5]}
      >
        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', isMobile ? 15 : 12, isMobile ? 40 : 35]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e2e8f0" />
        <pointLight position={[-8, 3, -5]} color="#6366f1" intensity={5} distance={30} />
        <pointLight position={[8, -3, -5]} color="#818cf8" intensity={4} distance={25} />
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />

        <group>
          <group 
            ref={(ref) => {
              if (ref) {
                const sp = scrollPercent;
                const opacity = sp < 0.05 ? 0 : THREE.MathUtils.lerp(0, 1, Math.min(1, (sp - 0.05) * 10));
                ref.traverse((child) => {
                  if (child instanceof THREE.Mesh && child.material) {
                    (child.material as any).opacity = opacity;
                    (child.material as any).transparent = true;
                    (child.material as any).depthWrite = false;
                  }
                });
              }
            }}
          >
            <CrystalShape
              basePos={[0, 1, 0]} color="#c8c8d0" geoType="infinity"
              orbitRadius={3} orbitSpeed={0.3} orbitOffset={0} scaleBase={1.2}
            />
            <CrystalShape
              basePos={[0, -1, 0]} color="#a0a0b0" geoType="torus"
              orbitRadius={3} orbitSpeed={0.3} orbitOffset={Math.PI} scaleBase={1}
            />
            <CrystalShape
              basePos={[3, 2, -4]} color="#6366f1" geoType="icosa"
              orbitRadius={2} orbitSpeed={0.5} orbitOffset={1} scaleBase={0.6} floatSpeed={3}
            />
            <CrystalShape
              basePos={[-3, -2, -4]} color="#818cf8" geoType="octahedron"
              orbitRadius={2} orbitSpeed={0.5} orbitOffset={3} scaleBase={0.5} floatSpeed={2}
            />
          </group>
        </group>

        <group
          ref={(ref) => {
            if (ref) {
              const sp = scrollPercent;
              const opacity = sp < 0.1 ? 0 : THREE.MathUtils.lerp(0, 0.3, Math.min(1, (sp - 0.1) * 5));
              ref.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  (child.material as any).opacity = opacity;
                  (child.material as any).transparent = true;
                  (child.material as any).depthWrite = false;
                }
              });
            }
          }}
        >
          <Sparkles count={60} scale={25} size={0.8} speed={0.15} color="#ffffff" opacity={0.3} />
        </group>

        <HeroText3D scrollPercent={scrollPercent} />

        <group
          ref={(ref) => {
            if (ref) {
              const sp = scrollPercent;
              const opacity = sp < 0.2 ? 0 : THREE.MathUtils.lerp(0, 0.6, Math.min(1, (sp - 0.2) * 4));
              ref.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material) {
                  (child.material as any).opacity = opacity;
                  (child.material as any).transparent = true;
                }
              });
            }
          }}
        >
          <SectionMarkers3D scrollPercent={scrollPercent} />
        </group>

        <Environment preset="night" />
        <CameraRig scrollPercent={scrollPercent} />

        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1} levels={8} intensity={0.4} />
          <Noise opacity={0.012} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
