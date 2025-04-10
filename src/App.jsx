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
  const gradientOverlayRef = useRef(null);

  // Fixed configuration
  const config = {
    animate: true,
    snap: true,
    start: 120,
    end: 900,
    scroll: true,
    debug: false,
    theme: "dark",
    bgColor: "#0a3c5c", // Using the specified background color
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
    document.documentElement.style.setProperty("--bg-color", config.bgColor);

    // Apply background color directly to container element and body
    const container = document.querySelector(".scroll_xj39_split_container");
    if (container) {
      container.style.backgroundColor = config.bgColor;
    }

    // Set body background color to match the container
    document.body.style.backgroundColor = config.bgColor;

    // Function to handle responsive adjustments
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      document.documentElement.style.setProperty(
        "--is-mobile",
        isMobile ? "1" : "0"
      );

      // Ensure consistent font sizes between 0 and numbers across all devices
      const sectionHeading = sectionHeadingRef.current;
      const numberItems = document.querySelectorAll(".scroll_xj39_number");

      if (sectionHeading) {
        const fontSize =
          window.innerWidth < 640
            ? "4rem"
            : window.innerWidth < 1024
            ? "5rem"
            : "6rem";

        // Apply consistent font size to section heading and all numbers
        sectionHeading.style.fontSize = fontSize;
        numberItems.forEach((item) => {
          item.style.fontSize = fontSize;
          item.style.width = fontSize;
        });
      }

      // Update GSAP animations based on screen size if needed
      if (
        scrubRefsRef.current.scrollerScrub &&
        scrubRefsRef.current.scrollerScrub.scrollTrigger
      ) {
        scrubRefsRef.current.scrollerScrub.scrollTrigger.refresh();
      }
    };

    // Initial call and event listener for resize
    handleResize();
    window.addEventListener("resize", handleResize);

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
      const gradientOverlay = gradientOverlayRef.current;

      // Clean up any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Store references
      itemsRef.current = [...numberItems];

      // Set up opacity animations
      gsap.set(numberItems, { opacity: (i) => (i !== 0 ? 0.8 : 1) });

      const dimmer = gsap
        .timeline()
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

      // Set initial state of the heading (0) - FIXED: Better containment
      if (sectionHeading) {
        gsap.set(sectionHeading, {
          y: "0",
          position: "sticky",
          top: "20%", // Position at top 20% for mobile view
          transform: "translateY(0)",
          zIndex: 10,
          opacity: 0.8,
        });

        // FIXED: Smoother animation for the "0" element with better bounds
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".scroll_xj39_content",
              start: "top 50%",
              end: "bottom 30%",
              scrub: true,
              toggleActions: "play none none reverse",
            },
          })
          .fromTo(
            sectionHeading,
            { scale: 1, opacity: 0.8 },
            { scale: 1.1, opacity: 1, duration: 0.5, ease: "power2.out" }
          )
          .to(sectionHeading, {
            scale: 1,
            opacity: 0.9,
            duration: 0.5,
            ease: "power2.in",
          });
      }

      // Setup gradient overlay effect
      if (gradientOverlay) {
        ScrollTrigger.create({
          trigger: ".scroll_xj39_content",
          start: "top top",
          end: "bottom bottom",
          pin: gradientOverlay,
          pinSpacing: false,
        });
      }

      // Alignment for the heading with last number
      if (lastNumberItem && sectionHeading) {
        const lastItemTrigger = ScrollTrigger.create({
          trigger: lastNumberItem,
          start: "center center",
          end: "bottom top",
          onEnter: () => {
            // When entering the last number, ensure perfect alignment
            sectionHeading.classList.add("aligned-with-last");

            // FIXED: Keep the animation controlled within bounds
            gsap.to(sectionHeading, {
              y: 0,
              position: "relative",
              top: "auto",
              transform: "none",
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                // Create a wrapper for 0 and 5 to keep them aligned
                const wrapper = document.createElement("div");
                wrapper.className = "zero-five-wrapper";

                // Check if wrapper doesn't already exist
                if (!document.querySelector(".zero-five-wrapper")) {
                  // Get the parent of the section heading
                  const headingParent = sectionHeading.parentElement;

                  // Position the wrapper where the heading was
                  headingParent.insertBefore(wrapper, sectionHeading);
                  wrapper.appendChild(sectionHeading);
                  wrapper.appendChild(lastNumberItem);
                }
              },
            });
          },
          onLeaveBack: () => {
            // When scrolling back from the last number, restore original layout
            sectionHeading.classList.remove("aligned-with-last");

            // Check if wrapper exists and restore original structure
            const wrapper = document.querySelector(".zero-five-wrapper");
            if (wrapper) {
              const headingParent = wrapper.parentElement;
              const list = document.querySelector(".scroll_xj39_list");

              // Restore original DOM structure
              headingParent.insertBefore(sectionHeading, wrapper);
              list.appendChild(lastNumberItem);
              wrapper.remove();

              // Reset the heading style
              gsap.to(sectionHeading, {
                y: 0,
                position: "sticky",
                top: "20%", // Position at top 20% for mobile view
                transform: "translateY(0)",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
          markers: config.debug,
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
                top: "auto",
                transform: "none",
              });
            }
          },
          markers: config.debug,
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
        const snapPoints = numberItems.map((item) => {
          return ScrollTrigger.create({
            trigger: item,
            start: "center center",
            markers: config.debug,
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
                const endSectionTop =
                  ScrollTrigger.create({
                    trigger: endSection,
                    start: "top bottom",
                  }).start / ScrollTrigger.maxScroll(window);

                // Disable snapping when close to or inside the end section
                if (value >= endSectionTop - 0.05) {
                  return value; // No snapping
                }
              }

              const positions = snapPoints.map(
                (trigger) => trigger.start / ScrollTrigger.maxScroll(window)
              );

              // Find closest position based on scroll direction
              let closestPosition;
              if (self.direction > 0) {
                closestPosition =
                  positions.find((pos) => pos > value) ||
                  positions[positions.length - 1];
              } else {
                closestPosition =
                  [...positions].reverse().find((pos) => pos < value) ||
                  positions[0];
              }

              return closestPosition;
            },
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: "power2.out",
          },
          markers: config.debug,
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

      // Remove event listener
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Define the number and text content with longer paragraphs
  const contentItems = [
    {
      number: "1",
      text: "Scroll down to explore our journey through the digital landscape. We've pioneered innovative approaches to solving complex problems, combining technology with human-centered design principles to create meaningful experiences that resonate with users across diverse platforms.",
    },
    {
      number: "2",
      text: "Discover our innovative approach to tackling challenges in today's rapidly evolving technological environment. By integrating cutting-edge technologies with strategic thinking, we develop solutions that not only address immediate needs but also anticipate future developments, ensuring sustainable and forward-looking outcomes.",
    },
    {
      number: "3",
      text: "Learn about our unique solutions that bridge the gap between technical complexity and user-friendly experiences. Our interdisciplinary team works collaboratively to create tailored systems that adapt to changing requirements while maintaining core functionality, all backed by robust architecture and thoughtful implementation strategies.",
    },
    {
      number: "4",
      text: "See the impact of our work across industries and communities worldwide. Through careful analysis, strategic deployment, and continuous improvement cycles, we've delivered measurable results that transform how organizations operate, how people interact with technology, and how value is created in digital ecosystems.",
    },
    {
      number: "5",
      text: "Join us in creating the future where technology empowers rather than complicates, where innovation serves human needs, and where thoughtful design leads to more equitable and accessible experiences. Together, we can build systems that not only function effectively but also contribute positively to individual lives and broader social contexts.",
    },
  ];

  return (
    <div className="scroll_xj39_split_container">
      {/* Gradient overlay that stays stationary */}
      <div
        className="scroll_xj39_gradient_overlay"
        ref={gradientOverlayRef}
      ></div>

      <div className="scroll_xj39_two_column_layout">
        {/* Numbers Column - Now with improved spacing */}
        <div className="scroll_xj39_numbers_column">
          <header className="scroll_xj39_header"> </header>
          <main className="scroll_xj39_main">
            <section className="scroll_xj39_content scroll_xj39_fluid">
              <h2
                className="scroll_xj39_section_heading"
                ref={sectionHeadingRef}
              >
                <span aria-hidden="true">0</span>{" "}
              </h2>
              <div className="scroll_xj39_content_container">
                <ul
                  className="scroll_xj39_list"
                  aria-hidden="true"
                  style={{ "--count": contentItems.length }}
                >
                  {contentItems.map((item, index) => (
                    <li
                      key={index}
                      className={`scroll_xj39_list_item scroll_xj39_number_item ${
                        index === contentItems.length - 1
                          ? "scroll_xj39_last_number"
                          : ""
                      }`}
                      style={{ "--i": index }}
                    >
                      <div className="scroll_xj39_number_text_container">
                        <span className="scroll_xj39_number">
                          {item.number}
                        </span>
                        <span className="scroll_xj39_text">{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            <section className="scroll_xj39_end_section">
              {/* Empty end section */}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
