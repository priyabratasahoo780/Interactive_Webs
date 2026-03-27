import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

const NEURONS = [
    { id: 1, x: 20, y: 50 },
    { id: 2, x: 40, y: 30 },
    { id: 3, x: 40, y: 70 },
    { id: 4, x: 60, y: 20 },
    { id: 5, x: 60, y: 50 },
    { id: 6, x: 60, y: 80 },
    { id: 7, x: 80, y: 50 },
]

const SYNAPSES = [
    [1, 2], [1, 3], [2, 4], [2, 5], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
]

export default function AIRevolutionSection() {
    const sectionRef = useRef(null)
    const svgRef = useRef(null)
    const velocity = useScrollVelocity()
    const timelineRef = useRef(null)

    useEffect(() => {
        const section = sectionRef.current
        const svg = svgRef.current
        if (!section || !svg) return

        const lines = svg.querySelectorAll('.synapse')
        const nodes = svg.querySelectorAll('.neuron')

        // Initial state
        gsap.set(lines, { strokeDasharray: 100, strokeDashoffset: 100, opacity: 0.2 })
        gsap.set(nodes, { scale: 0, opacity: 0 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=250%',
                pin: true,
                scrub: 1.5,
                anticipatePin: 1
            }
        })
        timelineRef.current = tl

        // 1. Reveal Network
        tl.to(nodes, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)' })
          .to(lines, { strokeDashoffset: 0, opacity: 0.6, stagger: 0.05, duration: 1 }, '-=0.5')

        // 2. Continuous "Firing" logic
        const firingTl = gsap.timeline({ repeat: -1 })
        SYNAPSES.forEach(([from, to], i) => {
            const line = svg.querySelector(`.synapse-${from}-${to}`)
            if (line) {
                firingTl.to(line, { 
                    stroke: '#fbbf24', 
                    strokeWidth: 2,
                    opacity: 1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.in'
                }, i * 0.1)
            }
        })

        return () => {
            tl.kill()
            firingTl.kill()
        }
    }, [])

    useEffect(() => {
        if (timelineRef.current) {
            gsap.to(timelineRef.current, {
                timeScale: 1 + Math.abs(velocity / 400),
                duration: 0.5
            })
        }
    }, [velocity])

    return (
        <section 
            id="airevolution" 
            ref={sectionRef} 
            className="section relative min-h-screen bg-[#050510] flex items-center overflow-hidden"
        >
            <div className="absolute inset-0 bg-grid opacity-10" />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="year-badge mb-6 inline-block" style={{ color: '#fbbf24', borderColor: '#fbbf24' }}>
                        2023 — The AI Revolution
                    </span>
                    <h2 data-guide-id="ai-title" className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 gradient-text-fire glow-text-pink">
                        The Neural Dawn
                        <span className="gradient-text-aurora glow-text-amber"> Awakening</span>
                    </h2>
                    <p data-guide-id="ai-desc" className="text-[var(--text-secondary)] text-lg max-w-md leading-relaxed">
                        The internet is no longer just a library of data. It has become a cognitive layer. 
                        Machines now generate, reason, and create alongside us.
                    </p>
                </div>

                <div className="relative aspect-square max-w-lg mx-auto lg:mx-0">
                    <svg ref={svgRef} data-guide-id="ai-brain-svg" viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                        {/* Synapses */}
                        {SYNAPSES.map(([from, to]) => {
                            const n1 = NEURONS.find(n => n.id === from)
                            const n2 = NEURONS.find(n => n.id === to)
                            return (
                                <line 
                                    key={`${from}-${to}`}
                                    className={`synapse synapse-${from}-${to}`}
                                    x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                                    stroke="rgba(251, 191, 36, 0.3)"
                                    strokeWidth="0.5"
                                />
                            )
                        })}
                        {/* Neurons */}
                        {NEURONS.map(n => (
                            <g key={n.id} className="neuron" data-guide-id={`ai-neuron-${n.id}`}>
                                <circle cx={n.x} cy={n.y} r="2.5" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
                                <circle cx={n.x} cy={n.y} r="5" fill="none" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="0.2" />
                            </g>
                        ))}
                    </svg>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <div className="text-[8px] font-mono text-amber-500/40 uppercase tracking-[0.5em] animate-pulse">
                            Processing Reality...
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
