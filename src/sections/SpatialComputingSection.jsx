import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

export default function SpatialComputingSection() {
    const sectionRef = useRef(null)
    const containerRef = useRef(null)
    const velocity = useScrollVelocity()
    const timelineRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const container = containerRef.current
        if (!section || !container) return

        const layers = container.querySelectorAll('.spatial-layer')

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1.2,
                anticipatePin: 1
            }
        })
        timelineRef.current = tl

        // 3D Perspective Shift Animation
        tl.fromTo(container, 
            { rotateX: 15, rotateY: -15, scale: 0.8, opacity: 0 },
            { rotateX: 0, rotateY: 0, scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' }
        )

        // Staggered Layer Parallax (depth effect)
        layers.forEach((layer, i) => {
            const depth = (i + 1) * 100
            tl.to(layer, {
                z: depth,
                opacity: 1 - i * 0.2,
                duration: 1,
                ease: 'none'
            }, '<')
        })

        // Floating content reveal
        tl.fromTo('.spatial-content', 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: 'power4.out' },
            '-=0.5'
        )

        return () => tl.kill()
    }, [])

    useEffect(() => {
        if (timelineRef.current) {
            gsap.to(timelineRef.current, {
                timeScale: 1 + Math.abs(velocity / 500),
                duration: 0.5
            })
        }
    }, [velocity])

    // Smooth Mouse Parallax for the spatial container
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const xTo = gsap.quickTo(container, "rotationY", { duration: 1, ease: "power3" })
        const yTo = gsap.quickTo(container, "rotationX", { duration: 1, ease: "power3" })

        const onMouseMove = (e) => {
            const { clientX, clientY } = e
            const rect = container.getBoundingClientRect()
            const x = (clientX - (rect.left + rect.width / 2)) / 25
            const y = (clientY - (rect.top + rect.height / 2)) / 25
            xTo(x)
            yTo(-y)
        }

        window.addEventListener('mousemove', onMouseMove)
        return () => window.removeEventListener('mousemove', onMouseMove)
    }, [])

    return (
        <section 
            id="spatial" 
            ref={sectionRef} 
            className="section relative min-h-screen bg-[#020205] flex items-center justify-center overflow-hidden"
            style={{ perspective: '1200px' }}
        >
            <div className="absolute inset-0 bg-grid opacity-5" />
            
            <div ref={containerRef} className="relative w-full max-w-5xl h-[450px] md:h-[600px] flex items-center justify-center scale-90 md:scale-100">
                {/* 3D Holographic Layers */}
                <div className="spatial-layer absolute w-[90%] md:w-[80%] h-[90%] md:h-[80%] border border-blue-500/20 rounded-[2rem] md:rounded-[3rem] bg-blue-500/5 backdrop-blur-sm" />
                <div className="spatial-layer absolute w-[80%] md:w-[70%] h-[80%] md:h-[70%] border border-cyan-400/20 rounded-[1.5rem] md:rounded-[2.5rem] bg-cyan-400/5 backdrop-blur-md" />
                <div className="spatial-layer absolute w-[70%] md:w-[60%] h-[70%] md:h-[60%] border border-emerald-400/20 rounded-[1rem] md:rounded-[2rem] bg-emerald-400/5 backdrop-blur-lg" />
                
                {/* Content Overlay */}
                <div className="relative z-10 text-center px-6 md:px-12">
                    <span className="year-badge mb-6 md:mb-8 inline-block spatial-content" style={{ color: '#22d3ee', borderColor: '#22d3ee', fontSize: '10px' }}>
                        2024 → Future — Spatial Web
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-8xl font-display font-bold leading-tight mb-6 md:mb-8 spatial-content">
                        Reality <br />
                        <span className="gradient-text-cyber glow-text-blue">Augmented</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm md:text-xl max-w-2xl mx-auto leading-relaxed spatial-content">
                        The screen disappears. Digital intelligence merges with the physical world. 
                        We no longer look at the internet—we live inside it.
                    </p>
                    
                    <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-6 spatial-content">
                        <div className="glass-card px-4 md:px-6 py-2 md:py-3 border-blue-500/30">
                            <div className="text-[8px] md:text-xs font-mono text-blue-400 uppercase tracking-widest">Digital Twins</div>
                        </div>
                        <div className="glass-card px-4 md:px-6 py-2 md:py-3 border-cyan-400/30">
                            <div className="text-[8px] md:text-xs font-mono text-cyan-400 uppercase tracking-widest">AR Mesh</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating particles background */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: Math.random()
                        }}
                    />
                ))}
            </div>
        </section>
    )
}
