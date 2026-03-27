import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * useAudioSystem
 * Synthesizes ambient soundscapes for each era using Web Audio API.
 * Syncs volume and frequency with the active storytelling section.
 */
export function useAudioSystem() {
    const audioCtx = useRef(null)
    const masterGain = useRef(null)
    const oscillators = useRef({})
    
    useEffect(() => {
        // Initialize Audio Context on first interaction
        const initAudio = () => {
            if (audioCtx.current) return
            
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
            masterGain.current = audioCtx.current.createGain()
            masterGain.current.connect(audioCtx.current.destination)
            masterGain.current.gain.value = 0.05 // Low master volume

            // Create oscillators for each section
            const sections = ['hero', 'arpanet', 'dotcom', 'social', 'web3', 'airevolution', 'spatial']
            sections.forEach((id, i) => {
                const osc = audioCtx.current.createOscillator()
                const gain = audioCtx.current.createGain()
                
                // Vibe based on era
                if (i === 0) osc.type = 'sine'        // Hero: Pure
                if (i === 1) osc.type = 'square'      // Arpanet: Computer
                if (i === 2) osc.type = 'sawtooth'    // Dotcom: High energy
                if (i === 3) osc.type = 'sine'        // Social: Soft
                if (i === 4) osc.type = 'triangle'    // Web3: Complex
                if (i === 5) osc.type = 'sawtooth'    // AI: Dense
                if (i === 6) osc.type = 'sine'        // Spatial: High freq

                osc.frequency.value = 100 + (i * 40)
                gain.gain.value = 0
                
                osc.connect(gain)
                gain.connect(masterGain.current)
                osc.start()
                
                oscillators.current[id] = gain
            })

            window.removeEventListener('click', initAudio)
            window.removeEventListener('touchstart', initAudio)
        }

        window.addEventListener('click', initAudio)
        window.addEventListener('touchstart', initAudio)

        // Track Active Section to cross-fade audio
        const sectionIds = ['hero', 'arpanet', 'dotcom', 'social', 'web3', 'airevolution', 'spatial']
        sectionIds.forEach((id) => {
            ScrollTrigger.create({
                trigger: `#${id}`,
                start: 'top 50%',
                end: 'bottom 50%',
                onToggle: (self) => {
                    if (self.isActive && oscillators.current[id]) {
                        // Fade in active, fade others out
                        sectionIds.forEach(sid => {
                            const g = oscillators.current[sid]
                            if (!g) return
                            gsap.to(g.gain, { 
                                value: sid === id ? 1 : 0, 
                                duration: 2, 
                                ease: 'power2.inOut' 
                            })
                        })
                    }
                }
            })
        })

        return () => {
            if (audioCtx.current) audioCtx.current.close()
        }
    }, [])
}
