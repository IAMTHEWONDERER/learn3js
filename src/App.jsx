import { useEffect, useState, useRef, useMemo } from "react";
import ThreeScene from "./ThreeScene";
import AnimatedSlides from "./AnimatedSlides";
import Lenis from '@studio-freight/lenis';

function App() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const threeSceneContainerRef = useRef(null);
  const lenisRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const rafIdRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  
  // ThreeScene throttling settings
  const THREEJS_FPS_LIMIT = 30; // Limit ThreeScene updates to 30fps
  const FRAME_MIN_TIME = (1000/60) * (60/THREEJS_FPS_LIMIT) - (1000/60) * 0.5;
  
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    
    // Handle scroll event with high priority
    const handleScroll = () => {
      if (!lenisRef.current) return;
      
      const scrollTop = lenisRef.current.scroll;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;
      
      // Calculate percentage scrolled (0 to 1)
      const percentage = Math.min(scrollTop / scrollableHeight, 1);
      
      // Update scroll information immediately for text animations
      setScrollPercentage(percentage);
      
      // Store the raw scroll position for the ThreeScene component
      scrollPositionRef.current = scrollTop;
    };
    
    // Set up Lenis with high priority rendering
    function raf(time) {
      if (!lenisRef.current) return;
      
      // Always update Lenis for smooth scrolling
      lenisRef.current.raf(time);
      
      // Update ThreeScene at a lower framerate to free CPU for text animations
      const now = performance.now();
      const elapsed = now - lastUpdateTimeRef.current;
      
      if (elapsed > FRAME_MIN_TIME) {
        lastUpdateTimeRef.current = now - (elapsed % FRAME_MIN_TIME);
        // The ThreeScene component will check this flag before heavy rendering
        window.THREEJS_SHOULD_UPDATE = true;
      } else {
        window.THREEJS_SHOULD_UPDATE = false;
      }
      
      rafIdRef.current = requestAnimationFrame(raf);
    }
    
    rafIdRef.current = requestAnimationFrame(raf);
    
    // Add Lenis scroll event listener with passive option for better performance
    lenisRef.current.on('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();
    
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.THREEJS_SHOULD_UPDATE = undefined;
    };
  }, []);
  
  // Use memo to avoid unnecessary style calculations
  const containerStyles = useMemo(() => {
    let translateX = '-100%';
    let opacity = 0;
    
    // Entry animation (0% - 10%)
    if (scrollPercentage < 0.1) {
      const progress = scrollPercentage / 0.1;
      translateX = `${-100 + (progress * 67)}%`;
      opacity = progress;
    }
    // Visible and stable (10% - 70%)
    else if (scrollPercentage >= 0.1 && scrollPercentage < 0.7) {
      translateX = '-33%';
      opacity = 1;
    }
    // Exit animation (70% - 100%)
    else {
      const progress = (scrollPercentage - 0.7) / 0.3;
      translateX = `${-33 - (progress * 67)}%`;
      opacity = 1 - progress;
    }
    
    return {
      transform: `translateX(${translateX})`,
      opacity: opacity,
      willChange: 'transform, opacity', // Hint for browser optimization
    };
  }, [scrollPercentage]);
  
  // Calculate the main animation area percentage for slides
  const mainAnimationPercentage = useMemo(() => {
    if (scrollPercentage < 0.1) return 0;
    if (scrollPercentage > 0.7) return 1;
    
    // Normalize to 0-1 range within the 0.1-0.7 range
    return (scrollPercentage - 0.1) / 0.6;
  }, [scrollPercentage]);
  
  return (
    <div className="app-container">
      {/* AnimatedSlides positioned behind ThreeScene */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5 // Lower zIndex to appear behind ThreeScene
      }}>
        <AnimatedSlides scrollPercentage={mainAnimationPercentage} />
      </div>
      
      {/* Container for ThreeScene with left-side positioning */}
      <div 
        ref={threeSceneContainerRef}
        className="three-scene-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10, // Higher zIndex to appear in front
          ...containerStyles
        }}
      >
        {/* Modified ThreeScene that respects the update flag */}
        <ThreeScene 
          scrollPosition={scrollPositionRef.current} 
          throttleFps={THREEJS_FPS_LIMIT}
        />
       </div>
      
      {/* Scrollable content area */}
      <div 
        className="scroll-content" 
        style={{ 
          height: '5500px',
          position: 'relative',
          zIndex: 1
        }} 
      />
    </div>
  );
}

export default App;