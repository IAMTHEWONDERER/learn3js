import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Constants
const OBJ_PATH = 'public/TowerAlone.obj';
const MTL_PATH = 'public/TowerAlone.mtl';

// Camera settings
const CAMERA_SETTINGS = {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialPosition: new THREE.Vector3(0, 1, 15),
    rotation: THREE.MathUtils.degToRad(10)
};

// Animation sequence configuration
const ANIMATION = {
    // Total scroll height in pixels
    totalScrollHeight: 15000,
    
    // Number of animation sequences
    sequences: 3,
    
    // Zoom settings - more dramatic zoom
    zoomedIn: 8,
    zoomedOut: 20, 
    zoomSpeed: 0.08,
    
    // Percentage of total scroll for initial zoom in
    zoomInStart: 0.05,
    zoomInEnd: 0.1,
    
    // Percentage of total scroll for final zoom out
    zoomOutStart: 0.9,
    zoomOutEnd: 0.95,
    
    // Rotation speed multipliers
    fastRotationSpeed: 4,
    slowRotationSpeed: 0.4,
    
    // Rotation cycle distribution (as proportions of each sequence)
    fastRotationProportion: 0.75,
    slowRotationProportion: 0.25, 
    // Base speeds
    baseRotationSpeed: 0.15,
    basePositionSpeed: 0.1 
};

// Object settings
const OBJECT_SETTINGS = {
    initialX: 0.3,
    initialY: -2,
    scale: 0.003,
    verticalRange: 4
};

