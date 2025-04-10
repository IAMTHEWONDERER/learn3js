import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TourSlider from "./TourSlider";
import Section2 from "./section2";
import Section3 from "./section3";

const HorizontalScroll = ({ onComplete }) => {
  const sectionRef = useRef(null);
  const listWrapperRef = useRef(null);
  const listRef = useRef(null);
  const componentRef = useRef(null); // Reference to the entire component
  const [isMobile, setIsMobile] = useState(false);
  const hasCompleted = useRef(false);

  // Create unique ID for this component instance
  const componentIdRef = useRef(`horizontal-scroll-${Date.now()}`);
  const timelineRef = useRef(null);
  const scrollTriggerInstanceRef = useRef(null);

  useEffect(() => {
    // Ensure we only register ScrollTrigger on the client
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Set initial mobile state
    setIsMobile(window.innerWidth <= 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Only refresh this component's ScrollTrigger
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.refresh();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    // Cleanup previous instances first
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const initScrollAnimation = () => {
      if (!listRef.current || !sectionRef.current || isMobile) return null;

      // Create animation in its own context with local scope
      const ctx = gsap.context(() => {
        const totalWidth = listRef.current.clientWidth;
        const scrollDistance = totalWidth - window.innerWidth;

        // Create a new GSAP animation scoped to this component
        const scrollAnimation = gsap.to(listRef.current, {
          x: () => -scrollDistance,
          ease: "none",
          scrollTrigger: {
            id: componentIdRef.current,
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            markers: false,
            onEnter: () => {
              console.log(`${componentIdRef.current} animation entered`);
              // Increase z-index when this section enters viewport
              if (componentRef.current) {
                componentRef.current.style.zIndex = "10";
                componentRef.current.style.visibility = "visible";
              }
            },
            onLeave: () => {
              if (!hasCompleted.current && !isMobile) {
                hasCompleted.current = true;
                onComplete && onComplete();
                console.log(`${componentIdRef.current} animation completed`);
              }
              // Reset z-index when section leaves viewport
              if (componentRef.current) {
                componentRef.current.style.zIndex = "1";
              }
            },
            onEnterBack: () => {
              // Restore z-index when scrolling back
              if (componentRef.current) {
                componentRef.current.style.zIndex = "10";
                componentRef.current.style.visibility = "visible";
              }
            },
            onLeaveBack: () => {
              // Reset z-index when scrolling back out
              if (componentRef.current) {
                componentRef.current.style.zIndex = "1";
              }
            },
          },
        });

        // Store references for cleanup
        timelineRef.current = scrollAnimation;
        scrollTriggerInstanceRef.current = ScrollTrigger.getById(
          componentIdRef.current
        );
      }, sectionRef); // Scope to the section element

      return ctx;
    };

    // Initialize the animation after a short delay
    const timer = setTimeout(() => {
      const ctx = initScrollAnimation();

      return () => {
        if (ctx) {
          ctx.revert();
        }
      };
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);

      // Kill specific ScrollTrigger instance for this component
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }

      // Kill specific GSAP animation for this component
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      hasCompleted.current = false; // Reset completion status
    };
  }, [isMobile, onComplete]);

  const componentStyle = {
    position: "relative",
    zIndex: 1, // Default z-index
    containment: "layout", // Use CSS containment for better performance
  };

  return (
    <div
      ref={componentRef}
      style={componentStyle}
      className={`horizontal-scroll-wrapper-${componentIdRef.current}`}
    >
      <section
        className={`section side-scroll horizontal-scroll-component-${componentIdRef.current}`}
        ref={sectionRef}
      >
        <div
          className={`side-scroll-list-wrapper ${isMobile ? "mobile" : ""}`}
          ref={listWrapperRef}
        >
          <div
            className={`side-scroll-list ${isMobile ? "mobile" : ""}`}
            ref={listRef}
          >
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
          .section-1,
          .section-2,
          .tour-slider,
          .section-3 {
            background-image: url("https://res.cloudinary.com/dyecicotf/image/upload/v1742398022/gain_dea69g.png");
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
          }
          .section-2 {
            width: ${isMobile ? "100%" : "60vw"};
            height: ${isMobile ? "auto" : "100vh"};
            min-height: 100vh;
          }
          .tour-slider {
            width: ${isMobile ? "100%" : "80vw"};
            height: ${isMobile ? "auto" : "100vh"};
            min-height: 100vh;
          }
          .section-3 {
            width: ${isMobile ? "100%" : "100vw"};
            height: ${isMobile ? "auto" : "100vh"};
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
    </div>
  );
};

export default HorizontalScroll;
