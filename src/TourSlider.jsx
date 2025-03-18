import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useEffect, useState } from 'react';

// With gltfpack, we don't need the DRACOLoader anymore
// Just preload the optimized model
useGLTF.preload("/Htower-optimized.glb");

function Model() {
    // Simply load the gltfpack-optimized model
    const { scene } = useGLTF("/Htower-optimized.glb");
    const modelRef = useRef();
    
    useEffect(() => {
        if (scene) {
            scene.traverse((child) => {
                if (child.isMesh) {
                    // Enable shadows only for larger objects to improve performance
                    if (child.geometry.boundingSphere && child.geometry.boundingSphere.radius > 1) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                    
                    // Optimize materials
                    if (child.material) {
                        // Increase base brightness slightly to compensate for removed ambient light
                        child.material.roughness = 0.65; // Slightly decreased to allow more light reflection
                        child.material.metalness = 0.35; // Slightly increased to enhance natural light reflection
                        child.material.envMapIntensity = 1.8; // Increased to compensate for removed ambient light
                        
                        // Ensure proper color encoding
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
            controlsRef.current.setAzimuthalAngle(-Math.PI / 6);
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
            {/* Main sun-like directional light with increased intensity */}
            <directionalLight
                ref={lightRef}
                position={[20, 25, 20]}
                intensity={3.0} // Increased from 2.0 to compensate for removed ambient light
                color="#ff9955" // Warmer color to simulate natural sunlight
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
            
            {/* Secondary fill light to simulate sky light instead of ambient */}
            <directionalLight
                ref={secondaryLightRef}
                position={[-15, 20, -15]}
                intensity={0.7} // Subtle fill light
                color="#b3d9ff" // Slightly blue to simulate sky light
                castShadow={false} // No shadows from fill light for performance
            />
            
            {/* Ground shadow plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <shadowMaterial attach="material" opacity={0.4} color="#3d2b4b" />
            </mesh>
        </>
    );
}

function SunsetFog() {
    return <fog attach="fog" args={['#f0b07a', 150, 400]} />;
}

const TourSlider = ({ width, height }) => {
    return (
        <div style={{ 
            width: width || "100%", 
            height: height || "500px",
            position: "relative"
        }}>
            <Canvas 
                shadows 
                camera={{ 
                    position: [180 * Math.sin(-Math.PI/6), 10, 230 * Math.cos(-Math.PI/6)],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                }}
                gl={{ 
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputEncoding: THREE.sRGBEncoding,
                    shadowMap: {
                        enabled: true,
                        type: THREE.PCFSoftShadowMap
                    }
                }}
                style={{ width: '100%', height: '100%' }}
                dpr={[1, 2]} // Limit pixel ratio for better performance
            >
                <Suspense fallback={null}>
                    <EnhancedLighting />
                    <Environment preset="sunset" background={false} intensity={0.8} /> {/* Increased intensity to compensate for removed ambient light */}
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