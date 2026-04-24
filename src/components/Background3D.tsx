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
              samples={3}
              resolution={256}
              thickness={0.6}
              chromaticAberration={0.03}
              anisotropy={0.15}
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              color={color}
              roughness={0.02}
              transmission={1}
              metalness={0.05}
              ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'octahedron' && (
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
              samples={3}
              resolution={256}
              thickness={0.6}
              chromaticAberration={0.03}
              anisotropy={0.15}
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              color={color}
              roughness={0.02}
              transmission={1}
              metalness={0.05}
              ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'torus' && (
          <mesh>
            <torusGeometry args={[1, 0.4, 32, 48]} />
            <MeshTransmissionMaterial
              samples={3}
              resolution={256}
              thickness={0.6}
              chromaticAberration={0.03}
              anisotropy={0.15}
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              color={color}
              roughness={0.02}
              transmission={1}
              metalness={0.05}
              ior={1.5}
            />
          </mesh>
        )}
        {geoType === 'infinity' && (
          <group>
            <mesh rotation={[0, 0, Math.PI / 4]} position={[0.3, 0, 0]}>
              <torusGeometry args={[0.5, 0.12, 12, 32]} />
              <MeshTransmissionMaterial
                samples={3}
                resolution={256}
                thickness={0.6}
                chromaticAberration={0.03}
                anisotropy={0.15}
                distortion={0}
                distortionScale={0}
                temporalDistortion={0}
                color={color}
                roughness={0.02}
                transmission={1}
                metalness={0.05}
                ior={1.5}
              />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.3, 0, 0]}>
              <torusGeometry args={[0.5, 0.12, 12, 32]} />
              <MeshTransmissionMaterial
                samples={3}
                resolution={256}
                thickness={0.6}
                chromaticAberration={0.03}
                anisotropy={0.15}
                distortion={0}
                distortionScale={0}
                temporalDistortion={0}
                color={color}
                roughness={0.02}
                transmission={1}
                metalness={0.05}
                ior={1.5}
              />
            </mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

/* ── Camera rig driven by scroll ── */
function CameraRig({ scrollPercent }: { scrollPercent: number }) {
  const { camera } = useThree();

  useFrame(() => {
    const sp = Math.min(scrollPercent, 1);

    // Dynamic camera movement based on scroll - más sutil
    const targetZ = THREE.MathUtils.lerp(20, 12, sp);
    const targetY = THREE.MathUtils.lerp(0, 1, sp);
    const targetX = THREE.MathUtils.lerp(0, 2, sp);

    camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── 3D Hero Text (Crystal mesh letters) ── */
function HeroText3D({ scrollPercent }: { scrollPercent: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Font URL - using a clean sans-serif font
  const fontUrl = 'https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const sp = scrollPercent;
      const t = clock.getElapsedTime();
      
      // Scale: starts small, grows slightly but stays visible
      const scale = THREE.MathUtils.lerp(isMobile ? 0.6 : 0.8, isMobile ? 1.0 : 1.2, Math.min(sp * 2, 1));
      groupRef.current.scale.setScalar(scale);
      
      // Dynamic rotation (idle + scroll)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(-0.2, 0.5, sp) + Math.sin(t * 0.5) * 0.08;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(0.1, -0.2, sp) + Math.cos(t * 0.4) * 0.05;
      
      // Vertical separation / movement
      const separation = THREE.MathUtils.lerp(0, 4, sp);
      const floating = Math.sin(t * 1.5) * 0.2;

      const ja = groupRef.current.children[0];
      const md = groupRef.current.children[1];
      
      if (ja) {
        // Vertical layout: JA at top
        ja.position.y = 2.2 + separation * 0.8 + floating;
        ja.position.x = Math.sin(t * 0.5) * 0.2;
        ja.rotation.z = Math.sin(t * 0.7) * 0.05;
      }
      if (md) {
        // Vertical layout: MD at bottom
        md.position.y = -2.2 - separation * 0.8 - floating;
        md.position.x = Math.cos(t * 0.5) * 0.2;
        md.rotation.z = Math.cos(t * 0.7) * 0.05;
      }

      // Transition: Appear when 2D letters fade out (starts early at 0.04), stay visible after
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
            samples={8}
            resolution={512}
            thickness={3.0}
            chromaticAberration={0.03}
            anisotropy={0.1}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            color="#d0d8ff"
            roughness={0.05}
            transmission={1}
            metalness={0}
            ior={1.35}
            backside={true}
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
            samples={8}
            resolution={512}
            thickness={3.0}
            chromaticAberration={0.03}
            anisotropy={0.1}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            color="#d0d8ff"
            roughness={0.05}
            transmission={1}
            metalness={0}
            ior={1.35}
            backside={true}
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

        {/* Lighting — enhanced for crystal visibility */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#e2e8f0" />
        <pointLight position={[-8, 3, -5]} color="#6366f1" intensity={5} distance={30} />
        <pointLight position={[8, -3, -5]} color="#818cf8" intensity={4} distance={25} />
        <spotLight position={[0, 10, 0]} intensity={2} angle={0.5} penumbra={1} color="#ffffff" />

        {/* Crystal shapes: only appear when 2D text fades out */}
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
            {/* Main central cluster — letters become these */}
            <CrystalShape
              basePos={[0, 1, 0]}
              color="#c8c8d0"
              geoType="infinity"
              orbitRadius={3}
              orbitSpeed={0.3}
              orbitOffset={0}
              scaleBase={1.2}
            />
            <CrystalShape
              basePos={[0, -1, 0]}
              color="#a0a0b0"
              geoType="torus"
              orbitRadius={3}
              orbitSpeed={0.3}
              orbitOffset={Math.PI}
              scaleBase={1}
            />
  
            {/* Satellite shapes — interact with the main pair */}
            <CrystalShape
              basePos={[3, 2, -4]}
              color="#6366f1"
              geoType="icosa"
              orbitRadius={2}
              orbitSpeed={0.5}
              orbitOffset={1}
              scaleBase={0.6}
              floatSpeed={3}
            />
            <CrystalShape
              basePos={[-3, -2, -4]}
              color="#818cf8"
              geoType="octahedron"
              orbitRadius={2}
              orbitSpeed={0.5}
              orbitOffset={3}
              scaleBase={0.5}
              floatSpeed={2}
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
          <Bloom 
            mipmapBlur 
            luminanceThreshold={1} 
            levels={8} 
            intensity={0.4} 
          />
          <Noise opacity={0.012} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
