      import { useEffect, useRef } from "react";
      import Lenis from '@studio-freight/lenis';
      import HorizontalScroll from './HorizontalScroll'; // Import the horizontal scroll container

      function App() {
        const lenisRef = useRef(null);
      
        useEffect(() => {
          // Ensure initial scroll to top
          window.scrollTo(0, 0);
          // Initialize Lenis for smooth scrolling
          lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
          });
        
          // RAF function for Lenis
          function raf(time) {
            if (!lenisRef.current) return;
            lenisRef.current.raf(time);
            requestAnimationFrame(raf);
          }
        
          requestAnimationFrame(raf);
        
          return () => {
            if (lenisRef.current) {
              lenisRef.current.destroy();
            }
          };
        }, []);
      
        return (
          <div className="app-container">
            {/* Intro Section */}
            <div style={{
              height: '100vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              zIndex: 50,
              backgroundColor: 'white',
            }}>
              <div style={{ textAlign: 'center', maxWidth: '800px', padding: '20px' }}>
                <h2 style={{ fontSize: '3rem', fontFamily: "'Quinn', sans-serif" }}>Welcome to Our Experience</h2>
                <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                  Scroll down to explore both vertical and horizontal content
                </p>
              </div>
            </div>
          
            {/* Horizontal Scroll Section that contains the TourSlider */}
            <HorizontalScroll />
          
            {/* Final Section */}
            <div style={{
              padding: '80px 40px',
              background: '#f8f8f8',
              minHeight: '100vh'
            }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Final Section</h2>
              <p>Thanks for exploring our interactive scrolling experience!</p>
            </div>
          </div>
        );
      }

      export default App;