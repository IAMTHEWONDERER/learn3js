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
      // Get numbers and paragraphs
      const numbersItems = gsap.utils.toArray(
        ".scroll_xj39_numbers_column .scroll_xj39_number_item"
      );
      const paragraphsItems = gsap.utils.toArray(
        ".scroll_xj39_paragraphs_column .scroll_xj39_paragraph_item"
      );
      const sectionHeading = sectionHeadingRef.current;

      // Store all items for reference
      itemsRef.current = [...numbersItems, ...paragraphsItems];

      // Set initial opacity states
      gsap.set(numbersItems, { opacity: (i) => (i !== 0 ? 0.2 : 1) });
      gsap.set(paragraphsItems, { opacity: (i) => (i !== 0 ? 0 : 1) });

      // Clear any existing ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Create synchronized animations for each pair
      numbersItems.forEach((item, index) => {
        const paragraph = paragraphsItems[index];

        ScrollTrigger.create({
          trigger: item,
          start: "center center",
          end: "center center+=100",
          onEnter: () => {
            gsap.to(numbersItems, { opacity: 0.2, duration: 0.3 });
            gsap.to(paragraphsItems, { opacity: 0, duration: 0.3 });
            gsap.to(item, { opacity: 1, duration: 0.3 });
            gsap.to(paragraph, { opacity: 1, duration: 0.3 });

            // Handle sticky behavior for "0" and alignment with "5"
            if (index === numbersItems.length - 1 && sectionHeading) {
              gsap.to(sectionHeading, {
                y: 0,
                position: "relative",
                top: "auto",
                duration: 0.3,
                onComplete: () => {
                  sectionHeading.classList.add("aligned-with-last");
                },
              });
            } else if (sectionHeading) {
              gsap.to(sectionHeading, {
                y: "calc(50% - 0.5lh)",
                position: "sticky",
                top: "calc(50% - 0.5lh)",
                duration: 0.3,
                onComplete: () => {
                  sectionHeading.classList.remove("aligned-with-last");
                },
              });
            }
          },
          onEnterBack: () => {
            gsap.to(numbersItems, { opacity: 0.2, duration: 0.3 });
            gsap.to(paragraphsItems, { opacity: 0, duration: 0.3 });
            gsap.to(item, { opacity: 1, duration: 0.3 });
            gsap.to(paragraph, { opacity: 1, duration: 0.3 });

            if (sectionHeading) {
              gsap.to(sectionHeading, {
                y: "calc(50% - 0.5lh)",
                position: "sticky",
                top: "calc(50% - 0.5lh)",
                duration: 0.3,
              });
            }
          },
          id: `number-${index}`,
          markers: config.debug,
        });
      });

      // Snapping configuration
      const snapTriggers = numbersItems.map((item) =>
        ScrollTrigger.create({
          trigger: item,
          start: "center center",
          markers: config.debug,
        })
      );

      const dimmerScrub = ScrollTrigger.create({
        trigger: numbersItems[0],
        endTrigger: numbersItems[numbersItems.length - 1],
        start: "center center",
        end: "center center",
        scrub: 0.2,
        snap: config.snap
          ? {
              snapTo: (value, self) => {
                const direction = self.direction;
                const positions = snapTriggers.map(
                  (trigger) => trigger.start / ScrollTrigger.maxScroll(window)
                );
                let closestPosition;
                if (direction > 0) {
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
              duration: { min: 0.2, max: 1 },
              delay: 0.1,
              ease: "power1.inOut",
            }
          : false,
      });

      // Color animation
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
        trigger: numbersItems[0],
        endTrigger: numbersItems[numbersItems.length - 1],
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
            trigger: numbersItems[0],
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
            trigger: numbersItems[numbersItems.length - 1],
            start: "center center",
            end: "center center-=40",
          },
        }
      );

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

  // Use single digits (1-5) for the actual numbers since "0" is separate
  const numbersContent = ["1", "2", "3", "4", "5"];

  // Paragraphs content
  const paragraphsContent = [
    "Start with the basics. The foundation is what matters most when building something to last.",
    "Explore the possibilities. Innovation happens when we push beyond conventional boundaries.",
    "Refine your approach. Iteration is the key to perfection in any creative endeavor.",
    "Test and validate. Assumptions must be challenged through rigorous experimentation.",
    "Share your creation. The ultimate purpose of making is to connect with others.",
  ];

  return (
    <div className="scroll_xj39_split_container">
      {/* Left Column with Numbers */}
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

      {/* Right Column with Paragraphs */}
      <div className="scroll_xj39_paragraphs_column">
        <header className="scroll_xj39_header">
          <h1 className="scroll_xj39_title scroll_xj39_fluid">
            scroll to
            <br />
            explore.
          </h1>
        </header>
        <main className="scroll_xj39_main">
          <section className="scroll_xj39_content scroll_xj39_fluid">
            <h2 className="scroll_xj39_section_heading">
              <span className="scroll_xj39_sr_only">explanations</span>
            </h2>
            <div className="scroll_xj39_content_container">
              <ul
                className="scroll_xj39_list"
                aria-hidden="true"
                style={{ "--count": paragraphsContent.length }}
              >
                {paragraphsContent.map((item, index) => (
                  <li
                    key={index}
                    className="scroll_xj39_paragraph_item"
                    style={{ "--i": index }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className="scroll_xj39_end_section">
            <h2 className="scroll_xj39_end_heading scroll_xj39_fluid">end.</h2>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
