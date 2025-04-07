import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const itemsRef = useRef([]);
  const scrubRefsRef = useRef({
    dimmerScrub: null,
    scrollerScrub: null,
    chromaEntry: null,
    chromaExit: null,
  });
  const sectionHeadingRef = useRef(null);

  // Fixed configuration
  const config = {
    animate: true,
    snap: true,
    start: 120,
    end: 900,
    scroll: true,
    debug: false,
    theme: "dark",
  };

  useEffect(() => {
    // Set initial theme and properties
    document.documentElement.dataset.theme = config.theme;
    document.documentElement.dataset.syncScrollbar = config.scroll;
    document.documentElement.dataset.animate = config.animate;
    document.documentElement.dataset.snap = config.snap;
    document.documentElement.dataset.debug = config.debug;

    document.documentElement.style.setProperty("--start", config.start);
    document.documentElement.style.setProperty("--hue", config.start);
    document.documentElement.style.setProperty("--end", config.end);

    // Check for scroll animation support
    if (
      !CSS.supports(
        "(animation-timeline: scroll()) and (animation-range: 0% 100%)"
      )
    ) {
      // Get numbers and sections
      const numberItems = gsap.utils.toArray(
        ".scroll_xj39_numbers_column .scroll_xj39_number_item"
      );
      const sectionHeading = sectionHeadingRef.current;
      const endSection = document.querySelector(".scroll_xj39_end_section");
      
      // Clean up any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Store references
      itemsRef.current = [...numberItems];
      
      // Create a master timeline for coordinated animations
      const masterTimeline = gsap.timeline();
      
      // Set up opacity animations (similar to the reference code)
      gsap.set(numberItems, { opacity: (i) => (i !== 0 ? 0.8 : 1) });
      
      const dimmer = gsap.timeline()
        .to(numberItems.slice(1), {
          opacity: 1,
          stagger: 0.5,
        })
        .to(
          numberItems.slice(0, numberItems.length - 1),
          {
            opacity: 0.8,
            stagger: 0.5,
          },
          0
        );
      
      // Set initial state of the heading
      if (sectionHeading) {
        gsap.set(sectionHeading, {
          y: "calc(50% - 0.5lh)",
          position: "sticky",
          top: "calc(50% - 0.5lh)",
        });
      }
      
      // Create heading animation for the last item
      const headingAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: numberItems[numberItems.length - 1],
          start: "center center",
          end: "bottom top",
          onEnter: () => {
            sectionHeading.classList.add("aligned-with-last");
          },
          onLeaveBack: () => {
            sectionHeading.classList.remove("aligned-with-last");
          },
          onUpdate: (self) => {
            // When we reach the last number, smoothly transition the heading
            if (self.progress > 0) {
              // Calculate position based on scroll progress
              const progress = Math.min(1, self.progress * 2); // Double speed for quicker alignment
              
              // Apply position based on progress
              if (progress < 1) {
                gsap.to(sectionHeading, {
                  y: `calc((1 - ${progress}) * (50% - 0.5lh))`,
                  position: progress >= 0.9 ? "relative" : "sticky", 
                  top: progress >= 0.9 ? "auto" : "calc(50% - 0.5lh)",
                  duration: 0.1,
                  overwrite: true
                });
              } else {
                gsap.set(sectionHeading, {
                  y: 0,
                  position: "relative",
                  top: "auto"
                });
              }
            } else {
              // When scrolling back, restore sticky positioning
              gsap.to(sectionHeading, {
                y: "calc(50% - 0.5lh)",
                position: "sticky",
                top: "calc(50% - 0.5lh)",
                duration: 0.1,
                overwrite: true
              });
            }
          },
          markers: config.debug
        }
      });
      
      // Create a ScrollTrigger for the end section
      if (endSection) {
        ScrollTrigger.create({
          trigger: endSection,
          start: "top bottom-=50",
          onEnter: () => {
            // Ensure heading stays in relative position when scrolling to fin section
            if (sectionHeading) {
              gsap.set(sectionHeading, {
                y: 0,
                position: "relative",
                top: "auto"
              });
              sectionHeading.classList.add("aligned-with-last");
            }
          },
          markers: config.debug
        });
      }
      
      // Create opacity/dimmer scrub
      const dimmerScrub = ScrollTrigger.create({
        trigger: numberItems[0],
        endTrigger: numberItems[numberItems.length - 1],
        start: "center center",
        end: "center center",
        animation: dimmer,
        scrub: 0.2,
      });
      
      // Color animation (hue change)
      const scroller = gsap.timeline().fromTo(
        document.documentElement,
        {
          "--hue": config.start,
        },
        {
          "--hue": config.end,
          ease: "none",
        }
      );
      
      const scrollerScrub = ScrollTrigger.create({
        trigger: numberItems[0],
        endTrigger: numberItems[numberItems.length - 1],
        start: "center center",
        end: "center center",
        animation: scroller,
        scrub: 0.2,
      });
      
      // Chroma animations
      const chromaEntry = gsap.fromTo(
        document.documentElement,
        {
          "--chroma": 0,
        },
        {
          "--chroma": 0.3,
          ease: "none",
          scrollTrigger: {
            scrub: 0.2,
            trigger: numberItems[0],
            start: "center center+=40",
            end: "center center",
          },
        }
      );
      
      const chromaExit = gsap.fromTo(
        document.documentElement,
        {
          "--chroma": 0.3,
        },
        {
          "--chroma": 0,
          ease: "none",
          scrollTrigger: {
            scrub: 0.2,
            trigger: numberItems[numberItems.length - 1],
            start: "center center",
            end: "center center-=40",
          },
        }
      );
      
      // Add snap functionality if enabled
      if (config.snap) {
        // Create snap points
        const snapPoints = numberItems.map(item => {
          return ScrollTrigger.create({
            trigger: item,
            start: "center center",
            markers: config.debug
          });
        });
        
        // Create a ScrollTrigger that controls snapping
        // but only until we reach the last number
        ScrollTrigger.create({
          trigger: numberItems[0],
          endTrigger: endSection,
          start: "center center",
          end: "top bottom",
          snap: {
            snapTo: (value, self) => {
              // Don't snap when scrolling past the last number
              if (self.direction > 0 && self.progress > 0.9) {
                return value;
              }
              
              const positions = snapPoints.map(
                trigger => trigger.start / ScrollTrigger.maxScroll(window)
              );
              
              // Find closest position based on scroll direction
              let closestPosition;
              if (self.direction > 0) {
                closestPosition = positions.find(pos => pos > value) || positions[positions.length - 1];
              } else {
                closestPosition = [...positions].reverse().find(pos => pos < value) || positions[0];
              }
              
              return closestPosition;
            },
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power2.out"
          },
          markers: config.debug
        });
      }
      
      // Store references for cleanup
      scrubRefsRef.current = {
        dimmerScrub,
        scrollerScrub,
        chromaEntry,
        chromaExit,
      };
    }

    return () => {
      // Cleanup ScrollTrigger instances
      Object.values(scrubRefsRef.current).forEach((trigger) => {
        if (trigger && trigger.scrollTrigger) {
          trigger.scrollTrigger.kill();
        } else if (trigger && trigger.kill) {
          trigger.kill();
        }
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Use single digits (1-5) for the actual numbers
  const numbersContent = ["1", "2", "3", "4", "5"];

  return (
    <div className="scroll_xj39_split_container">
      {/* Numbers Column */}
      <div className="scroll_xj39_numbers_column">
        <header className="scroll_xj39_header">
          <h1 className="scroll_xj39_title scroll_xj39_fluid">
            you can
            <br />
            scroll.
          </h1>
        </header>
        <main className="scroll_xj39_main">
          <section className="scroll_xj39_content scroll_xj39_fluid">
            <h2 className="scroll_xj39_section_heading" ref={sectionHeadingRef}>
              <span aria-hidden="true">0</span>{" "}
            </h2>
            <div className="scroll_xj39_content_container">
              <ul
                className="scroll_xj39_list"
                aria-hidden="true"
                style={{ "--count": numbersContent.length }}
              >
                {numbersContent.map((item, index) => (
                  <li
                    key={index}
                    className="scroll_xj39_list_item scroll_xj39_number_item"
                    style={{ "--i": index }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="scroll_xj39_end_section">
            <h2 className="scroll_xj39_end_heading scroll_xj39_fluid">fin.</h2>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;