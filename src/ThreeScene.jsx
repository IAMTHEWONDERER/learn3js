import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import Lenis from '@studio-freight/lenis';

const OBJ_PATH = 'public/TowerAlone.obj';
const MTL_PATH = 'public/TowerAlone.mtl';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const lenisRef = useRef(null);
    const scrollRef = useRef(0);
    const objectRef = useRef(null);
    const isDraggingRef = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });
    const baseRotationRef = useRef(0); // Track the base rotation from scrolling
    const dragOffsetRef = useRef(0); // Track drag offset for seamless grabbing

    useEffect(() => {
        if (!mountRef.current) return;

        // Initialize Lenis for smooth scrolling
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        // Set up scene, camera, and renderer
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 1000);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 1, 10);
        camera.rotation.x = THREE.MathUtils.degToRad(10);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            precision: 'mediump',
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        mountRef.current.appendChild(renderer.domElement);

        // Ensure pointer events are enabled on the canvas
        renderer.domElement.style.pointerEvents = 'auto';

        // Lighting setup
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
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

        const fillLight = new THREE.DirectionalLight(0xffd7b3, 0.4);
        fillLight.position.set(-5, 2, 3);
        scene.add(fillLight);

        // Load OBJ and MTL files
        const mtlLoader = new MTLLoader();
        mtlLoader.setPath('/');
        mtlLoader.load(
            MTL_PATH,
            (materials) => {
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

                const objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load(
                    OBJ_PATH,
                    (loadedObject) => {
                        const object = loadedObject;
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

                        const box = new THREE.Box3().setFromObject(object);
                        const center = box.getCenter(new THREE.Vector3());
                        object.position.set(0, 0, 0);
                        object.scale.set(0.003, 0.003, 0.003);
                        scene.add(object);

                        const animate = () => {
                            requestAnimationFrame(animate);
                            lenisRef.current.raf(performance.now());

                            const scroll = lenisRef.current.scroll;
                            scrollRef.current = scroll;

                            if (object) {
                                // Update base rotation from scroll
                                baseRotationRef.current = (scroll / 1000) * Math.PI * 2;

                                // Combine scroll-based and drag-based rotations
                                let totalRotation = baseRotationRef.current + dragOffsetRef.current;

                                // Apply drag offset during dragging
                                if (isDraggingRef.current) {
                                    totalRotation += previousMousePosition.current.deltaX * 0.002;
                                }

                                // Update object rotation
                                object.rotation.y = totalRotation;

                                renderer.render(scene, camera);
                            }
                        };

                        animate();

                        // Mouse drag for Y-axis rotation
                        const handleMouseDown = (event) => {
                            event.preventDefault(); // Prevent default behavior (e.g., text selection)
                            if (!objectRef.current) return; // Ensure object is loaded

                            isDraggingRef.current = true;
                            previousMousePosition.current = { x: event.clientX, y: event.clientY };

                            // Capture current drag offset to prevent snapping
                            dragOffsetRef.current = object.rotation.y - baseRotationRef.current;
                        };

                        const handleMouseMove = (event) => {
                            if (!isDraggingRef.current || !objectRef.current) return;

                            const deltaX = event.clientX - previousMousePosition.current.x;
                            previousMousePosition.current.deltaX = deltaX; // Store deltaX for animation
                            previousMousePosition.current.x = event.clientX;
                        };

                        const handleMouseUp = () => {
                            isDraggingRef.current = false;

                            // Update drag offset after releasing the mouse
                            if (objectRef.current) {
                                dragOffsetRef.current +=
                                    previousMousePosition.current.deltaX * 0.002;
                            }

                            delete previousMousePosition.current.deltaX; // Reset deltaX
                        };

                        const rendererDomElement = renderer.domElement;
                        rendererDomElement.addEventListener('mousedown', handleMouseDown);
                        rendererDomElement.addEventListener('mousemove', handleMouseMove);
                        rendererDomElement.addEventListener('mouseup', handleMouseUp);
                        rendererDomElement.addEventListener('mouseleave', handleMouseUp);

                        return () => {
                            rendererDomElement.removeEventListener('mousedown', handleMouseDown);
                            rendererDomElement.removeEventListener('mousemove', handleMouseMove);
                            rendererDomElement.removeEventListener('mouseup', handleMouseUp);
                            rendererDomElement.removeEventListener('mouseleave', handleMouseUp);
                            if (mountRef.current) {
                                mountRef.current.removeChild(renderer.domElement);
                            }
                            lenisRef.current.destroy();
                        };
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },
                    (error) => {
                        console.error('Error loading OBJ:', error);
                    }
                );
            },
            (error) => {
                console.error('Error loading MTL:', error);
            }
        );

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            lenisRef.current.destroy();
        };
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
                    pointerEvents: 'none', // Ensure this doesn't block events on the canvas
                }}
            />
            {/* Add 15000px height for scrolling */}
            <div style={{ height: '15000px' }} />
        </>
    );
};

export default ThreeScene;