import React, { useMemo } from 'react';

const AnimatedSlides = ({ scrollPercentage }) => {
  // Array of slides with content
  const slides = [
    {
      title: "Modern Architecture",
      description: "Innovative designs reshaping our urban landscape",
      number: "01",
      svgPath: "M10,50 Q25,25 40,50 T70,50"
    },
    {
      title: "Sustainable Building",
      description: "Creating eco-friendly structures for a better tomorrow",
      number: "02",
      svgPath: "M10,30 Q40,10 50,50 T90,40"
    },
    {
      title: "Urban Living",
      description: "Redefining city life through thoughtful design",
      number: "03",
      svgPath: "M10,60 Q30,20 50,60 T90,30"
    }
  ];

  // Calculate which slide should be visible and its animation state
  const visibleSlideIndex = useMemo(() => {
    // We have 3 sequences in ThreeScene's animation
    // Map scroll percentage to the appropriate slide
    if (scrollPercentage < 0.33) return 0;
    if (scrollPercentage < 0.66) return 1;
    return 2;
  }, [scrollPercentage]);

  // Pre-calculate slide progress for all slides
  const slideProgresses = useMemo(() => {
    return slides.map((_, index) => {
      // Each slide takes up approximately 1/3 of the main scroll area
      const slideStart = index * 0.33;
      const slideEnd = slideStart + 0.33;
      
      // Calculate progress as a value between 0 and 1
      if (scrollPercentage < slideStart) return 0;
      if (scrollPercentage > slideEnd) return 1;
      
      return (scrollPercentage - slideStart) / (slideEnd - slideStart);
    });
  }, [scrollPercentage, slides]);

  // Pre-compute all slide styles to avoid calculations during render
  const slideStyles = useMemo(() => {
    return slides.map((_, index) => {
      const slideProgress = slideProgresses[index];
      
      // Entry animation (coming from right)
      let translateX = '100%';
      let opacity = 0;
      
      if (index === visibleSlideIndex) {
        // Entry animation (0% - 20% of slide duration)
        if (slideProgress < 0.2) {
          const entryProgress = slideProgress / 0.2;
          translateX = `${100 - (entryProgress * 100)}%`;
          opacity = entryProgress;
        }
        // Visible and stable (20% - 80% of slide duration)
        else if (slideProgress >= 0.2 && slideProgress < 0.8) {
          translateX = '0%';
          opacity = 1;
        }
        // Exit animation (80% - 100% of slide duration)
        else {
          const exitProgress = (slideProgress - 0.8) / 0.2;
          translateX = `${-100 * exitProgress}%`; // Exit to the left
          opacity = 1 - exitProgress;
        }
      }
      // Previous slides should be off-screen to the left
      else if (index < visibleSlideIndex) {
        translateX = '-100%';
      }
      // Future slides should be off-screen to the right
      else {
        translateX = '100%';
      }
      
      return {
        position: 'absolute',
        right: 0,
        width: '50%', // Take up half the screen width
        maxWidth: '600px',
        padding: '2rem',
        transform: `translateX(${translateX})`,
        opacity: opacity,
        willChange: 'transform, opacity', // Hint for browser optimization
        transition: index === visibleSlideIndex ? 'none' : 'transform 0.1s ease-out, opacity 0.1s ease-out',
      };
    });
  }, [slides, visibleSlideIndex, slideProgresses]);

  // Pre-compute SVG animations
  const svgAnimations = useMemo(() => {
    return slides.map((_, index) => {
      const progress = slideProgresses[index];
      
      if (index !== visibleSlideIndex) return {};
      
      // Rotate and scale based on progress
      const rotation = progress * 360; // Full rotation
      const scale = 0.8 + (Math.sin(progress * Math.PI) * 0.2); // Scale between 0.8 and 1.2
      
      return {
        transform: `rotate(${rotation}deg) scale(${scale})`,
        strokeDashoffset: 1000 - (progress * 1000),
        willChange: 'transform, stroke-dashoffset', // Hint for browser optimization
      };
    });
  }, [slides, visibleSlideIndex, slideProgresses]);

  return (
    <div className="animated-slides-container" 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
        zIndex: 20
      }}>
      
      {slides.map((slide, index) => (
        <div 
          key={index}
          className="slide"
          style={slideStyles[index]}
        >
          <div className="slide-number" 
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              opacity: 0.2,
              marginBottom: '-2rem',
              color: '#333'
            }}>
            {slide.number}
          </div>
          
          <h2 className="slide-title"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)', 
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#111'
            }}>
            {slide.title}
          </h2>
          
          <p className="slide-description"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              maxWidth: '80%',
              color: '#444'
            }}>
            {slide.description}
          </p>
          
          <div className="slide-svg"
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              transform: 'translateY(-50%)',
              width: '100%',
              height: '100%',
              opacity: 0.1,
              zIndex: -1
            }}>
            <svg 
              viewBox="0 0 100 100" 
              width="100%" 
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={slide.svgPath}
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeDasharray="1000"
                style={svgAnimations[index]}
              />
              <circle 
                cx="50" 
                cy="50" 
                r="30" 
                fill="none" 
                stroke="#000" 
                strokeWidth="1"
                strokeDasharray="1000"
                style={svgAnimations[index]}
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(AnimatedSlides);