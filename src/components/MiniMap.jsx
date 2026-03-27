import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SECTIONS = [
    { id: 'hero', label: 'Start' },
    { id: 'arpanet', label: 'ARPANET' },
    { id: 'dotcom', label: 'Dotcom' },
    { id: 'social', label: 'Social' },
    { id: 'web3', label: 'Future' },
    { id: 'airevolution', label: 'AI' },
    { id: 'spatial', label: 'Spatial' }
]

/**
 * MiniMap
 * A lateral navigation component that shows current section nodes.
 * Features smooth scrolling and animated active states.
 */
export default function MiniMap() {
    const [activeSection, setActiveSection] = useState('hero')

    useEffect(() => {
        SECTIONS.forEach(({ id }) => {
            ScrollTrigger.create({
                trigger: `#${id}`,
                start: 'top 50%',
                end: 'bottom 50%',
                onToggle: (self) => {
                    if (self.isActive) setActiveSection(id)
                }
            })
        })
    }, [])

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) {
            gsap.to(window, {
                scrollTo: { y: el, autoKill: false },
                duration: 1.5,
                ease: 'power4.inOut'
            })
        }
    }

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-center">
            {SECTIONS.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="group relative flex items-center justify-center w-3 h-3"
                    title={section.label}
                >
                    {/* Tooltip */}
                    <span className="absolute right-8 text-[10px] font-mono text-white opacity-0 group-hover:opacity-40 transition-opacity duration-300 whitespace-nowrap tracking-widest uppercase">
                        {section.label}
                    </span>
                    
                    {/* Node Dot */}
                    <div 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 
                            ${activeSection === section.id 
                                ? 'bg-[var(--accent-color)] scale-150 shadow-[0_0_12px_var(--accent-color)]' 
                                : 'bg-white/20 hover:bg-white/50'}`} 
                    />

                    {/* Active Ring */}
                    {activeSection === section.id && (
                        <div className="absolute inset-[-4px] border border-[var(--accent-color)] opacity-40 rounded-full animate-ping" 
                             style={{ animationDuration: '3s' }} />
                    )}
                </button>
            ))}
        </div>
    )
}
