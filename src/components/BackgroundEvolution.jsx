import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollVelocity } from '../hooks/useScrollVelocity'

/**
 * BackgroundEvolution
 * A high-end background system that evolves as the user scrolls.
 * Features parallax grids, nebula glows, and particle transitions.
 */
export default function BackgroundEvolution() {
    const bgRef = useRef(null)
    const velocity = useScrollVelocity()
    const velocityRef = useRef(0)

    useEffect(() => {
        velocityRef.current = velocity
    }, [velocity])

    useEffect(() => {
        const bg = bgRef.current
        if (!bg) return

        // Create parallax effect on background elements
        gsap.to('.bg-layer', {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * (0.1 + i * 0.05),
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
            }
        })

        // Transition background masks/glows based on section
        const sections = ['#hero', '#arpanet', '#dotcom', '#social', '#web3', '#airevolution', '#spatial']
        sections.forEach((id, i) => {
            ScrollTrigger.create({
                trigger: id,
                start: 'top 50%',
                onEnter: () => transitionBackground(i),
                onEnterBack: () => transitionBackground(i)
            })
        })

        function transitionBackground(index) {
            const colors = [
                'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.05) 0%, transparent 70%)', // Hero
                'radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.08) 0%, transparent 60%)', // Arpanet
                'radial-gradient(circle at 80% 40%, rgba(240, 171, 252, 0.08) 0%, transparent 60%)', // Dotcom
                'radial-gradient(circle at 30% 70%, rgba(96, 165, 250, 0.08) 0%, transparent 60%)', // Social
                'radial-gradient(circle at 50% 80%, rgba(129, 140, 248, 0.1) 0%, transparent 70%)',  // Web3
                'radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',  // AI
                'radial-gradient(circle at 80% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 70%)'    // Spatial
            ]
            
            gsap.to('.bg-glow-main', {
                background: colors[index],
                duration: 2,
                ease: 'power2.inOut'
            })
        }
    }, [])

    return (
        <div ref={bgRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617]">
            {/* Primary Glow */}
            <div className="bg-glow-main absolute inset-0 opacity-60" />
            
            {/* Deep Grid Layer */}
            <div className="bg-layer absolute inset-[-10%] bg-grid opacity-10" 
                 style={{ backgroundSize: '60px 60px' }} />
                 
            {/* Fine Grid Layer */}
            <div className="bg-layer absolute inset-[-10%] bg-grid opacity-5" 
                 style={{ backgroundSize: '20px 20px', transform: 'scale(1.1)' }} />
            
            {/* Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
        </div>
    )
}
