import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Section3 = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const separatorRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation code mirroring Section2
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(separatorRef.current, {
        width: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".s3_paragraph", {
        y: 20,
        opacity: 0,
        stagger: 0.25,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(buttonRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="s3_container">
      <div className="s3_wrapper">
        <h1 ref={titleRef} className="s3_title">
          NOTRE APPROCHE ÉCLAIRÉE
        </h1>
        <div ref={separatorRef} className="s3_separator"></div>

        <div ref={contentRef} className="s3_content">
          <p className="s3_paragraph">
            Dans un monde en constante évolution, notre vision se reflète dans
            une recherche continue d'équilibre entre{" "}
            <span className="s3_emphasis">innovation technologique</span> et{" "}
            <span className="s3_emphasis">bien-être collectif</span>.
          </p>

          <p className="s3_paragraph">
            En rassemblant des talents divers et en encourageant des
            interactions constructives, nous œuvrons pour un avenir où chaque
            initiative contribue à un{" "}
            <span className="s3_emphasis">impact positif et durable</span>.
          </p>

          <p className="s3_paragraph">
            Chez <span className="s3_brand">Techniq8</span>, nous croyons que la
            transformation digitale réussie passe par une{" "}
            <span className="s3_emphasis">compréhension profonde</span> des
            enjeux humains et organisationnels qui l'accompagnent.
          </p>

          <button ref={buttonRef} className="s3_button">
            A propos
          </button>
        </div>
      </div>

      <style jsx>{`
        .s3_container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: clamp(1rem, 3vw, 2rem);
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.9);
          background-image: url("https://res.cloudinary.com/dyecicotf/image/upload/v1742398022/gain_dea69g.png");
          background-size: cover;
          background-position: center;
          font-family: "Poppins", sans-serif;
          position: relative;
          z-index: 5;
        }

        .s3_wrapper {
          max-width: min(1000px, 90%);
          margin: 0 auto;
          padding: clamp(1rem, 2vw, 2rem);
          position: relative;
        }

        .s3_title {
          color: #0b3b59;
          font-size: clamp(2.5rem, 6vw, 7rem);
          font-weight: bold;
          margin-bottom: clamp(1rem, 2vw, 1.5rem);
          letter-spacing: 2px;
          font-family: "Quinn", sans-serif;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          transform-origin: left;
        }

        .s3_separator {
          height: clamp(4px, 0.6vw, 6px);
          width: 100%;
          background: linear-gradient(90deg, #18b7be 0%, #0b3b59 100%);
          margin-bottom: clamp(2rem, 4vw, 3rem);
          border-radius: 2px;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        }

        .s3_content {
          display: flex;
          flex-direction: column;
          gap: clamp(1rem, 2vw, 2rem);
          position: relative;
        }

        .s3_paragraph {
          font-size: clamp(0.7rem, 1.26vw, 1.54rem);
          line-height: 1.5;
          color: #333;
          margin: 0;
          position: relative;
          font-family: "Poppins", sans-serif;
        }

        .s3_brand {
          font-weight: bold;
          color: #18b7be;
          transition: color 0.3s ease;
        }

        .s3_emphasis {
          font-weight: bold;
          color: #0b3b59;
          text-shadow: 0px 0px 1px rgba(11, 59, 89, 0.2);
        }

        .s3_button {
          background-color: #0b3b59;
          color: white;
          border: 2px solid #0b3b59;
          border-radius: 3px;
          padding: clamp(0.8rem, 1.5vw, 1.2rem) clamp(1.5rem, 2.5vw, 2.25rem);
          font-size: clamp(1rem, 1.5vw, 1.5rem);
          font-weight: 600;
          cursor: pointer;
          margin-top: clamp(1.5rem, 2.5vw, 2rem);
          align-self: flex-start;
          transition: all 0.3s ease;
          font-family: "Poppins", sans-serif;
        }

        .s3_button:hover {
          background-color: transparent;
          color: #0b3b59;
        }

        @media (max-width: 480px) {
          .s3_container {
            padding: 1rem;
          }

          .s3_wrapper {
            padding: 0.5rem;
          }

          .s3_button {
            align-self: center;
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Section3;
