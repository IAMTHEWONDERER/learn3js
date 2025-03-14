import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense, useRef, useEffect } from 'react';

function Model() {
    const gltf = useLoader(GLTFLoader, "/Htower.glb");
    const modelRef = useRef();
   
    useEffect(() => {
        if (gltf.scene) {
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        child.material.roughness = 0.7;
                        child.material.metalness = 0.3;
                        child.material.envMapIntensity = 1.2;
                        
                        if (child.material.normalMap) {
                            child.material.normalScale.set(1.5, 1.5);
                        }
                        
                        if (child.material.map) {
                            child.material.map.encoding = THREE.SRGBColorSpace;
                        }
                    }
                }
            });
        }
    }, [gltf]);
   
    return <primitive ref={modelRef} object={gltf.scene} castShadow receiveShadow />;
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
            distance={150} // Reduced from 200 to zoom in
        />
    );
}

function SingleLightSource() {
    const lightRef = useRef();
    
    useFrame(({ clock }) => {
        if (lightRef.current) {
            const t = clock.getElapsedTime() * 0.05;
            const angle = Math.PI / 4;
            const radius = 30; // Reduced from 40 to match closer camera
            
            const distance = radius + Math.sin(t) * 3;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = 25 + Math.sin(t * 0.5) * 2; // Adjusted height
            
            lightRef.current.position.set(x, y, z);
            lightRef.current.lookAt(0, 0, 0);
        }
    });
    
    return (
        <>
            <directionalLight
                ref={lightRef}
                position={[20, 25, 20]} // Adjusted for closer view
                intensity={2.0}
                color="#ff7e45"
                castShadow={true}
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={300}
                shadow-camera-left={-75} // Reduced from 100
                shadow-camera-right={75} // Reduced from 100
                shadow-camera-top={75} // Reduced from 100
                shadow-camera-bottom={-75} // Reduced from 100
                shadow-bias={-0.0001}
                shadow-radius={3}
            />
            <ambientLight intensity={0.3} color="#fff" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <shadowMaterial attach="material" opacity={0.4} color="#3d2b4b" />
            </mesh>
        </>
    );
}

function SunsetFog() {
    return <fog attach="fog" args={['#f0b07a', 150, 400]} />; // Adjusted fog distance
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
                    // Reduced distance from 240 to 180 for closer view
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
            >
                <Suspense fallback={null}>
                    <SingleLightSource />
                    <Environment preset="sunset" background={false} intensity={0.5} />
                    <SunsetFog />
                    <Model />
                    <FixedOrbitControls />
                    <SoftShadows size={10} focus={0.5} samples={16} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default TourSlider;