const ThreeScene = () => {
    const mountRef = useRef(null);
    const objectRef = useRef(null);
    const frameRef = useRef(null);
    const scrollRef = useRef(0);
    const cameraZRef = useRef(ANIMATION.zoomedOut);
    const sequenceRef = useRef(0);
    const isScrollingUpRef = useRef(false);
    const lastScrollPositionRef = useRef(0);
    const targetRotationRef = useRef(0);
    const currentRotationRef = useRef(0);
    const needsRenderRef = useRef(true);
    const lastRenderedScrollRef = useRef(-1);
    const scrollTimeoutRef = useRef(null);
    const lastRenderTimeRef = useRef(0);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 1000);
        sceneRef.current = scene;

        // Camera setup
        const camera = setupCamera();
        cameraRef.current = camera;

        // Renderer setup
        const renderer = setupRenderer();
        rendererRef.current = renderer;
        mountRef.current.appendChild(renderer.domElement);

        // Lighting setup
        setupLighting(scene);

        // Load 3D model
        loadModel(scene);

        // Handle scroll with debounce and render flagging
        const handleScroll = () => {
            // Clear previous timeout
            clearTimeout(scrollTimeoutRef.current);
            
            // Update scroll values immediately
            const currentScroll = window.scrollY;
            isScrollingUpRef.current = currentScroll < lastScrollPositionRef.current;
            lastScrollPositionRef.current = currentScroll;
            scrollRef.current = currentScroll;
            
            // Set flag to render on next frame if scroll position changed significantly
            if (Math.abs(lastRenderedScrollRef.current - currentScroll) > 2) {
                needsRenderRef.current = true;
            }
            
            // Schedule one final render after scrolling stops
            scrollTimeoutRef.current = setTimeout(() => {
                needsRenderRef.current = true;
            }, 50);
        };

        window.addEventListener('scroll', handleScroll);

        // Handle window resize with debouncing
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                needsRenderRef.current = true;
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeoutRef.current);
            
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };

        // Helper functions
        function setupCamera() {
            const camera = new THREE.PerspectiveCamera(
                CAMERA_SETTINGS.fov,
                window.innerWidth / window.innerHeight,
                CAMERA_SETTINGS.near,
                CAMERA_SETTINGS.far
            );
            camera.position.copy(CAMERA_SETTINGS.initialPosition);
            camera.rotation.x = CAMERA_SETTINGS.rotation;
            return camera;
        }

        function setupRenderer() {
            const renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
                precision: 'mediump',
                powerPreference: 'default',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            renderer.outputEncoding = THREE.sRGBEncoding;
            return renderer;
        }

        function setupLighting(scene) {
            // Ambient light
            const ambient = new THREE.AmbientLight(0xffffff, 0.3);
            scene.add(ambient);

            // Main directional light
            const sunLight = new THREE.DirectionalLight(0xffffff, 1.8); // Increased intensity
            sunLight.position.set(10, 15, 8);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 2048;
            sunLight.shadow.mapSize.height = 2048;
            sunLight.shadow.camera.near = 0.5;
            sunLight.shadow.camera.far = 500;
            sunLight.shadow.camera.left = -10;
            sunLight.shadow.camera.right = 10;
            sunLight.shadow.camera.top = 10;
            sunLight.shadow.camera.bottom = -10;
            sunLight.shadow.bias = -0.0001;
            sunLight.shadow.normalBias = 0.02;
            scene.add(sunLight);

            // Fill light
            const fillLight = new THREE.DirectionalLight(0xffd7b3, 0.5); // Increased intensity
            fillLight.position.set(-5, 2, 3);
            scene.add(fillLight);
            
            // Add rim light for better definition
            const rimLight = new THREE.DirectionalLight(0xc9e8ff, 0.4);
            rimLight.position.set(0, 5, -5);
            scene.add(rimLight);
        }

        function loadModel(scene) {
            const mtlLoader = new MTLLoader();
            mtlLoader.setPath('/');
            mtlLoader.load(
                MTL_PATH,
                (materials) => {
                    setupMaterials(materials);
                    loadObject(materials, scene);
                },
                null,
                (error) => console.error('Error loading MTL:', error)
            );
        }

        function setupMaterials(materials) {
            materials.preload();
            Object.values(materials.materials).forEach((material) => {
                material.color = new THREE.Color(0xffffff);
                material.side = THREE.DoubleSide;
                material.roughness = 0.7;
                material.metalness = 0.3;
                material.envMapIntensity = 1.0;

                if (material.map) {
                    material.map.anisotropy = 8;
                    material.map.minFilter = THREE.LinearMipmapLinearFilter;
                    material.map.magFilter = THREE.LinearFilter;
                    material.map.encoding = THREE.sRGBEncoding;
                    material.map.generateMipmaps = true;
                }
            });
        }

        function loadObject(materials, scene) {
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(
                OBJ_PATH,
                (object) => {
                    setupObject(object, scene);
                    setupOptimizedAnimation();
                    
                    // Set initial camera state - zoomed out
                    camera.position.z = ANIMATION.zoomedOut;
                    cameraZRef.current = ANIMATION.zoomedOut;
                    
                    // Force initial render
                    needsRenderRef.current = true;
                },
                (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
                (error) => console.error('Error loading OBJ:', error)
            );
        }

        function setupObject(object, scene) {
            objectRef.current = object;

            object.traverse((child) => {
                if (child.isMesh && child.geometry) {
                    child.geometry.center();
                    child.geometry.computeVertexNormals();
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.needsUpdate = true;
                }
            });

            object.position.set(OBJECT_SETTINGS.initialX, OBJECT_SETTINGS.initialY, -2);
            object.scale.setScalar(OBJECT_SETTINGS.scale);
            scene.add(object);
        }

        function setupOptimizedAnimation() {
            const targetFrameRate = 60; // Target frame rate
            const frameInterval = 1000 / targetFrameRate;
            
            const animate = (timestamp) => {
                frameRef.current = requestAnimationFrame(animate);
                
                const deltaTime = timestamp - lastRenderTimeRef.current;
                const object = objectRef.current;
                
                // Check if we need to render this frame
                const shouldRender = (
                    // If manual render flag is set
                    needsRenderRef.current ||
                    
                    // If we're in a transition state
                    (object && (
                        Math.abs(cameraRef.current.position.z - cameraZRef.current) > 0.01 ||
                        Math.abs(object.rotation.y - currentRotationRef.current) > 0.01 ||
                        Math.abs(object.position.y - calculateTargetY()) > 0.01
                    )) ||
                    
                    // Frame rate limiting
                    deltaTime >= frameInterval
                );
                
                if (object && shouldRender) {
                    // Get normalized scroll progress (0 to 1)
                    const normalizedScroll = scrollRef.current / ANIMATION.totalScrollHeight;
                    
                    // Handle camera zoom based on scroll position
                    updateCameraZoom(normalizedScroll);
                    
                    // Calculate and store rotation information
                    calculateObjectRotation(normalizedScroll);
                    
                    // Apply rotation to object with smoothing
                    applyObjectRotation(object);
                    
                    // Handle vertical position
                    updateObjectPosition(object, normalizedScroll);
                    
                    // Apply camera position with smooth transition
                    cameraRef.current.position.z = THREE.MathUtils.lerp(
                        cameraRef.current.position.z, 
                        cameraZRef.current, 
                        ANIMATION.zoomSpeed
                    );
                    
                    // Render scene
                    rendererRef.current.render(sceneRef.current, cameraRef.current);
                    
                    // Update tracking variables
                    lastRenderTimeRef.current = timestamp;
                    lastRenderedScrollRef.current = scrollRef.current;
                    needsRenderRef.current = false;
                }
            };

            animate(0);
        }
        
        function calculateTargetY() {
            const normalizedScroll = scrollRef.current / ANIMATION.totalScrollHeight;
            const basePosition = OBJECT_SETTINGS.initialY + 
                (normalizedScroll * OBJECT_SETTINGS.verticalRange);
            
            // Add subtle wave motion based on rotation
            const waveIntensity = 0.2;
            const waveFrequency = 1.5;
            const waveOffset = Math.sin(normalizedScroll * Math.PI * waveFrequency) * waveIntensity;
            
            return basePosition + waveOffset;
        }
        
        function updateCameraZoom(normalizedScroll) {
            // Initial zoom in - stronger zoom effect
            if (normalizedScroll >= ANIMATION.zoomInStart && normalizedScroll <= ANIMATION.zoomInEnd) {
                const zoomProgress = (normalizedScroll - ANIMATION.zoomInStart) / 
                                   (ANIMATION.zoomInEnd - ANIMATION.zoomInStart);
                cameraZRef.current = THREE.MathUtils.lerp(
                    ANIMATION.zoomedOut, 
                    ANIMATION.zoomedIn, 
                    easeInOutCubic(zoomProgress) // Changed to cubic for more dramatic effect
                );
            } 
            // Stay zoomed in during main animation
            else if (normalizedScroll > ANIMATION.zoomInEnd && normalizedScroll < ANIMATION.zoomOutStart) {
                cameraZRef.current = ANIMATION.zoomedIn;
            } 
            // Final zoom out - stronger zoom effect
            else if (normalizedScroll >= ANIMATION.zoomOutStart && normalizedScroll <= ANIMATION.zoomOutEnd) {
                const zoomProgress = (normalizedScroll - ANIMATION.zoomOutStart) / 
                                   (ANIMATION.zoomOutEnd - ANIMATION.zoomOutStart);
                cameraZRef.current = THREE.MathUtils.lerp(
                    ANIMATION.zoomedIn, 
                    ANIMATION.zoomedOut, 
                    easeInOutCubic(zoomProgress) // Changed to cubic for more dramatic effect
                );
            } 
            // Default state - zoomed out
            else {
                cameraZRef.current = ANIMATION.zoomedOut;
            }
        }
        
        function calculateObjectRotation(normalizedScroll) {
            // Only rotate during the main animation phase (between zoom in and zoom out)
            if (normalizedScroll > ANIMATION.zoomInEnd && normalizedScroll < ANIMATION.zoomOutStart) {
                // Calculate main animation progress (normalized 0-1 within the main animation section)
                const mainAnimationLength = ANIMATION.zoomOutStart - ANIMATION.zoomInEnd;
                const mainAnimationProgress = (normalizedScroll - ANIMATION.zoomInEnd) / mainAnimationLength;
                
                // Calculate which sequence we're in (0 to 3 for 4 sequences)
                const sequenceProgress = mainAnimationProgress * ANIMATION.sequences;
                const currentSequence = Math.floor(sequenceProgress);
                
                // Update sequence for potential use in other components
                if (currentSequence !== sequenceRef.current) {
                    sequenceRef.current = currentSequence;
                    console.log(`Now in sequence ${currentSequence + 1} of ${ANIMATION.sequences}`);
                }
                
                // Progress within current sequence (0 to 1)
                const progressInSequence = sequenceProgress - currentSequence;
                
                // Determine if we're in fast or slow rotation part of the sequence
                const inFastRotation = progressInSequence < ANIMATION.fastRotationProportion;
                
                // Calculate total rotations per sequence (2 full rotations: 1.5 fast + 0.5 slow)
                const totalRotationsPerSequence = Math.PI * 4; // Two full rotations (2 * 2π)
                
                // Calculate target rotation
                if (inFastRotation) {
                    // Fast rotation part (first 75% of sequence, handles 1.5 rotations)
                    const fastProgress = progressInSequence / ANIMATION.fastRotationProportion;
                    const fastRotationAmount = totalRotationsPerSequence * 0.75; // 1.5 full rotations = 75% of 2 full rotations
                    targetRotationRef.current = (currentSequence * totalRotationsPerSequence) + (fastProgress * fastRotationAmount);
                } else {
                    // Slow rotation part (remaining 25% of sequence, handles 0.5 rotations)
                    const slowProgress = (progressInSequence - ANIMATION.fastRotationProportion) / ANIMATION.slowRotationProportion;
                    const fastRotationAmount = totalRotationsPerSequence * 0.75; // 1.5 full rotations
                    const slowRotationAmount = totalRotationsPerSequence * 0.25; // 0.5 full rotations
                    targetRotationRef.current = (currentSequence * totalRotationsPerSequence) + fastRotationAmount + (slowProgress * slowRotationAmount);
                }
            }
        }
        
        function applyObjectRotation(object) {
            // Apply rotation with appropriate speed based on which part of the sequence we're in
            const sequenceProgress = (scrollRef.current / ANIMATION.totalScrollHeight - ANIMATION.zoomInEnd) / 
                                   (ANIMATION.zoomOutStart - ANIMATION.zoomInEnd) * ANIMATION.sequences;
            const progressInSequence = sequenceProgress - Math.floor(sequenceProgress);
            const inFastRotation = progressInSequence < ANIMATION.fastRotationProportion;
            
            // Calculate rotation speed multiplier
            const rotationSpeedMultiplier = inFastRotation ? 
                ANIMATION.fastRotationSpeed : ANIMATION.slowRotationSpeed;
            
            // Smoothly interpolate current rotation towards target rotation
            currentRotationRef.current = THREE.MathUtils.lerp(
                currentRotationRef.current,
                targetRotationRef.current,
                ANIMATION.baseRotationSpeed * rotationSpeedMultiplier
            );
            
            // Apply the rotation
            object.rotation.y = currentRotationRef.current;
        }
        
        function updateObjectPosition(object, normalizedScroll) {
            // Calculate vertical position based on scroll with a slight wave effect
            const targetPositionY = calculateTargetY();
            
            // Apply smooth position change
            object.position.y = THREE.MathUtils.lerp(
                object.position.y,
                targetPositionY,
                ANIMATION.basePositionSpeed
            );
        }
        
        // Enhanced easing functions for smoother transitions
        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }
        
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
    }, []);

    return (
        <>
            <div
                ref={mountRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: -1
                }}
            />
            <div style={{ height: `${ANIMATION.totalScrollHeight}px` }} />
        </>
    );
};

