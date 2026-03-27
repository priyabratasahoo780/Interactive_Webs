import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useVoiceNarration } from '../hooks/useVoiceNarration'
import { useAutoScroll } from '../hooks/useAutoScroll'

const TOUR_SCRIPT = [
    { 
        id: 'hero', 
        label: 'Intro',
        text: "Hello. I am your AI guide. Let's explore the incredible journey of how the internet evolved from a small network to a global consciousness.",
        delay: 2000 
    },
    { 
        id: 'arpanet', 
        label: 'ARPANET',
        text: "It all started here in 1969. ARPANET was the first packet-switching network. A rigid, experimental grid that changed everything.",
        delay: 4000 
    },
    { 
        id: 'dotcom', 
        label: 'Dotcom',
        text: "By the 90s, the web exploded. Dotcom fever took over, bringing bright colors, interactivity, and the first taste of a digital economy.",
        delay: 5000 
    },
    { 
        id: 'social', 
        label: 'Social',
        text: "Then came the Social Age. We stopped just browsing and started connecting. The internet became a mirror of our lives.",
        delay: 5000 
    },
    { 
        id: 'web3', 
        label: 'Web3',
        text: "Now we face the decentralized frontier. Web 3 is about ownership, privacy, and returning the power to the users.",
        delay: 5000 
    },
    { 
        id: 'airevolution', 
        label: 'AI',
        text: "And here we are today. The AI Revolution. The network has begun to think, reasoning and creating alongside humans.",
        delay: 6000 
    },
    { 
        id: 'spatial', 
        label: 'Spatial',
        text: "And the Spatial Web. Where the screen disappears, and reality itself becomes an interactive digital layer.",
        delay: 6000 
    },
    { 
        id: 'footer', 
        label: 'Conclusion',
        text: "The story of the internet isn't over. It is now in your hands. What will we build next? Thank you for exploring this evolution with me.",
        delay: 8000 
    }
]

export default function RobotGuide({ isActive, onExit }) {
    const [step, setStep] = useState(0)
    const { speak, stop, pause, resume, isSpeaking } = useVoiceNarration()
    const { scrollToSection } = useAutoScroll()
    const robotRef = useRef(null)

    useEffect(() => {
        if (!isActive) {
            stop()
            setStep(0)
            return
        }

        const runTour = async () => {
            for (let i = 0; i < TOUR_SCRIPT.length; i++) {
                if (!isActive) break;
                setStep(i)
                const current = TOUR_SCRIPT[i]
                
                // 1. Scroll to section - Ultimate cinematic slow scroll
                scrollToSection(current.id, 5.0)
                await new Promise(r => setTimeout(r, 5500))

                // 2. Speak the text
                speak(current.text)
                
                // 3. Wait for the estimated duration or until speaking ends
                const charDuration = current.text.length * 60 // Roughly 60ms per char
                await new Promise(r => setTimeout(r, Math.max(charDuration, current.delay)))
                
                if (i === TOUR_SCRIPT.length - 1) {
                    setTimeout(() => onExit(), 3000)
                }
            }
        }

        runTour()
    }, [isActive])

    // Robot Floating Animation
    useEffect(() => {
        if (!robotRef.current) return
        gsap.to(robotRef.current, {
            y: '-=15',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        })
    }, [isActive])

    if (!isActive) return null

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Cinematic Dimming */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 animate-fade-in" />
            
            {/* Robot Character */}
            <div ref={robotRef} className="absolute right-12 bottom-32 w-48 h-48 pointer-events-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    {/* Robot Head */}
                    <rect x="25" y="20" width="50" height="40" rx="10" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
                    {/* Eyes */}
                    <circle cx="40" cy="35" r="4" fill={isSpeaking ? '#22d3ee' : '#0f172a'} className={isSpeaking ? 'animate-pulse' : ''} />
                    <circle cx="60" cy="35" r="4" fill={isSpeaking ? '#22d3ee' : '#0f172a'} className={isSpeaking ? 'animate-pulse' : ''} />
                    {/* Body */}
                    <path d="M35 60 L65 60 L75 90 L25 90 Z" fill="#334155" stroke="#22d3ee" strokeWidth="2" />
                    {/* Glowing Core */}
                    <circle cx="50" cy="75" r="5" fill="#facc15" className="animate-pulse" />
                </svg>

                {/* Speech Bubble */}
                {isSpeaking && (
                    <div className="absolute -top-16 right-0 bg-black/80 border border-cyan-400/30 px-4 py-2 rounded-xl backdrop-blur-md max-w-xs">
                        <div className="text-[10px] font-mono text-cyan-400 tracking-wider leading-relaxed">
                            {TOUR_SCRIPT[step].text}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls HUD */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
                <button 
                    onClick={onExit}
                    className="glass-card px-6 py-2 border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-[10px] font-mono tracking-widest"
                >
                    Exit Tour
                </button>
                <div className="glass-card px-6 py-4 border-cyan-400/30">
                    <div className="text-[8px] font-mono text-cyan-400/60 uppercase mb-2">Guided Mode Active</div>
                    <div className="text-[12px] font-mono text-white/90">Section: {TOUR_SCRIPT[step].label}</div>
                </div>
            </div>
        </div>
    )
}
