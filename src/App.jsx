import { useEffect, useState, useRef } from "react";
import ThreeScene from "./ThreeScene";
import Lenis from '@studio-freight/lenis';

function App() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const threeSceneContainerRef = useRef(null);
  const lenisRef = useRef(null);
  
  // Save scroll position in a ref to pass to ThreeScene component
  const scrollPositionRef = useRef(0);
  
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
    
    // Function to calculate scroll percentage using Lenis
    const handleScroll = () => {
      if (!lenisRef.current) return;
      
      const scrollTop = lenisRef.current.scroll;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;
      
      // Calculate percentage scrolled (0 to 1)
      const percentage = Math.min(scrollTop / scrollableHeight, 1);
      setScrollPercentage(percentage);
      
      // Store the raw scroll position for the ThreeScene component
      scrollPositionRef.current = scrollTop;
    };
    
    // Set up Lenis raf
    function raf(time) {
      if (!lenisRef.current) return;
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Add Lenis scroll event listener
    lenisRef.current.on('scroll', handleScroll);
    
    // Initial calculation
    handleScroll();
    
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);
  
  // Calculate the container styles based on scroll percentage
  const getContainerStyles = () => {
    let translateX = '-100%';  // Start completely off-screen to the left
    let opacity = 0;
    
    // Entry animation (0% - 10%)
    if (scrollPercentage < 0.1) {
      const progress = scrollPercentage / 0.1;
      translateX = `${-100 + (progress * 67)}%`;  // Only move to 33% of screen width (left third)
      opacity = progress;
    }
    // Visible and stable (10% - 70%)
    else if (scrollPercentage >= 0.1 && scrollPercentage < 0.7) {
      translateX = '-33%';  // Keep in the left third of the screen
      opacity = 1;
    }
    // Exit animation (70% - 100%)
    else {
      const progress = (scrollPercentage - 0.7) / 0.3;
      translateX = `${-33 - (progress * 67)}%`;  // Exit back to the left
      opacity = 1 - progress;
    }
    
    return {
      transform: `translateX(${translateX})`,
      opacity: opacity,
    };
  };
  
  return (
    <div className="app-container">
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
          zIndex: 10,
          ...getContainerStyles()
        }}
      >
        {/* Pass the scroll position to ThreeScene to maintain smooth rotation */}
        <ThreeScene scrollPosition={scrollPositionRef.current} />
      </div>
      
      {/* Scrollable content area */}
      <div 
        className="scroll-content" 
        style={{ 
          height: '15000px',
          position: 'relative',
          zIndex: 1
        }} 
      />
    </div>
  );
}

export default App;