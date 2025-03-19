import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  SoftShadows,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef, useEffect, useState } from "react";

useGLTF.preload("/newhassan-optimized.glb");

function Model() {
  const { scene } = useGLTF("/newhassan-optimized.glb");
  const modelRef = useRef();

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (
            child.geometry.boundingSphere &&
            child.geometry.boundingSphere.radius > 1
          ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          if (child.material) {
            child.material.roughness = 0.65;
            child.material.metalness = 0.35;
            child.material.envMapIntensity = 1.8;

            if (child.material.map) {
              child.material.map.encoding = THREE.SRGBColorSpace;
            }
          }
        }
      });
    }
  }, [scene]);

  return <primitive ref={modelRef} object={scene} castShadow receiveShadow />;
}

function FixedOrbitControls() {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.setAzimuthalAngle(0);
      controlsRef.current.minPolarAngle = Math.PI / 2 - Math.PI / 18;
      controlsRef.current.maxPolarAngle = Math.PI / 2 - Math.PI / 18;
      controlsRef.current.enableZoom = false;
      controlsRef.current.update();
    }
  }, []);

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.5}
      minPolarAngle={Math.PI / 2 - Math.PI / 22}
      maxPolarAngle={Math.PI / 2 - Math.PI / 30}
      distance={150}
    />
  );
}

function EnhancedLighting() {
  const lightRef = useRef();
  const secondaryLightRef = useRef();

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime() * 0.05;
      const angle = Math.PI / 4;
      const radius = 30;

      const distance = radius + Math.sin(t) * 3;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = 25 + Math.sin(t * 0.5) * 2;

      lightRef.current.position.set(x, y, z);
      lightRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[20, 25, 20]}
        intensity={3.0}
        color="#ff9955"
        castShadow={true}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={300}
        shadow-camera-left={-75}
        shadow-camera-right={75}
        shadow-camera-top={75}
        shadow-camera-bottom={-75}
        shadow-bias={-0.0001}
        shadow-radius={3}
      />

      <directionalLight
        ref={secondaryLightRef}
        position={[-15, 20, -15]}
        intensity={0.7}
        color="#b3d9ff"
        castShadow={false}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[500, 500]} />
        <shadowMaterial attach="material" opacity={0.4} color="#3d2b4b" />
      </mesh>
    </>
  );
}

function SunsetFog() {
  return <fog attach="fog" args={["#f0b07a", 150, 400]} />;
}

const TourSlider = () => {
  return (
    <div
      className="xr4_wrapper"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundImage:
          "url('https://res.cloudinary.com/dyecicotf/image/upload/v1742398022/gain_dea69g.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 10, 280],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <EnhancedLighting />
          <Environment preset="sunset" background={false} intensity={0.8} />
          <SunsetFog />
          <Model />
          <FixedOrbitControls />
          <SoftShadows size={10} focus={0.5} samples={8} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default TourSlider;
