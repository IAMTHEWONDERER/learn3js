import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TourSlider from './TourSlider';
import Section2 from './section2';
import Section3 from './section3';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
  const sectionRef = useRef(null);
  const listWrapperRef = useRef(null);
  const listRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      ScrollTrigger.refresh();
    };

    const initScrollAnimation = () => {
      if (!listRef.current || !sectionRef.current || !listWrapperRef.current || isMobile) return;

      const totalWidth = listRef.current.clientWidth;
      const scrollDistance = totalWidth - window.innerWidth;

      const scrollAnimation = gsap.to(listRef.current, {
        x: () => -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      return scrollAnimation;
    };

    const timer = setTimeout(() => {
      const scrollAnimation = initScrollAnimation();
      ScrollTrigger.refresh(true);
      
      return () => {
        if (scrollAnimation) {
          scrollAnimation.kill();
        }
      };
    }, 100);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isMobile]);

  return (
    <section className="section side-scroll" ref={sectionRef}>
      <div className={`side-scroll-list-wrapper ${isMobile ? 'mobile' : ''}`} ref={listWrapperRef}>
        <div className={`side-scroll-list ${isMobile ? 'mobile' : ''}`} ref={listRef}>
          {/* Section 1 - Only visible on desktop */}
          {!isMobile && (
            <div className="side-scroll-item section-1">
              <div className="section-content">
                <h2>Section 1</h2>
                <p>This is the first section</p>
              </div>
            </div>
          )}
          <div className="side-scroll-item section-2">
            <Section2 />
          </div>
          <div className="side-scroll-item tour-slider">
            <TourSlider />
          </div>
          <div className="side-scroll-item section-3">
            <Section3 />
          </div>
        </div>
      </div>

      <style jsx>{`
        .section.side-scroll {
          padding: 0;
          margin: 0;
          overflow: hidden;
          width: 100%;
          position: relative;
        }
        .side-scroll-list-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          z-index: 2;
        }
        .side-scroll-list-wrapper.mobile {
          height: auto;
        }
        .side-scroll-list {
          position: absolute;
          display: flex;
          margin: 0;
          padding: 0;
          height: 100vh;
        }
        .side-scroll-list.mobile {
          position: relative;
          flex-direction: column;
          height: auto;
        }
        .side-scroll-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        /* Removed background image from all sections and added it only to specific sections */
        .section-1, .section-2, .tour-slider {
          background-image: url('/gain.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        /* Section 3 might need its own background or styling */
        .section-3 {
          background-image: url('/gain.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
        .section-content {
          padding: 2rem;
          color: white;
          text-align: center;
        }
        .section-1 {
          width: 100vw;
          height: 100vh;
          background-color: transparent;
        }
        .section-2 {
          width: ${isMobile ? '100%' : '70vw'};
          height: ${isMobile ? 'auto' : '100vh'};
          min-height: 100vh;
        }
        .tour-slider {
          width: ${isMobile ? '100%' : '60vw'};
          height: ${isMobile ? 'auto' : '100vh'};
          min-height: 100vh;
        }
        .section-3 {
          width: ${isMobile ? '100%' : '100vw'};
          height: ${isMobile ? 'auto' : '100vh'};
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .section.side-scroll {
            overflow: visible;
          }
          .side-scroll-list {
            width: 100%;
          }
          .side-scroll-item {
            width: 100%;
            min-height: 100vh;
          }
        }
      `}</style>
    </section>
  );
};

export default HorizontalScroll;