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
      const lastNumberItem = numberItems[numberItems.length - 1];
      
      // Clean up any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      
      // Store references
      itemsRef.current = [...numberItems];
      
      // Set up opacity animations
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
      
      // Alignment for the heading with last number
      // This is a critical part for the "0" to align with "5"
      if (lastNumberItem && sectionHeading) {
        const lastItemTrigger = ScrollTrigger.create({
          trigger: lastNumberItem,
          start: "center center",
          end: "bottom top",
          onEnter: () => {
            // When entering the last number, ensure perfect alignment
            sectionHeading.classList.add("aligned-with-last");
            
            // Ensure the heading is perfectly aligned with the last number
            gsap.to(sectionHeading, {
              y: 0,
              position: "relative",
              top: "auto",
              duration: 0.1,
              onComplete: () => {
                // Create a wrapper for 0 and 5 to keep them aligned
                const wrapper = document.createElement('div');
                wrapper.className = 'zero-five-wrapper';
                
                // Check if wrapper doesn't already exist
                if (!document.querySelector('.zero-five-wrapper')) {
                  // Get the parent of the section heading
                  const headingParent = sectionHeading.parentElement;
                  const contentContainer = document.querySelector('.scroll_xj39_content_container');
                  
                  // Position the wrapper where the heading was
                  headingParent.insertBefore(wrapper, sectionHeading);
                  wrapper.appendChild(sectionHeading);
                  wrapper.appendChild(lastNumberItem);
                }
              }
            });
          },
          onLeaveBack: () => {
            // When scrolling back from the last number, restore original layout
            sectionHeading.classList.remove("aligned-with-last");
            
            // Check if wrapper exists and restore original structure
            const wrapper = document.querySelector('.zero-five-wrapper');
            if (wrapper) {
              const headingParent = wrapper.parentElement;
              const contentContainer = document.querySelector('.scroll_xj39_content_container');
              const list = document.querySelector('.scroll_xj39_list');
              
              // Restore original DOM structure
              headingParent.insertBefore(sectionHeading, wrapper);
              list.appendChild(lastNumberItem);
              wrapper.remove();
              
              // Reset the heading style
              gsap.to(sectionHeading, {
                y: "calc(50% - 0.5lh)",
                position: "sticky",
                top: "calc(50% - 0.5lh)",
                duration: 0.1
              });
            }
          },
          markers: config.debug
        });
      }
      
      // Create a ScrollTrigger for the end section
      if (endSection) {
        ScrollTrigger.create({
          trigger: endSection,
          start: "top bottom-=50",
          onEnter: () => {
            // Ensure heading stays with last number when scrolling to fin section
            if (sectionHeading) {
              sectionHeading.classList.add("aligned-with-last");
              gsap.set(sectionHeading, {
                y: 0,
                position: "relative",
                top: "auto"
              });
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
        ScrollTrigger.create({
          trigger: numberItems[0],
          endTrigger: numberItems[numberItems.length - 1],
          start: "center center",
          end: "bottom top",
          snap: {
            snapTo: (value, self) => {
              // Only snap when away from the end section
              if (endSection) {
                const endSectionTop = ScrollTrigger.create({
                  trigger: endSection,
                  start: "top bottom",
                }).start / ScrollTrigger.maxScroll(window);
                
                // Disable snapping when close to or inside the end section
                if (value >= endSectionTop - 0.05) {
                  return value; // No snapping
                }
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
                    className={`scroll_xj39_list_item scroll_xj39_number_item ${
                      index === numbersContent.length - 1 ? "scroll_xj39_last_number" : ""
                    }`}
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