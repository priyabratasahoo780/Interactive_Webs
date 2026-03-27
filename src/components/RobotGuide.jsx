import { useEffect, useState, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useVoiceNarration } from '../hooks/useVoiceNarration'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useRobotFlow } from '../hooks/useRobotFlow'
import { useAutoInteraction } from '../hooks/useAutoInteraction'

export default function RobotGuide({ isActive, onExit }) {
    const [sectionIdx, setSectionIdx] = useState(0)
    const [nodeIdx, setNodeIdx] = useState(0)
    const [robotState, setRobotState] = useState('idle') // idle, walking, talking, pointing
    
    const { speak, stop, isSpeaking } = useVoiceNarration()
    const { scrollToSection } = useAutoScroll()
    const { TOUR_FLOW } = useRobotFlow()
    const { triggerInteraction } = useAutoInteraction()

    const robotRef = useRef(null)
    const containerRef = useRef(null)

    // Handle the full tour flow
    useEffect(() => {
        if (!isActive) {
            stop()
            setSectionIdx(0)
            setNodeIdx(0)
            resetCamera()
            return
        }

        const runTour = async () => {
            // Click-to-Jump Interruption Logic
            const handleJump = (e) => {
                const target = e.target.closest('[data-guide-id]')
                if (target && isActive) {
                    const id = target.getAttribute('data-guide-id')
                    // Find node in TOUR_FLOW
                    TOUR_FLOW.forEach((section, sIdx) => {
                        section.nodes.forEach((node, nIdx) => {
                            if (node.id === id) {
                                setSectionIdx(sIdx)
                                setNodeIdx(nIdx)
                                // This is a simplified jump; in a real production app we'd 
                                // use an AbortController or a state-based queue.
                            }
                        })
                    })
                }
            }
            document.addEventListener('click', handleJump)

            for (let s = 0; s < TOUR_FLOW.length; s++) {
                if (!isActive) break;
                const section = TOUR_FLOW[s]
                setSectionIdx(s)

                // 1. Move to Section
                setRobotState('walking')
                scrollToSection(section.section, 4.0)
                await new Promise(r => setTimeout(r, 4500))

                for (let n = 0; n < section.nodes.length; n++) {
                    if (!isActive) break;
                    const node = section.nodes[n]
                    setNodeIdx(n)

                    // 2. Walk to Feature & Focus Camera
                    setRobotState('walking')
                    focusOnNode(node.id)
                    await new Promise(r => setTimeout(r, 2000))

                    // 3. Point & Interact
                    setRobotState('pointing')
                    if (node.action) {
                        triggerInteraction(node.id, node.action)
                        await new Promise(r => setTimeout(r, 800))
                    }

                    // 4. Talk
                    setRobotState('talking')
                    speak(node.text)
                    await new Promise(r => setTimeout(r, node.duration || 5000))
                }

                if (s === TOUR_FLOW.length - 1) {
                    setRobotState('idle')
                    setTimeout(() => onExit(), 3000)
                }
            }
        }

        runTour()
    }, [isActive])

    // Smart Camera Logic
    const focusOnNode = (nodeId) => {
        const el = document.querySelector(`[data-guide-id="${nodeId}"]`)
        const root = document.getElementById('root')
        if (!el || !root) return

        const rect = el.getBoundingClientRect()
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        const moveX = (centerX - rect.left - rect.width / 2) * 0.5
        const moveY = (centerY - rect.top - rect.height / 2) * 0.5

        gsap.to(root, {
            scale: 1.15,
            x: moveX,
            y: moveY,
            duration: 1.5,
            ease: 'power3.inOut'
        })
        root.classList.add('camera-zoom-active')
    }

    const resetCamera = () => {
        const root = document.getElementById('root')
        if (root) {
            gsap.to(root, { scale: 1, x: 0, y: 0, duration: 1.5, ease: 'power3.inOut' })
            root.classList.remove('camera-zoom-active')
        }
    }

    if (!isActive) return null

    return (
        <div ref={containerRef} className="fixed inset-0 z-[300] pointer-events-none">
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] animate-fade-in" />

            {/* UPGRADED 3D-STYLE ROBOT */}
            <div 
                ref={robotRef} 
                className="absolute transition-all duration-1000 ease-in-out pointer-events-auto"
                style={{
                    right: '10%',
                    bottom: '15%',
                    width: '180px',
                    height: '180px'
                }}
            >
                <div className={`relative w-full h-full robot-wrapper state-${robotState}`}>
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_50px_rgba(34,211,238,0.4)]">
                        <defs>
                            <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#334155" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Floating Shadow */}
                        <ellipse cx="50" cy="95" rx="20" ry="5" fill="rgba(0,0,0,0.3)" />

                        {/* Robot Body (3D effect) */}
                        <path 
                            d="M30 40 Q50 35 70 40 L75 80 Q50 85 25 80 Z" 
                            fill="url(#robotBody)" 
                            stroke="#22d3ee" 
                            strokeWidth="1.5"
                        />

                        {/* Emotive Face Plate */}
                        <rect x="35" y="45" width="30" height="20" rx="8" fill="#000" />
                        
                        {/* Eyes based on state */}
                        <g className={robotState === 'talking' ? 'animate-pulse' : ''}>
                            <circle cx="42" cy="55" r="2.5" fill="#22d3ee" filter="url(#glow)" />
                            <circle cx="58" cy="55" r="2.5" fill="#22d3ee" filter="url(#glow)" />
                        </g>

                        {/* Pointing Arm */}
                        {robotState === 'pointing' && (
                            <path 
                                d="M70 60 L90 50 L85 45" 
                                fill="none" 
                                stroke="#22d3ee" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                className="animate-point"
                            />
                        )}

                        {/* Antenna (Reactivity) */}
                        <line x1="50" y1="40" x2="50" y2="30" stroke="#22d3ee" strokeWidth="2" />
                        <circle cx="50" cy="30" r="2" fill="#22d3ee" className="animate-ping" />
                    </svg>
                </div>

                {/* Live Caption/Narration */}
                {isSpeaking && (
                    <div className="absolute -top-24 right-0 bg-black/80 border border-cyan-400/40 p-4 rounded-2xl backdrop-blur-xl w-64 shadow-2xl animate-slide-up">
                        <div className="text-[10px] font-mono text-cyan-400/60 uppercase mb-2 tracking-tighter flex justify-between">
                            <span>Narration Active</span>
                            <span className="animate-pulse">●</span>
                        </div>
                        <p className="text-sm font-display text-white/90 leading-tight">
                            {TOUR_FLOW[sectionIdx].nodes[nodeIdx].text}
                        </p>
                    </div>
                )}
            </div>

            {/* Tour HUD */}
            <div className="absolute top-12 left-12 space-y-4 pointer-events-auto">
                <div className="glass-card p-6 border-cyan-400/20 w-72 backdrop-blur-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Immersive Demo</span>
                        <button onClick={onExit} className="ml-auto text-white/40 hover:text-red-400 transition-colors">✕</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="text-[9px] text-white/40 uppercase mb-1">Current Section</div>
                            <div className="text-lg font-bold text-white capitalize">{TOUR_FLOW[sectionIdx].section}</div>
                        </div>
                        
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-cyan-400 transition-all duration-1000"
                                style={{ width: `${((sectionIdx + 1) / TOUR_FLOW.length) * 100}%` }}
                            />
                        </div>

                        <div className="text-[9px] font-mono text-cyan-400/60">
                            Exploring Feature {nodeIdx + 1} of {TOUR_FLOW[sectionIdx].nodes.length}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onExit}
                    className="glass-card px-8 py-3 w-full border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all text-xs font-mono uppercase tracking-[0.2em]"
                >
                    Abort Experience
                </button>
            </div>
        </div>
    )
}
