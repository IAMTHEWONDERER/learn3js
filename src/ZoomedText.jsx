import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ZoomedText() {
  const zoomInRef = useRef(null);
  const textContainerRef = useRef(null);
  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const componentRef = useRef(null); // Reference to the entire component
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  const timelineRef = useRef(null);
  const scrollTriggerInstanceRef = useRef(null);
  const componentIdRef = useRef(`zoomed-text-${Date.now()}`);

  // Main color
  const mainColor = "#0a3c5c";

  useEffect(() => {
    // Ensure we only register Scr  ollTrigger on the client
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Handle window resize
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !zoomInRef.current) return;

    // Cleanup previous instances first
    if (scrollTriggerInstanceRef.current) {
      scrollTriggerInstanceRef.current.kill();
      scrollTriggerInstanceRef.current = null;
    }

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    // Delay initialization to allow ScrollTrigger to properly initialize
    const initDelay = setTimeout(() => {
      // Force a ScrollTrigger refresh before creating our animation
      ScrollTrigger.refresh();

      // Create animation in its own context with local scope
      const ctx = gsap.context(() => {
        const innerHeight = window.innerHeight;

        // Apply initial text rendering optimizations
        if (textContainerRef.current) {
          applyTextRenderingStyles(textContainerRef.current);
        }

        // Calculate responsive font size
        const responsiveFontSize = Math.min(screenSize.width * 0.18, 200);
        if (textContainerRef.current) {
          // Apply font size to both text elements inside the container
          const textElements =
            textContainerRef.current.querySelectorAll(".zoom-text-item");
          textElements.forEach((el) => {
            el.style.fontSize = `${responsiveFontSize}px`;
          });
        }

        // Create an independent scroll marker for this component
        const markerElement = document.createElement("div");
        markerElement.id = `zoomed-marker-${componentIdRef.current}`;
        markerElement.style.position = "absolute";
        markerElement.style.top = "0";
        markerElement.style.left = "0";
        markerElement.style.width = "1px";
        markerElement.style.height = "1px";
        markerElement.style.visibility = "hidden";
        markerElement.style.pointerEvents = "none";
        document.body.appendChild(markerElement);

        // Wait for all previous GSAP animations to be established
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        // Create a master timeline with unique ID
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: zoomInRef.current,
            pin: true,
            start: "top top",
            end: `+=${innerHeight * 8}`,
            scrub: true,
            invalidateOnRefresh: true,
            immediateRender: true,
            id: componentIdRef.current,
            markers: false,
            pinSpacing: true,
            anticipatePin: 1,
            overwrite: "auto",
            fastScrollEnd: true,
            preventOverlaps: true,
            onEnter: () => {
              // Increase z-index when entering
              if (componentRef.current) {
                componentRef.current.style.zIndex = "20";
                componentRef.current.style.visibility = "visible";
              }
            },
            onLeave: () => {
              // Lower z-index when leaving
              if (componentRef.current) {
                componentRef.current.style.zIndex = "1";
              }
              // Hide curtains
              gsap.set([leftCurtainRef.current, rightCurtainRef.current], {
                visibility: "hidden",
              });
            },
            onEnterBack: () => {
              // Restore z-index when coming back
              if (componentRef.current) {
                componentRef.current.style.zIndex = "20";
                componentRef.current.style.visibility = "visible";
              }
              // Show curtains again
              gsap.set([leftCurtainRef.current, rightCurtainRef.current], {
                visibility: "visible",
              });
            },
            onLeaveBack: () => {
              // Reset z-index when leaving
              if (componentRef.current) {
                componentRef.current.style.zIndex = "1";
              }
            },
          },
        });

        // Store reference to the timeline and ScrollTrigger
        timelineRef.current = masterTimeline;
        scrollTriggerInstanceRef.current = ScrollTrigger.getById(
          componentIdRef.current
        );

        // First part of animation: text zoom from scale 1 to 23
        masterTimeline.fromTo(
          textContainerRef.current,
          { scale: 1, autoRound: false, force3D: true },
          {
            scale: 23,
            duration: 0.6,
            ease: "power1.inOut",
          }
        );

        // Second part: curtain animation - starting when scale reaches 60% of final value
        masterTimeline.fromTo(
          [leftCurtainRef.current, rightCurtainRef.current],
          { width: "50%" },
          {
            width: "0%",
            duration: 0.6,
            ease: "power1.inOut",
          },
          0.36
        );

        // Make sure our component is visible
        if (componentRef.current) {
          componentRef.current.style.opacity = 1;
        }
      }, zoomInRef); // Scope to the section element

      return () => {
        // Cleanup context
        ctx.revert();

        // Remove marker element
        const markerElement = document.getElementById(
          `zoomed-marker-${componentIdRef.current}`
        );
        if (markerElement) {
          document.body.removeChild(markerElement);
        }
      };
    }, 500); // Delay initialization to avoid conflicts

    // Return cleanup function
    return () => {
      clearTimeout(initDelay);

      // First kill the ScrollTrigger
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }

      // Then kill the timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Remove marker element
      const markerElement = document.getElementById(
        `zoomed-marker-${componentIdRef.current}`
      );
      if (markerElement) {
        document.body.removeChild(markerElement);
      }
    };
  }, [screenSize]); // Re-run when screen size changes

  // Function to apply consistent text rendering styles
  const applyTextRenderingStyles = (element) => {
    element.style.textRendering = "optimizeLegibility";
    element.style.webkitFontSmoothing = "antialiased";
    element.style.mozOsxFontSmoothing = "grayscale";
    element.style.fontKerning = "normal";
    element.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={componentRef}
      style={{
        position: "relative",
        zIndex: 1,
        opacity: 0, // Start hidden to avoid flash
        transition: "opacity 0.14s ease",
        marginTop: "100vh", // Add margin to ensure clear separation
      }}
      className={`zoomed-text-component-${componentIdRef.current}`}
    >
      <section
        ref={zoomInRef}
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: mainColor,
        }}
        className="zoomed-text-section"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: mainColor,
            zIndex: 1,
          }}
        ></div>

        {/* Text container with both texts */}
        <div
          ref={textContainerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textRendering: "optimizeLegibility",
            willChange: "transform",
            transformOrigin: "center 25%",
            backfaceVisibility: "hidden",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            fontKerning: "normal",
            padding: `${Math.min(screenSize.width * 0.04, 40)}px 0`,
            color: mainColor,
            zIndex: 3,
          }}
          className="zoomed-text-container"
        >
          <div
            className="zoom-text-item enter-text"
            style={{
              fontFamily: "Quinn, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: `${Math.min(screenSize.width * 0.18, 200)}px`,
              letterSpacing: "0",
              textAlign: "center",
              lineHeight: "0.9",
              margin: 0,
              padding: 0,
              display: "block",
              paddingRight: `${Math.min(screenSize.width * 0.05, 10)}px`,
            }}
          >
            ENTER
          </div>
          <div
            className="zoom-text-item"
            style={{
              fontFamily: "Quinn, system-ui, sans-serif",
              fontWeight: 900,
              fontSize: `${Math.min(screenSize.width * 0.18, 200)}px`,
              letterSpacing: "0",
              textAlign: "center",
              lineHeight: "0.9",
              margin: 0,
              padding: 0,
              display: "block",
            }}
          >
            TECHNIQ8
          </div>
        </div>

        {/* Curtain System */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Left Curtain */}
          <div
            ref={leftCurtainRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "100%",
              background: "white",
            }}
          />

          {/* Right Curtain */}
          <div
            ref={rightCurtainRef}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              background: "white",
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default ZoomedText;
