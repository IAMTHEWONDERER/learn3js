  import React, { useEffect, useRef, useState } from 'react';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import TourSlider from './TourSlider';

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

        const scrollAnimation = gsap.to(listRef.current, {
          x: () => -(listRef.current.clientWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${listRef.current.clientWidth - window.innerWidth}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        return scrollAnimation;
      };

      const scrollAnimation = initScrollAnimation();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (scrollAnimation) {
          scrollAnimation.kill();
        }
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [isMobile]);

    return (
      <section className="section side-scroll" ref={sectionRef}>
        <div className="background-image" />
        <div className={`side-scroll-list-wrapper ${isMobile ? 'mobile' : ''}`} ref={listWrapperRef}>
          <div className={`side-scroll-list ${isMobile ? 'mobile' : ''}`} ref={listRef}>
            <div className="side-scroll-item section-2">Section 2</div>
            <div className="side-scroll-item tour-slider">
              <TourSlider />
            </div>
            <div className="side-scroll-item section-3">Section 3</div>
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
          .background-image {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-image: url('/gain.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: 1;
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
          }
          .side-scroll-list.mobile {
            position: relative;
            flex-direction: column;
          }
          .side-scroll-item {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(24px, 4vw, 32px);
            flex-shrink: 0;
            background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
          }
          .section-2 {
            width: ${isMobile ? '100%' : '75vw'};
            height: 100vh;
          }
          .tour-slider {
            width: ${isMobile ? '100%' : '70vw'};
            height: 100vh;
          }
          .section-3 {
            width: ${isMobile ? '100%' : '75vw'};
            height: 100vh;
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
            }
          }
        `}</style>
      </section>
    );
  };

  export default HorizontalScroll;