export default ThreeScene;

/*
Documentation for ThreeScene:
--------------

1. Component Overview:
    ThreeScene is a React component that creates an interactive 3D scene with a model of Mohammed VI Tower
    that animates based on scroll position, optimized to minimize impact on UI performance.

2. Key Features:
    - Scroll-based animation with performance optimization
    - Render-on-demand system to reduce GPU/CPU usage
    - Dynamic camera zooming
    - Smooth rotation sequences
    - Responsive design
    - Multiple lighting sources

3. Key Constants:
    - ANIMATION: Controls scroll height, zoom levels, and rotation speeds
    - CAMERA_SETTINGS: Defines camera properties
    - OBJECT_SETTINGS: Controls 3D model positioning and scale

4. Optimization Techniques:
    - Only renders when necessary (scroll changes, transitions active)
    - Debounced scroll handler
    - Frame rate limiting
    - Separate state tracking for rendering needs

5. Requirements:
    - Three.js library
    - MTL and OBJ model files
    - React 16.8+ (for hooks support)

6. Installation:
    ```bash or powershell
    npm install three @types/three
    ```

7. Usage:
    ```jsx
    import ThreeScene from './ThreeScene';
    
    function App() {
      return <ThreeScene />;
    }
    ```

Testing Instructions:
--------------------

1. Visual Testing:
    - Verify smooth scrolling with minimal impact on page animations
    - Test initial zoom-in animation (0-10% scroll)
    - Test rotation sequences (10-90% scroll)
    - Test final zoom-out animation (90-100% scroll)
    - Check model lighting from different angles

2. Performance Testing:
    - Monitor FPS using browser dev tools during scrolling
    - Verify reduced GPU/CPU usage during static moments

3. Edge Cases:
    - Test rapid scrolling
    - Test browser refresh at different scroll positions

Known Limitations:
-----------------
1. Requires WebGL support
2. Optimization is designed for scroll-based animation specifically
*/