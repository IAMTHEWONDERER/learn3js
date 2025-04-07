import React, { useRef, useEffect, useState } from "react";

function ZoomedText() {
  const [scale, setScale] = useState(1);
  const [percentage, setPercentage] = useState(100);
  const [curtainProgress, setCurtainProgress] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Adjusted configuration for faster zoom and slower reveal
  const ZOOM_RANGE = 0.3; // Reduced from 0.7 to make zooming faster
  const REVEAL_RANGE = 0.6 * ZOOM_RANGE; // Increased reveal range to slow down reveal

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    const handleScroll = () => {
      if (!container || !content) return;

      const scrollTop = container.scrollTop;
      const contentHeight = content.scrollHeight;
      const containerHeight = container.clientHeight;
      const scrollHeight = contentHeight - containerHeight;

      // Ensure scrollProgress is always between 0 and 1
      const scrollProgress = Math.min(1, Math.max(0, scrollTop / scrollHeight));

      // Zoom phase (now occurs over a smaller scroll range)
      if (scrollProgress <= ZOOM_RANGE) {
        const zoomProgress = scrollProgress / ZOOM_RANGE;
        const newScale = 1 + zoomProgress * 11;
        setScale(newScale);
        setPercentage(Math.round(100 + zoomProgress * 1100));
        setCurtainProgress(0);
      }
      // Reveal phase (slower and more gradual)
      else {
        const revealProgress = Math.min(
          1,
          (scrollProgress - ZOOM_RANGE) / REVEAL_RANGE
        );
        setCurtainProgress(revealProgress);
        setScale(12);
        setPercentage(1200);
      }
    };

    container.addEventListener("scroll", handleScroll);

    // Prevent horizontal scrolling
    const preventHorizontalScroll = (e) => {
      if (e.deltaX !== 0) {
        e.preventDefault();
      }
    };

    container.addEventListener("wheel", preventHorizontalScroll, {
      passive: false,
    });

    // Initial call to set up initial state
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", preventHorizontalScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        overscrollBehavior: "none",
        overflowX: "hidden",
        background: "#0a3c5c",
      }}
    >
      <div
        ref={contentRef}
        style={{
          height: "10000px",
          position: "relative",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
            fontSize: "10rem",
            color: "#0a3c5c",
            transition: "transform 0.2s",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          T
        </div>

        {/* Curtain System */}
        <div
          style={{
            position: "fixed",
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
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: `${50 - Math.min(1, curtainProgress) * 50}%`,
              height: "100%",
              background: "white",
              transition: "width 0.1s linear",
            }}
          />

          {/* Right Curtain */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: `${50 - Math.min(1, curtainProgress) * 50}%`,
              height: "100%",
              background: "white",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ZoomedText;
