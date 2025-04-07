import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const ScrollDemo = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Check if ScrollTrigger animations are supported
    if (
      !CSS.supports(
        "(animation-timeline: scroll()) and (animation-range: 0% 100%)"
      )
    ) {
      const items = gsap.utils.toArray(".scroll-list-item");

      gsap.set(items, { opacity: (i) => (i !== 0 ? 0.2 : 1) });

      const dimmer = gsap
        .timeline()
        .to(items.slice(1), {
          opacity: 1,
          stagger: 0.5,
        })
        .to(
          items.slice(0, items.length - 1),
          {
            opacity: 0.2,
            stagger: 0.5,
          },
          0
        );

      ScrollTrigger.create({
        trigger: items[0],
        endTrigger: items[items.length - 1],
        start: "center center",
        end: "center center",
        animation: dimmer,
        scrub: 0.2,
      });
    }
  }, []);

  return (
    <>
      <style jsx>{`
        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .page-header {
          min-height: 100vh;
          display: flex;
          align-items: center;
          width: 100%;
          padding-inline: 5rem;
        }

        .main-title {
          font-size: clamp(24px, 8vw, 120px);
          text-wrap: pretty;
          line-height: 0.8;
          margin: 0;
          background: linear-gradient(
            to bottom,
            canvasText 60%,
            color-mix(in oklch, canvas, canvasText)
          );
          background-clip: text;
          color: transparent;
        }

        .main-content {
          width: 100%;
        }

        .section-content {
          padding-left: 5rem;
        }

        .section-header {
          position: sticky;
          top: calc(50% - 0.5lh);
          display: inline-block;
          height: fit-content;
          font-weight: 600;
          font-size: inherit;
          margin: 0;
        }

        .scroll-list {
          font-weight: 600;
          padding-inline: 0;
          margin: 0;
          list-style-type: none;
        }

        .scroll-list-item {
          opacity: 0.2;
        }

        .scroll-list-item:first-child,
        .scroll-list-item:last-child {
          opacity: 1;
        }

        .final-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .final-title {
          font-size: clamp(24px, 8vw, 120px);
          font-weight: 600;
          background: linear-gradient(
            to bottom,
            canvasText 50%,
            color-mix(in oklch, canvas, canvasText 25%)
          );
          background-clip: text;
          color: transparent;
        }

        .page-footer {
          padding-block: 2rem;
          opacity: 0.5;
        }

        .bear-link {
          position: fixed;
          top: 1rem;
          left: 1rem;
          width: 3rem;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          opacity: 0.8;
          color: canvasText;
        }

        .bear-link:hover,
        .bear-link:focus-visible {
          opacity: 1;
        }

        .bear-link svg {
          width: 2.25rem;
        }
      `}</style>

      <div className="page-container">
        <header className="page-header">
          <h1 className="main-title">
            you can
            <br />
            scroll.
          </h1>
        </header>

        <main className="main-content">
          <section className="section-content">
            <h2 className="section-header">
              <span aria-hidden="true">you can&nbsp;</span>
              <span className="sr-only">you can ship things.</span>
            </h2>

            <ul
              aria-hidden="true"
              className="scroll-list"
              style={{
                "--count": 22,
                "--start": 0,
                "--end": 360,
                "--lightness": "65%",
                "--base-chroma": 0.3,
              }}
            >
              {[
                "design.",
                "prototype.",
                "solve.",
                "build.",
                "develop.",
                "debug.",
                "learn.",
                "cook.",
                "ship.",
                "prompt.",
                "collaborate.",
                "create.",
                "inspire.",
                "follow.",
                "innovate.",
                "test.",
                "optimize.",
                "teach.",
                "visualize.",
                "transform.",
                "scale.",
                "do it.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="scroll-list-item"
                  style={{
                    "--i": index,
                    color: `oklch(
                      var(--lightness) var(--base-chroma) 
                      calc(var(--start) + (var(--step) * var(--i)))
                    )`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="final-section">
            <h2 className="final-title">fin.</h2>
          </section>
        </main>

        <footer className="page-footer">ʕ⊙ᴥ⊙ʔ jh3yy &copy; 2024</footer>

        <a
          href="https://twitter.com/intent/follow?screen_name=jh3yy"
          target="_blank"
          rel="noreferrer noopener"
          className="bear-link"
        >
          <svg
            viewBox="0 0 969 955"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="161.191"
              cy="320.191"
              r="133.191"
              stroke="currentColor"
              strokeWidth="20"
            />
            <circle
              cx="806.809"
              cy="320.191"
              r="133.191"
              stroke="currentColor"
              strokeWidth="20"
            />
            <circle cx="695.019" cy="587.733" r="31.4016" fill="currentColor" />
            <circle cx="272.981" cy="587.733" r="31.4016" fill="currentColor" />
            <path
              d="M564.388 712.083C564.388 743.994 526.035 779.911 483.372 779.911C440.709 779.911 402.356 743.994 402.356 712.083C402.356 680.173 440.709 664.353 483.372 664.353C526.035 664.353 564.388 680.173 564.388 712.083Z"
              fill="currentColor"
            />
            <rect
              x="310.42"
              y="448.31"
              width="343.468"
              height="51.4986"
              fill="#FF1E1E"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M745.643 288.24C815.368 344.185 854.539 432.623 854.539 511.741H614.938V454.652C614.938 433.113 597.477 415.652 575.938 415.652H388.37C366.831 415.652 349.37 433.113 349.37 454.652V511.741L110.949 511.741C110.949 432.623 150.12 344.185 219.845 288.24C289.57 232.295 384.138 200.865 482.744 200.865C581.35 200.865 675.918 232.295 745.643 288.24Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </>
  );
};

export default ScrollDemo;
