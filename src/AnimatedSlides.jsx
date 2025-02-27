import React, { useMemo } from 'react';

const AnimatedSlides = ({ scrollPercentage }) => {
    const slides = [
        {
            title: "Modern Architecture",
            description: "Innovative designs reshaping our urban landscape",
            number: "01",
            svgPath: "M10,50 Q25,25 40,50 T70,50"
        },
        {   
            title: "Sustainable Building",
            description: "Creating eco-friendly structures for a better tomorrow",
            number: "02",
            svgPath: "M10,30 Q40,10 50,50 T90,40"
        },
        {
            title: "Urban Living",
            description: "Redefining city life through thoughtful design",
            number: "03",
            svgPath: "M10,60 Q30,20 50,60 T90,30"
        }
    ];

    const visibleSlideIndex = useMemo(() => {
        if (scrollPercentage < 0.33) return 0;
        if (scrollPercentage < 0.66) return 1;
        return 2;
    }, [scrollPercentage]);

    const slideProgresses = useMemo(() => {
        return slides.map((_, index) => {
            const slideStart = index * 0.33;
            const slideEnd = slideStart + 0.33;
            
            if (scrollPercentage < slideStart) return 0;
            if (scrollPercentage > slideEnd) return 1;
            
            return (scrollPercentage - slideStart) / (slideEnd - slideStart);
        });
    }, [scrollPercentage, slides]);

    const slideStyles = useMemo(() => {
        return slides.map((_, index) => {
            const slideProgress = slideProgresses[index];
            
            let translateX = '100%';
            let opacity = 0;
            
            if (index === visibleSlideIndex) {
                if (slideProgress < 0.2) {
                    const entryProgress = slideProgress / 0.2;
                    translateX = `${100 - (entryProgress * 100)}%`;
                    opacity = entryProgress;
                }
                else if (slideProgress >= 0.2 && slideProgress < 0.8) {
                    translateX = '0%';
                    opacity = 1;
                }
                else {
                    const exitProgress = (slideProgress - 0.8) / 0.2;
                    translateX = `${-100 * exitProgress}%`;
                    opacity = 1 - exitProgress;
                }
            }
            else if (index < visibleSlideIndex) {
                translateX = '-100%';
            }
            else {
                translateX = '100%';
            }
            
            return {
                position: 'absolute',
                right: '15%',
                width: '60%', // Increased from 50% to 60% for more space
                maxWidth: '700px', // Increased from 600px to 700px
                padding: '2rem',
                transform: `translateX(${translateX})`,
                opacity: opacity,
                willChange: 'transform, opacity',
                transition: index === visibleSlideIndex ? 'none' : 'transform 0.1s ease-out, opacity 0.1s ease-out',
            };
        });
    }, [slides, visibleSlideIndex, slideProgresses]);

    return (
        <div className="animated-slides-container" 
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 20,
            }}>
            
            {slides.map((slide, index) => (
                <div 
                    key={index}
                    className="slide"
                    style={slideStyles[index]}
                >
                    {/* SVG moved before the number to position it behind */}
                    <div className="slide-svg"
                        style={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%', // Adjusted from 70% to 50%
                            transform: 'translate(-50%, -50%)',
                            width: '100%', // Increased from 80% to 100%
                            height: '100%', // Increased from 80% to 100%
                            zIndex: -1, // Ensures it stays behind text
                            animation: 'float 6s ease-in-out infinite'
                        }}>
                        <svg 
                            viewBox="0 0 100 100" 
                            width="100%" 
                            height="100%"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="50" cy="50" r="20" fill="#aadbed" opacity="0.3">
                                <animate
                                    attributeName="cx"
                                    values="50;52;50;48;50"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="cy"
                                    values="50;48;50;52;50"
                                    dur="4s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="45" cy="45" r="15" fill="#0a3c5c" opacity="0.2">
                                <animate
                                    attributeName="cx"
                                    values="45;47;45;43;45"
                                    dur="5s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="cy"
                                    values="45;43;45;47;45"
                                    dur="5s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            <circle cx="55" cy="55" r="10" fill="#c8710d" opacity="0.1">
                                <animate
                                    attributeName="cx"
                                    values="55;57;55;53;55"
                                    dur="6s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="cy"
                                    values="55;53;55;57;55"
                                    dur="6s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                        </svg>
                    </div>

                    <div className="slide-number" 
                        style={{
                            fontSize: 'clamp(6rem, 12vw, 10rem)',
                            fontFamily: 'Quinn, sans-serif',
                            fontWeight: 'bold',
                            opacity: 0.8,
                            marginBottom: '-5rem',
                            color: '#c8710d',
                            position: 'relative',
                            zIndex: 1
                        }}>
                        {slide.number}
                    </div>
                    
                    <h2 className="slide-title"
                        style={{
                            fontSize: 'clamp(4rem, 8vw, 7rem)', // Increased from 3rem to 4rem
                            fontFamily: 'Quinn, sans-serif',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: '#0a3c5c',
                            position: 'relative',
                            zIndex: 2,
                            whiteSpace: 'nowrap', // Ensures title stays on one line
                            overflow: 'visible', // Allows text to extend if needed
                            width: '100%' // Ensures full width usage
                        }}>
                        {slide.title}
                    </h2>
                    
                    <p className="slide-description"
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                            maxWidth: '80%',
                            color: '#444',
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: '600',
                            position: 'relative',
                            zIndex: 2
                        }}>
                        {slide.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default React.memo(AnimatedSlides);