/*
Documentation for ThreeScene:
--------------

1. Component Overview:
    ThreeScene is a React component that creates an interactive 3D scene with a model of Mohammed VI Tower
    that animates based on scroll position.

2. Key Features:
    - Scroll-based animation
    - Dynamic camera zooming
    - Smooth rotation sequences
    - Responsive design
    - Optimized performance
    - Multiple lighting sources

3. Key Constants:
    - ANIMATION: Controls scroll height, zoom levels, and rotation speeds
    - CAMERA_SETTINGS: Defines camera properties
    - OBJECT_SETTINGS: Controls 3D model positioning and scale

4. Requirements:
    - Three.js library
    - MTL and OBJ model files
    - React 16.8+ (for hooks support)

5. Installation:
    ```bash or powershell
    npm install three @types/three
    ```

6. Usage:
    ```jsx
    import ThreeScene from './ThreeScene';
    
    function TowerScene() {
      return <ThreeScene />;
    }
    ```

Testing Instructions:
--------------------

1. Visual Testing:
    - Scroll slowly through the page and verify:
      * Initial zoom-in animation (0-10% scroll)
      * Rotation sequences (10-90% scroll)
      * Final zoom-out animation (90-100% scroll)
    - Check model lighting from different angles
    - Verify smooth transitions between sequences

2. Performance Testing:
    - Test on different devices/browsers
    - Monitor FPS using browser dev tools
    - Check memory usage during long sessions
    - Verify responsive behavior on window resize

3. Edge Cases:
    - Test rapid scrolling
    - Test browser refresh at different scroll positions
    - Test with different window sizes
    - Test with model loading failures

4. Unit Testing Example:
    ```javascript
    import { render, cleanup } from '@testing-library/react';
    import ThreeScene from './ThreeScene';

    describe('ThreeScene', () => {
      afterEach(cleanup);

      test('renders without crashing', () => {
         const { container } = render(<ThreeScene />);
         expect(container).toBeTruthy();
      });

      test('creates canvas element', () => {
         const { container } = render(<ThreeScene />);
         const canvas = container.querySelector('canvas');
         expect(canvas).toBeTruthy();
      });
    });
    ```

5. Debug Mode:
    Add these before the return statement to enable debugging:
    ```javascript
    // Debug info
    console.log({
      scrollPosition: scrollRef.current,
      cameraZ: cameraZRef.current,
      currentSequence: sequenceRef.current,
      rotation: currentRotationRef.current
    });
    ```

Known Limitations:
-----------------
1. Requires WebGL support
2. Performance may vary on mobile devices
3. Large scroll height might cause issues on some browsers
4. Model loading depends on correct file paths

Performance Optimization Tips:
----------------------------
1. Use compressed textures
2. Implement level of detail (LOD)
3. Enable frustum culling
4. Optimize model geometry
5. Use requestAnimationFrame throttling
*/
