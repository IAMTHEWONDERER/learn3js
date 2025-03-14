import React, { useMemo } from 'react';

const AnimatedSlides = ({ scrollPercentage }) => {
    const slides = [
        {
            title: "Modern Architecture",
            description: "Innovative designs reshaping our urban landscape",
            number: "01"
        },
        {   
            title: "Sustainable Building",
            description: "Creating eco-friendly structures for a better tomorrow",
            number: "02"
        },
        {
            title: "Urban Living",
            description: "Redefining city life through thoughtful design",
            number: "03"
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
                width: '60%',
                maxWidth: '700px',
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
                    <div className="slide-number" 
                        style={{
                            fontSize: 'clamp(6rem, 12vw, 10rem)',
                            fontFamily: 'Quinn, sans-serif',
                            fontWeight: 'bold',
                            opacity: 0.8,
                            marginBottom: '-10rem',
                            color: '#c8710d',
                            position: 'relative',
                            zIndex: 1
                        }}>
                        {slide.number}
                    </div>
                    
                    <h2 className="slide-title"
                        style={{
                            fontSize: 'clamp(4rem, 8vw, 7rem)',
                            fontFamily: 'Quinn, sans-serif',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            color: '#0a3c5c',
                            position: 'relative',
                            zIndex: 2,
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            width: '100%'
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
