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
  
  const THREEJS_FPS_LIMIT = 30;
  const FRAME_MIN_TIME = (1000 / 60) * (60 / THREEJS_FPS_LIMIT) - (1000 / 60) * 0.5;

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    const handleScroll = () => {
      if (!lenisRef.current) return;

      const scrollTop = lenisRef.current.scroll;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableHeight = documentHeight - windowHeight;

      const percentage = Math.min(scrollTop / scrollableHeight, 1);
      setScrollPercentage(percentage);
      scrollPositionRef.current = scrollTop;
    };

    function raf(time) {
      if (!lenisRef.current) return;

      lenisRef.current.raf(time);

      const now = performance.now();
      const elapsed = now - lastUpdateTimeRef.current;

      if (elapsed > FRAME_MIN_TIME) {
        lastUpdateTimeRef.current = now - (elapsed % FRAME_MIN_TIME);
        window.THREEJS_SHOULD_UPDATE = true;
      } else {
        window.THREEJS_SHOULD_UPDATE = false;
      }

      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);
    lenisRef.current.on('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (lenisRef.current) lenisRef.current.destroy();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.THREEJS_SHOULD_UPDATE = undefined;
    };
  }, []);

  // Adjusted scroll percentage to account for the 200vh intro section
  const adjustedScrollPercentage = useMemo(() => {
    const introHeightVh = 200; // Intro section height in vh
    const introHeightPx = (introHeightVh * window.innerHeight) / 100; // Convert to pixels
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;

    // Start animation only after intro section
    const scrollPastIntro = Math.max(0, scrollPositionRef.current - introHeightPx);
    const adjustedTotalScrollable = scrollableHeight - introHeightPx;
    return Math.min(scrollPastIntro / adjustedTotalScrollable, 1);
  }, [scrollPercentage]);

  // Updated containerStyles to start animation after intro section
  const containerStyles = useMemo(() => {
    let translateX = '-100%';
    let opacity = 0;

    if (adjustedScrollPercentage < 0.1) {
      // Entry animation (starts after intro section)
      const progress = adjustedScrollPercentage / 0.1;
      translateX = `${-100 + (progress * 67)}%`;
      opacity = progress;
    } else if (adjustedScrollPercentage >= 0.1 && adjustedScrollPercentage < 0.7) {
      // Visible and stable
      translateX = '-33%';
      opacity = 1;
    } else if (adjustedScrollPercentage >= 0.7) {
      // Exit animation
      const progress = (adjustedScrollPercentage - 0.7) / 0.3;
      translateX = `${-33 - (progress * 67)}%`;
      opacity = 1 - progress;
    }

    return {
      transform: `translateX(${translateX})`,
      opacity: opacity,
      willChange: 'transform, opacity',
    };
  }, [adjustedScrollPercentage]);

  // Adjusted mainAnimationPercentage for AnimatedSlides
  const mainAnimationPercentage = useMemo(() => {
    if (adjustedScrollPercentage < 0.1) return 0;
    if (adjustedScrollPercentage > 0.7) return 1;
    return (adjustedScrollPercentage - 0.1) / 0.6;
  }, [adjustedScrollPercentage]);

  return (
    <div className="app-container">
      <div
        className="intro-section"
        style={{
          height: '200vh',
          backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <h1
          style={{
            color: 'black',
            fontSize: '4rem',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Fixing This
        </h1>
      </div>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 5,
        }}
      >
        <AnimatedSlides scrollPercentage={mainAnimationPercentage} />
      </div>

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
          ...containerStyles,
        }}
      >
        <ThreeScene
          scrollPosition={scrollPositionRef.current}
          throttleFps={THREEJS_FPS_LIMIT}
        />
      </div>

      <div
        className="scroll-content"
        style={{
          height: '7500px',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  );
}

export default App;