import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const SplashScreen = ({ onComplete }) => {
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const driverContainerRef = useRef(null);
    const planeRef = useRef(null);
    const dustRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            // Initial State
            gsap.set(circleRef.current, { scale: 0, opacity: 0 });
            gsap.set(driverContainerRef.current, { xPercent: -150, opacity: 0 });
            gsap.set(planeRef.current, { x: 0, y: 0 });
            gsap.set(dustRefs.current, { scale: 0, opacity: 0 });

            // 1. Circle Enters
            tl.to(circleRef.current, {
                duration: 1,
                scale: 1,
                opacity: 0.5,
                ease: "back.out(1.7)"
            });

            // 2. Driver Enters
            tl.to(driverContainerRef.current, {
                duration: 1,
                xPercent: 0,
                opacity: 1,
                ease: "power3.out"
            }, "-=0.5");

            // 3. Dust Animation (Staggered & Randomized)
            tl.fromTo(dustRefs.current, 
                { scale: 0, opacity: 0.8, x: 0, y: 0 },
                {
                    duration: () => gsap.utils.random(0.6, 1.2),
                    scale: () => gsap.utils.random(1.5, 3),
                    x: () => gsap.utils.random(-60, -20),
                    y: () => gsap.utils.random(-40, -10),
                    opacity: 0,
                    stagger: 0.05,
                    ease: "power2.out"
                }, 
                "<0.1"
            );

            // 4. Plane Floating (Continuous Loop)
            // We use a separate tween for the infinite loop so it doesn't block the timeline
            gsap.to(planeRef.current, {
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                motionPath: {
                    path: [
                        { x: 0, y: 0 },
                        { x: 10, y: -15 },
                        { x: -5, y: -25 },
                        { x: 0, y: 0 }
                    ],
                    curviness: 1.5
                }
            });

            // 5. Driver Vibration (Continuous Loop)
            gsap.to(driverContainerRef.current.querySelector('img.driver-img'), {
                duration: 0.1,
                x: "+=1",
                y: "-=1",
                repeat: -1,
                yoyo: true,
                ease: "none"
            });

            // 6. Wait / Hold
            tl.to({}, { duration: 1.5 });

            // 7. Exit Sequence (Driver + Plane together)
            tl.to(driverContainerRef.current, {
                duration: 0.8,
                xPercent: 150,
                opacity: 0,
                ease: "power2.in"
            });

            // 8. Dust Animation on Exit
            tl.fromTo(dustRefs.current, 
                { scale: 0, opacity: 0.8, x: 0, y: 0 },
                {
                    duration: () => gsap.utils.random(0.6, 1.2),
                    scale: () => gsap.utils.random(1.5, 3),
                    x: () => gsap.utils.random(-60, -20),
                    y: () => gsap.utils.random(-40, -10),
                    opacity: 0,
                    stagger: 0.05,
                    ease: "power2.out"
                }, 
                "<"
            );

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div ref={containerRef} className="absolute inset-0 bg-[#4c8479] z-[100] flex items-center justify-center overflow-hidden">
            
            {/* Circle */}
            <div ref={circleRef}>
                <img 
                    src="/criculo.svg" 
                    alt="Background Circle" 
                    className="w-64 h-64 md:w-80 md:h-80"
                />
            </div>

            {/* Driver Container (Holds Driver + Plane + Dust) */}
            <div ref={driverContainerRef} className="absolute">
                <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                    
                    {/* Dust Particles */}
                    <div className="absolute bottom-24 left-16 flex">
                        {[...Array(8)].map((_, i) => (
                            <div 
                                key={i}
                                ref={el => dustRefs.current[i] = el}
                                className="absolute w-6 h-6 bg-white/80 rounded-full blur-[2px]"
                            />
                        ))}
                    </div>

                    {/* Plane */}
                    <img 
                        ref={planeRef}
                        src="/avion.svg" 
                        alt="Paper Plane" 
                        className="absolute top-4 right-16 w-16 h-16 md:w-20 md:h-20"
                    />
                    
                    {/* Driver */}
                    <img 
                        src="/repartidor.svg" 
                        alt="Driver" 
                        className="driver-img w-48 h-48 md:w-60 md:h-60 object-contain drop-shadow-2xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
